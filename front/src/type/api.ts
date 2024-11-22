type Ranking = {
  host: string;
  count: string;
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
  name: string;
  traffic: string[];
};

export type {
  Traffic,
  ResponseRate,
  Ranking,
  DailyDifferenceTraffic,
  ElapsedTime,
  ResponseTime,
  Top5Traffic
};
