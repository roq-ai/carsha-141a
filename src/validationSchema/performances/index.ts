import * as yup from 'yup';

export const performanceValidationSchema = yup.object().shape({
  date: yup.date().required(),
  usage_rate: yup.number().integer().required(),
  demand_rate: yup.number().integer().required(),
  vehicle_id: yup.string().nullable().required(),
  analyst_id: yup.string().nullable().required(),
});
