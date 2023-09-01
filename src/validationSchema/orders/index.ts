import * as yup from 'yup';

export const orderValidationSchema = yup.object().shape({
  delivery_address: yup.string().nullable(),
  total_price: yup.number().integer().nullable(),
  status: yup.string().nullable(),
  order_date: yup.date().nullable(),
  delivery_date: yup.date().nullable(),
  user_id: yup.string().nullable().required(),
});
