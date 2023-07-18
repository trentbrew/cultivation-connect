<script setup>
  const state = reactive({
    minAngle: 10,
    maxAngle: 30,
  })

  const sliderMin = computed({
    get: () => {
      var val = parseInt(state.minAngle)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val > state.maxAngle) state.maxAngle = val
      state.minAngle = val
    },
  })

  const sliderMax = computed({
    get: () => {
      var val = parseInt(state.maxAngle)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val < state.minAngle) state.minAngle = val
      state.maxAngle = val
    },
  })
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center gap-32">
    <div class="range-slider">
      <input type="range" min="0" max="180" step="1" v-model="sliderMin" />
      <input type="number" min="0" max="180" step="1" v-model="sliderMin" />
      <input type="range" min="0" max="180" step="1" v-model="sliderMax" />
      <input type="number" min="0" max="180" step="1" v-model="sliderMax" />
    </div>
  </div>
</template>

<style scoped>
  .range-slider {
    width: 300px;
    margin: auto;
    text-align: center;
    position: relative;
    height: 6em;
  }

  .range-slider input[type='range'] {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  input[type='number'] {
    border: 1px solid #ddd;
    text-align: center;
    font-size: 1.6em;
    -moz-appearance: textfield;
  }

  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type='number']:invalid,
  input[type='number']:out-of-range {
    border: 2px solid #ff6347;
  }

  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
  }

  input[type='range']:focus {
    outline: none;
  }

  input[type='range']:focus::-webkit-slider-runnable-track {
    background: #2497e3;
  }

  input[type='range']:focus::-ms-fill-lower {
    background: #2497e3;
  }

  input[type='range']:focus::-ms-fill-upper {
    background: #2497e3;
  }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: #2497e3;
    border-radius: 1px;
    box-shadow: none;
    border: 0;
  }

  input[type='range']::-webkit-slider-thumb {
    z-index: 2;
    position: relative;
    box-shadow: 0px 0px 0px #000;
    border: 1px solid #2497e3;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: #a1d0ff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -7px;
  }
</style>
