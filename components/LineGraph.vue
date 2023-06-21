<script setup>
  import * as echarts from 'echarts'

  const route = useRoute()
  const global = useGlobalStore()

  const target = ref(null)

  const props = defineProps({
    context: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    series: {
      type: Array,
      required: true,
    },
  })

  const state = reactive({
    timeframe: null,
  })

  let myChart

  const placeholder_data = [
    ['2000-06-05', 116],
    ['2000-06-06', 129],
    ['2000-06-07', 135],
    ['2000-06-08', 86],
    ['2000-06-09', 73],
    ['2000-06-10', 85],
    ['2000-06-11', 73],
    ['2000-06-12', 68],
    ['2000-06-13', 92],
    ['2000-06-14', 130],
    ['2000-06-15', 245],
    ['2000-06-16', 139],
    ['2000-06-17', 115],
    ['2000-06-18', 111],
    ['2000-06-19', 309],
    ['2000-06-20', 206],
    ['2000-06-21', 137],
    ['2000-06-22', 128],
    ['2000-06-23', 85],
    ['2000-06-24', 94],
    ['2000-06-25', 71],
    ['2000-06-26', 106],
    ['2000-06-27', 84],
    ['2000-06-28', 93],
    ['2000-06-29', 85],
    ['2000-06-30', 73],
    ['2000-07-01', 83],
    ['2000-07-02', 125],
    ['2000-07-03', 107],
    ['2000-07-04', 82],
    ['2000-07-05', 44],
    ['2000-07-06', 72],
    ['2000-07-07', 106],
    ['2000-07-08', 107],
    ['2000-07-09', 66],
    ['2000-07-10', 91],
    ['2000-07-11', 92],
    ['2000-07-12', 113],
    ['2000-07-13', 107],
    ['2000-07-14', 131],
    ['2000-07-15', 111],
    ['2000-07-16', 64],
    ['2000-07-17', 69],
    ['2000-07-18', 88],
    ['2000-07-19', 77],
    ['2000-07-20', 83],
    ['2000-07-21', 111],
    ['2000-07-22', 57],
    ['2000-07-23', 55],
    ['2000-07-24', 60],
  ]

  const series = props.series.map(item => [item[0], Number(item[1])])

  const range = computed(() => global.getRange(props.context))

  const rMin = range.value.min[0]
  const rMax = range.value.max[0]
  const rMar = range.value.margin[0]

  const collectionsState = computed(() => global.getCollectionsState)

  const dateList = series.map(item => item[0])
  const valueList = series.map(item => item[1])

  let options = {
    colorBy: 'series',
    gradientColor: ['#6BD09E', '#F1C04A', '#E87A76'],
    visualMap: [
      {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: rMin,
        max: rMax,
        inactiveColor: '#000000',
      },
    ],
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {},
      },
    },
    // dataZoom: {
    //   type: 'slider',
    //   backgroundColor: '#BEBABA',
    //   fillerColor: '#000000',
    //   handleColor: '#000000',
    //   handleIcon: 'path://M 0 0 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0',
    //   handleSize: '500%',
    //   borderColor: '#BEBABA00',
    //   zoomLock: false,
    //   brushSelect: false,
    //   showDetail: true,
    //   mouseWheelZoom: true,
    //   bottom: 60,
    //   height: 2,
    //   width: '85%',
    //   textStyle: {
    //     color: '#333',
    //   },
    // },
    tooltip: {
      trigger: 'axis',
      showContent: true,
      formatter: params => {
        return (
          params[0].name + '<br/>' + params[0].value + ' ' + range.value.unit
        )
      },
    },
    xAxis: [
      {
        data: dateList,
      },
    ],
    yAxis: [
      {
        data: [],
        axisLine: {
          show: false,
        },
      },
    ],
    grid: [
      {
        bottom: 50,
        left: 50,
      },
    ],
    visualMap: {
      top: 50,
      right: 10,
      pieces: [
        {
          lte: rMin - rMar, // min - margin
          color: '#E87A76',
        },
        {
          gt: rMin - rMar, // min - margin
          lte: rMin, // min
          color: '#F1C04A',
        },
        {
          gt: rMin, // min
          lte: rMax, // max
          color: '#6BD09E',
        },
        {
          gt: rMax, // max
          lte: rMax + rMar, // max + margin
          color: '#F1C04A',
        },
        {
          gt: rMax + rMar, // max + margin
          color: '#E87A76',
        },
      ],
    },
    series: [
      {
        type: 'line',
        // lineStyle: {
        //   normal: {
        //     width: 4,
        //   },
        // },
        showSymbol: false,
        data: valueList,
        markLine: {
          silent: true,
          // lineStyle: {
          //   color: '#333',
          // },
          // data: [
          //   {
          //     yAxis: rMin - rMar, // min - margin
          //   },
          //   {
          //     yAxis: rMin, // min
          //   },
          //   {
          //     yAxis: rMax, // max
          //   },
          //   {
          //     yAxis: rMax + rMax, // relative max
          //   },
          // ],
        },
      },
    ],
  }

  function initChart() {
    myChart.setOption(options)
  }

  onMounted(async () => {
    myChart = echarts.init(target.value)
    window.addEventListener('resize', myChart.resize())
    initChart()
  })

  watch(
    () => props.series,
    val => {
      initChart()
    }
  )

  watch(
    () => collectionsState.value,
    () => {
      myChart.resize()
    }
  )
</script>

<template>
  <div id="line-graph" ref="target"></div>
</template>

<style scoped>
  #line-graph {
    width: inherit !important;
    height: inherit !important;
  }
  canvas {
    width: inherit !important;
    height: inherit !important;
  }
</style>
