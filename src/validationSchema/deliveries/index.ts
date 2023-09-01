import * as yup from 'yup';

export const deliveryValidationSchema = yup.object().shape({
  delivery_time: yup.date().nullable(),
  status: yup.string().nullable(),
  delivery_address: yup.string().nullable(),
  order_id: yup.string().nullable().required(),
  driver_id: yup.string().nullable().required(),
});
