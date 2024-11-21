export const useDefaultOptions = () => {
  return {
    defaultOptions
  };
};

const defaultOptions: ApexCharts.ApexOptions = {
  chart: {
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoomin: true,
        zoomout: true,
        zoom: true,
        pan: true,
        reset: true
      },
      autoSelected: 'zoom'
    },
    animations: {
      enabled: false
    },
    zoom: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.9
      }
    },
    active: {
      filter: {
        type: 'darken',
        value: 0.8
      }
    }
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        }
      }
    }
  ]
};
