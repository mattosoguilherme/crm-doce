
import { HttpModuleOptions } from '@nestjs/axios';

export const axiosConfig: HttpModuleOptions = {
  timeout: 5000,
  maxRedirects: 5,
  baseURL: 'http://localhost:3004', // A URL base da sua API Python
  headers: {
    'Content-Type': 'application/json',
  },
};
