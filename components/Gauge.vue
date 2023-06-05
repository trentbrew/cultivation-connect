<script setup>
  import * as echarts from 'echarts';

  const route = useRoute();
  const global = useGlobalStore();

  const target = ref(null);

  let myChart;

  const props = defineProps({
    context: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  });

  const colors = {
    green: '#6BD09E',
    yellow: '#CDAB55',
    red: '#AF0000',
  };

  let options = {
    series: [
      {
        type: 'gauge',
        startAngle: 220,
        endAngle: -70,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 4,
            color: null,
          },
        },
        pointer: {
          length: '40%',
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
          distance: 20,
          fontSize: 12,
          formatter: null,
        },
        detail: {
          valueAnimation: true,
          formatter: null,
          color: 'inherit',
          fontSize: 24,
        },
        data: [
          {
            value: 0,
          },
        ],
      },
    ],
  };

  function sum(a, b) {
    return parseInt(a) + parseInt(b);
  }

  function difference(a, b) {
    return parseInt(a) - parseInt(b);
  }

  function rationalize(value) {
    const context = global.getRange(props.context);
    const trueMin = difference(context?.min, context?.margin * 2);
    const trueMax = sum(context?.max, context?.margin * 2);
    return parseFloat(((value - trueMin) / (trueMax - trueMin)).toFixed(2));
  }

  onMounted(() => {
    const context = global.getRange(props.context);
    const series = options.series[0];

    series.data[0].value = props.value;

    if (context?.unit === '%') {
      series.axisLabel.formatter = value => Math.round(value * 100) + '%';
      series.detail.formatter = value => Math.round(value * 100) + '%';
    } else {
      series.axisLabel.formatter = value => {
        if (value % 1 == 0) return Math.floor(value) + context?.unit;
        return '';
      };
      series.min = context?.relative_min;
      series.max = context?.relative_max;
      series.detail.formatter = value => value + context?.unit;
    }

    series.axisLine.lineStyle.color = [
      // TODO: synchronize context index with current grow phase
      [rationalize(difference(context?.min[0], context?.margin)), colors.red],
      [rationalize(context?.min[0]), colors.yellow],
      [rationalize(context?.median[0]), colors.green],
      [rationalize(context?.max[0]), colors.yellow],
      [rationalize(sum(context?.max[0], context?.margin)), colors.red],
    ];

    myChart = echarts.init(target.value);
    myChart.setOption(options);

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  });
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
