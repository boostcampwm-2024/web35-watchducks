import { ProjectNames, ResponseRate, Traffic, Ranking } from '@type/api';

import { api } from './axios';

const getGroupNames = async (generation: string) => {
  const response = await api.get<ProjectNames[]>(`/project?generation=${generation}`);
  return response.data;
};

const getRakings = async () => {
  const response = await api.get<Ranking[]>(`/log/traffic/rank`);
  return response.data;
};

const getTotalTraffic = async () => {
  const response = await api.get<Traffic>(`/log/traffic`);
  return response.data;
};

const getTotalProjectCount = async (generation: string) => {
  const response = await api.get<Traffic>(`/project/count?generation=${generation}`);
  return response.data;
};

const getTotalResponseRate = async () => {
  const response = await api.get<ResponseRate>(`/log/response-rate`);
  return response.data;
};

export { getGroupNames, getRakings, getTotalTraffic, getTotalProjectCount, getTotalResponseRate };
