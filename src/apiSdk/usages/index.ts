import axios from 'axios';
import queryString from 'query-string';
import { UsageInterface, UsageGetQueryInterface } from 'interfaces/usage';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getUsages = async (query?: UsageGetQueryInterface): Promise<PaginatedInterface<UsageInterface>> => {
  const response = await axios.get('/api/usages', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createUsage = async (usage: UsageInterface) => {
  const response = await axios.post('/api/usages', usage);
  return response.data;
};

export const updateUsageById = async (id: string, usage: UsageInterface) => {
  const response = await axios.put(`/api/usages/${id}`, usage);
  return response.data;
};

export const getUsageById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/usages/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUsageById = async (id: string) => {
  const response = await axios.delete(`/api/usages/${id}`);
  return response.data;
};
