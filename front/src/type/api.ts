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
  avgResponseTime: number;
};

type ResponseTime = {
  projectName: string;
  avgResponseTime: number;
};

export type { Traffic, ResponseRate, Ranking, DailyDifferenceTraffic, ElapsedTime, ResponseTime };
