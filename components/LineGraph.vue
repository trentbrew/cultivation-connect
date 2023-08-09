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
    series: {
      type: Array,
      required: true,
    },
  })

  const collectionsState = computed(() => global.getCollectionsState)
  const range = computed(() => global.getRange(props.context))

  const rMin = range.value.min[0]
  const rMax = range.value.max[0]
  const rMar = range.value.margin[0]

  const series = props.series[0].map(item => [item[0], item[1]])

  const dateList = series.map(item => item[0])
  const valueList = series.map(item =>
    range.value.unit == '%' ? item[1] * 100 : item[1]
  )

  let myChart

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
        right: 110,
      },
    ],
    visualMap: {
      textStyle: {
        fontSize: 12,
      },
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
          color: '#81CB91',
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
        lineStyle: {
          normal: {
            width: 3,
          },
        },
        smooth: true,
        showSymbol: false,
        data: valueList,
        markLine: {
          silent: false,
          lineStyle: {
            color: '#333',
          },
          data: [
            {
              yAxis: rMin - rMar, // min - margin
            },
            {
              yAxis: rMin, // min
            },
            {
              yAxis: rMax, // max
            },
            {
              yAxis: rMax + rMax, // relative max
            },
          ],
        },
      },
    ],
  }

  function initChart() {
    myChart.setOption(options)
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
