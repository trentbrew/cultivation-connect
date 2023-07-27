<script setup>
  import * as echarts from 'echarts'
  // let base = +new Date(2020, 12, 1);
  // let oneDay = 24 * 3600 * 1000;
  // let data = [[base, Math.random() * 30]];
  // for (let i = 1; i < 1000; i++) {
  //   let now = new Date((base += oneDay));
  //   data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
  // }
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
          // stack: 'Total',
          data: [40,50,60,70,84,68, 55],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Air Humidity',
          type: 'line',
          // stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Solar PPFD',
          type: 'line',
          // stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'VPD',
          type: 'line',
          // stack: 'Total',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'DLI',
          type: 'line',
          // stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'CO2',
          type: 'line',
          // stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Pore EC',
          type: 'line',
          // stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Substrate Moisture',
          type: 'line',
          // stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Dry Back',
          type: 'line',
          // stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Substrate Temperature',
          type: 'line',
          // stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'PH',
          type: 'line',
          // stack: 'Total',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    },
  })

  const target = ref(null)

  const series = props.series.map(item => item)

  let myChart

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
      type: 'time',
      boundaryGap: false,
    },
    yAxis: [
      {
        type: 'value',
        name: 'Air Temperature',
        min: 50,
        max: 113,
        interval: 10,
        axisLabel: {
          formatter: '{value} °F',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Air Humidity',
        min: 0.11,
        max: 0.91,
        interval: 0.05,
        axisLabel: {
          formatter: '{value} %',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Solar PPFD',
        min: 150,
        max: 1150,
        interval: 50,
        axisLabel: {
          formatter: '{value} W/m²',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'VPD',
        min: 0.6,
        max: 0.8,
        interval: 0.01,
        axisLabel: {
          formatter: '{value} kPa',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'DLI',
        min: 21,
        max: 46,
        interval: 1,
        axisLabel: {
          formatter: '{value} µmol/m²/s',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'CO2',
        min: 1100,
        max: 1599,
        interval: 50,
        axisLabel: {
          formatter: '{value} ppm',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Pore EC',
        min: 0.1,
        max: 0.8,
        interval: 0.05,
        axisLabel: {
          formatter: '{value} %',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Substrate Moisture',
        min: 0.1,
        max: 0.75,
        interval: 0.01,
        axisLabel: {
          formatter: '{value} %',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Dry Back',
        min: 0.05,
        max: 0.1,
        interval: 0.01,
        axisLabel: {
          formatter: '{value} %',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'Substrate Temperature',
        min: 40,
        max: 90,
        interval: 4,
        axisLabel: {
          formatter: '{value} °F',
        },
        show: false,
      },
      {
        type: 'value',
        name: 'PH',
        min: 5,
        max: 7,
        interval: 0.3,
        axisLabel: {
          formatter: '{value} pH',
        },
        show: false,
      },
    ],
    series,
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
