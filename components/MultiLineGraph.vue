<script setup>
  import utils from '@/helpers/utils'
  import * as echarts from 'echarts'

  const route = useRoute()
  const global = useGlobalStore()

  const collectionsState = computed(() => global.getCollectionsState)

  const target = ref(null)

  const props = defineProps({
    series: {
      type: [Array, Object],
      default: () => ({
        dateList: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        valueList: {
          email: [120, 132, 101, 134, 90, 230, 210],
          unionAds: [220, 182, 191, 234, 290, 330, 310],
          videoAds: [150, 232, 201, 154, 190, 330, 410],
          direct: [320, 332, 301, 334, 390, 330, 320],
          searchEngine: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      }),
    },
  })

  const titles = [
    'Humidity',
    'Air Temp',
    'CO2',
    'Dry Back 🌤️',
    'EC 🌤️',
    'Soil Moist',
    'DLI',
    'Soil Temp',
    'Dry Back 🌙',
    'EC 🌙',
    'Soil Moist 🌙',
    'pH',
    'EC',
    'kPa',
    'VPD',
  ]

  const series = props.series.valueList
  const dateList = props.series.dateList
  console.log('series', series)
  console.log('dateList', dateList)

  function getTotalHours(dates) {}

  const originalSeries = series

  // Object.entries(series).forEach((h, i) => {
  //   series[h[0]] = normalize(h[1])
  // })

  dateList.forEach((d, i) => {
    dateList[i] = utils.prettifyDate(d)
  })

  // NORMALIZE DATA
  function normalize(s) {
    let seriesData = s
    console.log('normalizing data', seriesData)
    const max = Math.max(...seriesData)
    const min = Math.min(...seriesData)
    const range = max - min
    const normalized = seriesData.map(item => (item - min) / range)
    return normalized
  }

  let myChart

  onMounted(() => {
    console.log('mounted multi-line-chart')
  })

  let options = {
    title: {
      text: 'Grow Conditions',
    },
    dataZoom: {
      type: 'slider',
      backgroundColor: '#dddddd',
      fillerColor: '#00000006',
      // handleColor: '#000000',
      // handleIcon: 'path://M 0 0 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0',
      handleSize: '150%',
      borderColor: '#BEBABA00',
      brushSelect: false,
      showDetail: true,
      mouseWheelZoom: true,
      bottom: 36,
      height: 24,
      width: '63%',
      // textStyle: {
      //   color: '#333',
      // },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: titles,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '18%',
      containLabel: true,
    },
    toolbox: {
      show: true,
      feature: {
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateList,
    },
    yAxis: [
      {
        data: [],
        axisLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: titles[0],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.air_humidity,
      },
      {
        name: titles[1],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.air_temp,
      },
      {
        name: titles[2],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.co2,
      },
      {
        name: titles[3],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.day_time_dry_back,
      },
      {
        name: titles[4],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.day_time_pore_ec,
      },
      {
        name: titles[5],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.day_time_soil_moisture,
      },
      {
        name: titles[6],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.dli,
      },
      {
        name: titles[7],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.grow_medium_temp,
      },
      {
        name: titles[8],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.night_time_dry_back,
      },
      {
        name: titles[9],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.night_time_pore_ec,
      },
      {
        name: titles[10],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.night_time_soil_moisture,
      },
      {
        name: titles[11],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.ph,
      },
      {
        name: titles[12],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.pore_ec,
      },
      {
        name: titles[13],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.solar,
      },
      {
        name: titles[14],
        type: 'line',
        stack: false,
        smooth: true,
        data: series.vpd,
      },
    ],
  }

  function initChart() {
    myChart.setOption(options)
    myChart.dispatchAction({
      type: 'dataZoom',
      start: 90,
      end: 100,
    })
  }

  onMounted(async () => {
    myChart = echarts.init(target.value)
    window.addEventListener('resize', () => {
      myChart.resize()
    })
    initChart()
  })

  watch(
    () => props.series,
    () => initChart()
  )

  watch(
    () => collectionsState.value,
    () => myChart.resize()
  )

  function handleZoom(value) {
    const now = new Date()
    const hour = now.getHours()
    console.log('hour', hour)
    myChart.dispatchAction({
      type: 'dataZoom',
      start: 100 - value,
      end: 100,
    })
  }
</script>

<template>
  <div id="multi-line-graph" ref="target"></div>
  <div class="absolute flex translate-y-[-72px] translate-x-[24px]">
    <div class="flex gap-4">
      <button @click="handleZoom(20)" class="btn btn-outline gap-3">
        <span>24 hour</span>
      </button>
      <button @click="handleZoom(40)" class="btn btn-outline gap-3">
        <span>3 day</span>
      </button>
      <button @click="handleZoom(80)" class="btn btn-outline gap-3">
        <span>7 day</span>
      </button>
      <button @click="handleZoom(100)" class="btn btn-outline gap-3">
        <span>30 day</span>
      </button>
      <button @click="handleZoom(100)" class="btn btn-outline gap-3">
        <span>All time</span>
      </button>
    </div>
  </div>
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
