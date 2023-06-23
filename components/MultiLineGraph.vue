<script setup>
  import * as echarts from 'echarts'
  const global = useGlobalStore()

  const collectionsState = computed(() => global.getCollectionsState)

  const props = defineProps({
    title: {
      type: String,
      required: false,
      default: 'Multi-line chart',
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
          name: 'Category 1',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Category 2',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Category 3',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Category 4',
          type: 'line',
          stack: 'Total',
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          lineStyle: {
            normal: {
              width: 3,
            },
          },
          smooth: true,
          name: 'Category 5',
          type: 'line',
          stack: 'Total',
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
        'Category 1',
        'Category 2',
        'Category 3',
        'Category 4',
        'Category 5',
      ],
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
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
