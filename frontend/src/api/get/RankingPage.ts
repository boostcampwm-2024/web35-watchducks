import { api } from '@api/axios';
import { RankingData } from '@type/api';

export const getRankingSuccessRate = async (generation: string) => {
  const response = await api.get<RankingData>(`/log/rank/success-rate?generation=${generation}`);
  return response.data;
};

export const getRankingElapsedTime = async (generation: string) => {
  const response = await api.get<RankingData>(`/log/rank/elapsed-time?generation=${generation}`);
  return response.data;
};

export const getRankingTraffic = async (generation: string) => {
  const response = await api.get<RankingData>(`/log/rank/traffic?generation=${generation}`);
  return response.data;
};

export const getRankingDAU = async (generation: string) => {
  const response = await api.get<RankingData>(`/log/rank/dau?generation=${generation}`);
  return response.data;
};
