import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getOrderItemById, updateOrderItemById } from 'apiSdk/order-items';
import { orderItemValidationSchema } from 'validationSchema/order-items';
import { OrderItemInterface } from 'interfaces/order-item';
import { OrderInterface } from 'interfaces/order';
import { MenuInterface } from 'interfaces/menu';
import { getOrders } from 'apiSdk/orders';
import { getMenus } from 'apiSdk/menus';

function OrderItemEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<OrderItemInterface>(
    () => (id ? `/order-items/${id}` : null),
    () => getOrderItemById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OrderItemInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOrderItemById(id, values);
      mutate(updated);
      resetForm();
      router.push('/order-items');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<OrderItemInterface>({
    initialValues: data,
    validationSchema: orderItemValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Order Items',
              link: '/order-items',
            },
            {
              label: 'Update Order Item',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Order Item
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Quantity"
            formControlProps={{
              id: 'quantity',
              isInvalid: !!formik.errors?.quantity,
            }}
            name="quantity"
            error={formik.errors?.quantity}
            value={formik.values?.quantity}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Sub Total"
            formControlProps={{
              id: 'sub_total',
              isInvalid: !!formik.errors?.sub_total,
            }}
            name="sub_total"
            error={formik.errors?.sub_total}
            value={formik.values?.sub_total}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('sub_total', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<OrderInterface>
            formik={formik}
            name={'order_id'}
            label={'Select Order'}
            placeholder={'Select Order'}
            fetcher={getOrders}
            labelField={'delivery_address'}
          />
          <AsyncSelect<MenuInterface>
            formik={formik}
            name={'menu_id'}
            label={'Select Menu'}
            placeholder={'Select Menu'}
            fetcher={getMenus}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/order-items')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'order_item',
    operation: AccessOperationEnum.UPDATE,
  }),
)(OrderItemEditPage);
