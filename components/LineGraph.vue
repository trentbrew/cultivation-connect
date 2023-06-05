<script setup>
  import * as echarts from 'echarts';

  const global = useGlobalStore();

  const target = ref(null);

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

  const state = reactive({
    timeframe: null,
  });

  let myChart;

  const range = computed(() => global.getRange(props.context));
  const collectionsState = computed(() => global.getCollectionsState);

  const data = [
    // TODO: replace with real data
    ['2022-01-01', 35],
    ['2022-01-02', 55],
    ['2022-01-03', 63],
    ['2022-01-04', 67],
    ['2022-01-05', 70],
    ['2022-01-06', 72],
    ['2022-01-07', 68],
    ['2022-01-08', 59],
    ['2022-01-09', 62],
    ['2022-01-10', 75],
    ['2022-01-11', 70],
    ['2022-01-12', 88],
    ['2022-01-13', 100],
    ['2022-01-14', 110],
    ['2022-01-15', 118],
    ['2022-01-16', 130],
    ['2022-01-17', 131],
    ['2022-01-18', 138],
    ['2022-01-19', 80],
    ['2022-01-20', 74],
  ];

  const dateList = data.map(function (item) {
    return item[0];
  });

  const valueList = data.map(function (item) {
    return item[1];
  });

  let options = {
    colorBy: 'series',
    gradientColor: ['#6BD09E', '#CDAB55', '#AF0000'],
    visualMap: [
      {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0, // TODO: get min from data
        max: 400, // TODO: get max from data
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
      formatter: function (params) {
        return (
          params[0].name + '<br/>' + params[0].value + ' ' + range.value.unit
        );
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
          lte: 40, // min - margin
          color: '#E87A76',
        },
        {
          gt: 40, // min - margin
          lte: 50, // min
          color: '#F1C04A',
        },
        {
          gt: 50, // min
          lte: 113, // max
          color: '#6BD09E',
        },
        {
          gt: 113, // max
          lte: 123, // max + margin
          color: '#F1C04A',
        },
        {
          gt: 123, // max + margin
          color: '#E87A76',
        },
      ],
    },
    series: [
      {
        type: 'line',
        lineStyle: {
          normal: {
            width: 4,
          },
        },
        showSymbol: false,
        data: valueList,
        markLine: {
          silent: true,
          lineStyle: {
            color: '#333',
          },
          data: [
            // This should match the range values
            {
              yAxis: 40, // min - margin
            },
            {
              yAxis: 50, // min
            },
            {
              yAxis: 113, // max
            },
            {
              yAxis: 123, // relative max
            },
          ],
        },
      },
    ],
  };

  onMounted(async () => {
    myChart = echarts.init(target.value);
    myChart.setOption(options);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  });

  watch(
    () => collectionsState.value,
    () => {
      myChart.resize();
    }
  );
</script>

<template>
  <div id="line-graph" ref="target">
    <Input v-model="state.timeframe" type="select" />
  </div>
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
