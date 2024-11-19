type ProjectNames = {
  [key: string]: Array<{
    value: string;
  }>;
};

type Ranking = {
  host: string;
  count: string;
};

type Traffic = {
  count: string;
};

type ResponseRate = {
  success_rate: string;
};

export type { ProjectNames, Traffic, ResponseRate, Ranking };
