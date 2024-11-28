import { api } from '@api/axios';
import {
  ProjectElapsedTime,
  ProjectSuccessRate,
  ProjectDAU,
  ProjectTraffic,
  ProjectExist
} from '@type/api';
import { GroupOption } from '@type/Navbar';

export const getGroupNames = async (generation: string) => {
  const response = await api.get<GroupOption[]>(`/project?generation=${generation}`);
  return response.data.map((item) => ({
    value: item.value,
    label: item.value
  }));
};

export const getSuccessRate = async (project: string) => {
  const response = await api.get<ProjectSuccessRate>(
    `/log/success-rate/project?projectName=${project}`
  );
  return response.data;
};

export const getDAU = async (project: string) => {
  const response = await api.get<ProjectDAU>(`/log/analytics/dau?projectName=${project}`);
  return response.data;
};

export const getElapsedTime = async (project: string) => {
  const response = await api.get<ProjectElapsedTime>(
    `/log/elapsed-time/path-rank?projectName=${project}`
  );
  return response.data;
};

export const getTraffic = async (project: string, dateType: string) => {
  const response = await api.get<ProjectTraffic>(
    `/log/traffic/project?projectName=${project}&timeRange=${dateType}`
  );
  return response.data;
};

export const getIsExistProject = async (project: string) => {
  const response = await api.get<ProjectExist>(`/project/exists?projectName=${project}`);
  return response.data;
};
