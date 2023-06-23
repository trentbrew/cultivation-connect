<script setup>
  import * as echarts from 'echarts'

  const global = useGlobalStore()

  const target = ref(null)

  let myChart

  const props = defineProps({
    context: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  })

  const colors = {
    green: '#81CB91',
    yellow: '#F1C04A',
    red: '#E87A76',
  }

  let options = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        splitNumber: 0,
        axisLine: {
          lineStyle: {
            width: 3,
            color: null,
          },
        },
        pointer: {
          length: '40%',
          width: '3%',
          itemStyle: {
            color: 'inherit',
          },
        },
        axisTick: {
          distance: -12,
          length: 8,
          lineStyle: {
            color: '#e9e7e700',
            width: 1,
          },
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: '#e9e7e700',
            width: 2,
          },
        },
        axisLabel: {
          color: 'inherit',
          distance: 18,
          fontSize: 12,
          formatter: null,
        },
        detail: {
          valueAnimation: true,
          formatter: null,
          color: '#000',
          fontSize: 32,
          offsetCenter: [0, '60%'],
        },
        data: [
          {
            value: 0,
          },
        ],
      },
    ],
  }

  function sum(a, b) {
    return Number(a) + Number(b)
  }

  function difference(a, b) {
    return Number(a) - Number(b)
  }

  function rationalize(value) {
    const context = global.getRange(props.context)
    const trueMin = context?.relative_min
    const trueMax = context?.relative_max
    const result = parseFloat((value - trueMin) / (trueMax - trueMin))
    return result
  }

  function initChart() {
    myChart.setOption(options)
  }

  watch(
    () => props.value,
    () => {
      if (props.value) initChart()
    }
  )

  onMounted(() => {
    let context = global.getRange(props.context)
    let series = options.series[0]

    series.data[0].value = props.value
    series.splitNumber = 10
    series.axisLabel.formatter = v => (v % 1 == 0 ? v : v.toFixed(2))
    series.min = context?.relative_min
    series.max = context?.relative_max
    series.detail.formatter = value => value + context?.unit

    if (context?.median < 1 && context?.median > 0) {
      series.axisLine.lineStyle.color = [
        [difference(context?.min[0], context?.margin[0]), colors.red],
        [context?.min[0], colors.yellow],
        [context?.median[0], colors.green],
        [context?.max[0], colors.green],
        [sum(context?.max[0], context?.margin[0]), colors.yellow],
        [1, colors.red],
      ]
    } else {
      series.axisLine.lineStyle.color = [
        [
          rationalize(difference(context?.min[0], context?.margin[0])),
          colors.red,
        ],
        [rationalize(context?.min[0]), colors.yellow],
        [rationalize(context?.median[0]), colors.green],
        [rationalize(context?.max[0]), colors.green],
        [rationalize(sum(context?.max[0], context?.margin[0])), colors.yellow],
        [1, colors.red],
      ]
    }

    myChart = echarts.init(target.value)

    initChart()

    window.addEventListener('resize', () => {
      myChart.resize()
    })
  })
</script>

<template>
  <div class="flex justify-center items-center" id="gauge" ref="target"></div>
</template>

<style scoped>
  #gauge {
    width: inherit !important;
    height: inherit !important;
  }
  canvas {
    width: inherit !important;
    height: inherit !important;
  }
</style>
