type NavbarRanking = {
  rank: {
    projectName: string;
    count: string;
  }[];
};

type Traffic = {
  count: number;
};

type ResponseRate = {
  success_rate: number;
};

type DailyDifferenceTraffic = {
  traffic_daily_difference: string;
};

type ElapsedTime = {
  avg_elapsed_time: number;
};

type ResponseTime = {
  projectName: string;
  avgResponseTime: number;
};

type Top5Traffic = {
  trafficCharts: {
    name: string;
    traffic: [string, string][];
  }[];
};

type ProjectElapsedTime = {
  projectName: string;
  fastestPaths: { path: string; avgResponseTime: number }[];
  slowestPaths: { path: string; avgResponseTime: number }[];
};

type ProjectSuccessRate = {
  projectName: string;
  success_rate: number;
};

type ProjectDAU = {
  projectName: string;
  dauRecords: [{ date: string; dau: number }];
};

type ProjectTraffic = {
  projectName: string;
  timeRange: string;
  domain: string;
  total: number;
  trafficData: {
    timestamp: string;
    count: number;
  }[];
};

type ProjectExist = {
  exists: boolean;
};

type RankingData = {
  total: number;
  rank: {
    projectName: string;
    value: number;
  }[];
};

export type {
  Traffic,
  ResponseRate,
  NavbarRanking,
  DailyDifferenceTraffic,
  ElapsedTime,
  ResponseTime,
  Top5Traffic,
  ProjectSuccessRate,
  ProjectDAU,
  ProjectTraffic,
  ProjectElapsedTime,
  ProjectExist,
  RankingData
};
