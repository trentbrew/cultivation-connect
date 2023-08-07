<script setup>
  import * as echarts from 'echarts'
  const global = useGlobalStore()

  const collectionsState = computed(() => global.getCollectionsState)

  const props = defineProps({
    title: {
      type: String,
      required: false,
      default: 'Grow Conditions',
    },
    series: {
      type: [Array, Object],
      default: () => [
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Air Temperature',
          type: 'line',
         
          data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210],
        },
      
      
      ],
    },
  })
  // Function to format timestamps
 function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-US', options);
  }
  // Function to generate time stamps for each data point
  function generateTimestamps(dataLength) {
    const now = Date.now(); // Use the current date as the starting point
    const timestamps = [];
    const timeIncrement = 8 * 60 * 60 * 1000; 

    // Loop through the number of data points and add the formatted time to each timestamp
    for (let i = 0; i < dataLength; i++) {
      const timestamp = now - (dataLength - i - 1) * timeIncrement;
      timestamps.push(formatTimestamp(timestamp));
    }

    return timestamps;
  }
  


  const target = ref(null)

  const series = props.series.map(item => item)

  let myChart

 
  const last24Hours = ref(false);
  const last7Days = ref(false);
 
function filterDataByTimestamp(data, days) {
    const now = new Date().getTime();
    if (days === '24h') {
      return data.slice(-6); // Show last 24 hours (6 data points)
    } else if (days === '7d') {
      // Show data points from the last 7 days
      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeekAgo = now - 7 * oneDay;
      const filteredData = data.filter((point) => {
        const timestamp = new Date(point[0]).getTime();
        return timestamp >= oneWeekAgo;
      });

      // If there are not enough data points for the last 7 days, return all data
      if (filteredData.length < 7) {
        return data;
      }

      return filteredData;
    } else {
      return data; // Show all data points
    }
  }

  const filteredSeries = computed(() => {
    return series.map(item => {
      return {
        ...item,
        data: last24Hours.value
          ? filterDataByTimestamp(item.data, '24h')
          : last7Days.value
          ? filterDataByTimestamp(item.data, '7d')
          : item.data,
      };
    });
  });

  let options = {
    title: {
      text: props.title,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [
        'Air Temperature',
        'Air Humidity',
        'Solar PPFD',
        'VPD',
        'DLI',
        'CO2',
        'Pore EC',
        'Substrate Moisture',
        'Dry Back',
        'Substrate Temperature',
        'PH',
      ],
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '4%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      data: generateTimestamps(series[0].data.length),
      boundaryGap: false,
    },
    
    yAxis: [
      {
        type: 'value',
        name: 'Air Temperature',
        // min: 0,
        // max: 100,
        // interval: 20,
        axisLabel: {
          formatter: '{value} °F',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Air Humidity',
        // min: 0,
        // max: 100,
        // interval: 20,
        axisLabel: {
          formatter: '{value} %',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Solar PPFD',
        // min: 0,
        // max: 100,
        // interval: 20,
        axisLabel: {
          formatter: '{value} umol/m2/s',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'VPD',
        // min: 0,
        // max: 100,
        // interval: 20,
        axisLabel: {
          formatter: '{value} kPa',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'DLI',
        // min: 0,
        // max: 100,
        // interval: 20,
        axisLabel: {
          formatter: '{value} mol/m2/d',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'CO2',
        // min: 0,
        // max: 100,
        // interval: 20,
        axisLabel: {
          formatter: '{value} ppm',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Pore EC',
        // min: 0,
        // max: 100,
        // interval: 20,
        axisLabel: {
          formatter: '{value} mS/cm',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Substrate Moisture, Dry Back, Substrate Temperature, PH',
        // min: 0,
        // max: 100,
        // interval: 20,
        axisLabel: {
          formatter: '{value} %, %, °F, pH',
        },
        show: false,
      },
    ],
   series: filteredSeries.value
  }
  

  function initChart() {
    myChart = echarts.init(target.value)
    myChart.setOption(options)
  }

  onMounted(async () => {
    initChart()
    window.addEventListener('resize', () => {
      myChart.resize()
    })
  })
 // Function to update the chart options and redraw it
  function updateChart() {
    options.series = filteredSeries.value;
    myChart.setOption(options);
  }
   
  watch([last24Hours, last7Days], () => {
    updateChart();
  });
  watch(
    () => props.series,
    () => initChart()
  )

  watch(
    () => collectionsState.value,
    () => myChart.resize()
  )
  
</script>

<template>
 <div>
      
      <button @click="last24Hours = true; last7Days = false;">Last 24 Hours</button>
      <button @click="last24Hours = false; last7Days = true;">Last 7 Days</button>
      <button @click="last24Hours = false; last7Days = false;">Full View</button>
    </div>
  <div id="multi-line-graph" ref="target"></div>
  
</template>

<style scoped>
  #multi-line-graph {
    width: inherit !important;
    height: inherit !important;
  }
  canvas {
    width: inherit !important;
    height: inherit !important;
  }
</style>
