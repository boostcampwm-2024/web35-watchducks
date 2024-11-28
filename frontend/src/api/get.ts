import {
  ResponseRate,
  Traffic,
  Ranking,
  DailyDifferenceTraffic,
  ElapsedTime,
  ResponseTime,
  Top5Traffic,
  ProjectElapsedTime,
  ProjectSuccessRate,
  ProjectDAU,
  ProjectTraffic,
  ProjectExist
} from '@type/api';
import { GroupOption } from '@type/Navbar';

import { api } from './axios';

const getGroupNames = async (generation: string) => {
  const response = await api.get<GroupOption[]>(`/project?generation=${generation}`);
  return response.data.map((item) => ({
    value: item.value,
    label: item.value
  }));
};

const getRankings = async (generation: string) => {
  const response = await api.get<Ranking[]>(`/log/traffic/rank?generation=${generation}`);
  return response.data;
};

const getTotalTrafficCount = async (generation: string) => {
  const response = await api.get<Traffic>(`/log/traffic?generation=${generation}`);
  return response.data;
};

const getTotalProjectCount = async (generation: string) => {
  const response = await api.get<Traffic>(`/project/count?generation=${generation}`);
  return response.data;
};

const getTotalResponseRate = async (generation: string) => {
  const response = await api.get<ResponseRate>(`/log/success-rate?generation=${generation}`);
  return response.data;
};

const getDailyDifferenceTraffic = async (generation: string) => {
  const response = await api.get<DailyDifferenceTraffic>(
    `/log/traffic/daily-difference?generation=${generation}`
  );
  return response.data;
};

const getTotalElapsedTime = async (generation: string) => {
  const response = await api.get<ElapsedTime>(`/log/elapsed-time?generation=${generation}`);
  return response.data;
};

const getTop5ResponseTime = async (generation: string) => {
  const response = await api.get<ResponseTime[]>(`/log/elapsed-time/top5?generation=${generation}`);
  return response.data;
};

const getTop5Traffic = async (generation: string) => {
  const response = await api.get<Top5Traffic>(
    `/log/traffic/top5/line-chart?generation=${generation}`
  );
  return response.data;
};

const getSuccessRate = async (project: string) => {
  const response = await api.get<ProjectSuccessRate>(
    `/log/success-rate/project?projectName=${project}`
  );
  return response.data;
};

const getDAU = async (project: string) => {
  const response = await api.get<ProjectDAU>(`/log/analytics/dau?projectName=${project}`);
  return response.data;
};

const getElapsedTime = async (project: string) => {
  const response = await api.get<ProjectElapsedTime>(
    `/log/elapsed-time/path-rank?projectName=${project}`
  );
  return response.data;
};

const getTraffic = async (project: string, dateType: string) => {
  const response = await api.get<ProjectTraffic>(
    `/log/traffic/project?projectName=${project}&timeRange=${dateType}`
  );
  return response.data;
};

const getIsExistProject = async (project: string) => {
  const response = await api.get<ProjectExist>(`/project/exists?projectName=${project}`);
  return response.data;
};

export {
  getIsExistProject,
  getGroupNames,
  getRankings,
  getTotalTrafficCount,
  getTotalProjectCount,
  getTotalResponseRate,
  getDailyDifferenceTraffic,
  getTotalElapsedTime,
  getTop5ResponseTime,
  getTop5Traffic,
  getSuccessRate,
  getDAU,
  getElapsedTime,
  getTraffic
};
