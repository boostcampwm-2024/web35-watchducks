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

export type { Traffic, ResponseRate, Ranking };
