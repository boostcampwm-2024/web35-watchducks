export const useDefaultOptions = () => {
  return {
    defaultOptions
  };
};

const defaultOptions: ApexCharts.ApexOptions = {
  chart: {
    animations: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    enabled: true,
    shared: true,
    followCursor: true,
    intersect: false,
    fixed: {
      enabled: false
    }
  },
  states: {
    hover: {
      filter: {
        type: 'none'
      }
    },
    active: {
      allowMultipleDataPointsSelection: false,
      filter: {
        type: 'none'
      }
    }
  }
};
