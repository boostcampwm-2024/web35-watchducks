import { api } from '@api/axios';
import {
  ResponseRate,
  Traffic,
  NavbarRanking,
  DailyDifferenceTraffic,
  ElapsedTime,
  ResponseTime,
  Top5Traffic
} from '@type/api';

export const getRankings = async (generation: string) => {
  const response = await api.get<NavbarRanking>(`/log/traffic/rank?generation=${generation}`);
  return response.data;
};

export const getTotalTrafficCount = async (generation: string) => {
  const response = await api.get<Traffic>(`/log/traffic?generation=${generation}`);
  return response.data;
};

export const getTotalProjectCount = async (generation: string) => {
  const response = await api.get<Traffic>(`/project/count?generation=${generation}`);
  return response.data;
};

export const getTotalResponseRate = async (generation: string) => {
  const response = await api.get<ResponseRate>(`/log/success-rate?generation=${generation}`);
  return response.data;
};

export const getDailyDifferenceTraffic = async (generation: string) => {
  const response = await api.get<DailyDifferenceTraffic>(
    `/log/traffic/daily-difference?generation=${generation}`
  );
  return response.data;
};

export const getTotalElapsedTime = async (generation: string) => {
  const response = await api.get<ElapsedTime>(`/log/elapsed-time?generation=${generation}`);
  return response.data;
};

export const getTop5ResponseTime = async (generation: string) => {
  const response = await api.get<ResponseTime[]>(`/log/elapsed-time/top5?generation=${generation}`);
  return response.data;
};

export const getTop5Traffic = async (generation: string) => {
  const response = await api.get<Top5Traffic>(
    `/log/traffic/top5/line-chart?generation=${generation}`
  );
  return response.data;
};
