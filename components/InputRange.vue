<script setup>
  const state = reactive({
    minAngle: 40,
    maxAngle: 60,
    relativeMinAngle: 15,
    relativeMaxAngle: 84,
  })

  const sliderMin = computed({
    get: () => {
      var val = parseInt(state.minAngle)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val < state.relativeMinAngle) state.relativeMinAngle = val
      if (val > state.maxAngle) state.maxAngle = val
      if (val > state.relativeMaxAngle) state.relativeMaxAngle = val
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
      if (val < state.relativeMinAngle) state.relativeMinAngle = val
      if (val > state.relativeMaxAngle) state.relativeMaxAngle = val
      state.maxAngle = val
    },
  })

  const sliderRelativeMin = computed({
    get: () => {
      var val = parseInt(state.relativeMinAngle)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val > state.minAngle) state.minAngle = val
      if (val > state.maxAngle) state.maxAngle = val
      if (val > state.relativeMaxAngle) state.relativeMaxAngle = val
      state.relativeMinAngle = val
    },
  })

  const sliderRelativeMax = computed({
    get: () => {
      var val = parseInt(state.relativeMaxAngle)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val < state.maxAngle) state.maxAngle = val
      if (val < state.minAngle) state.minAngle = val
      if (val < state.relativeMinAngle) state.relativeMinAngle = val
      state.relativeMaxAngle = val
    },
  })

  function getWidth(context) {
    const values = {
      a: sliderRelativeMin.value,
      b: sliderMin.value,
      c: sliderMax.value,
      d: sliderRelativeMax.value,
    }
    return `width: ${100 - values[context]}%`
  }
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center gap-32">
    <div class="range-slider">
      <div class="mb-2 gap-2 flex flex-col w-full justify-center">
        <input
          class="px-1"
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="sliderMin"
        />
        <input
          class="px-1"
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="sliderMax"
        />
      </div>
      <div class="mb-12 gap-2 flex flex-col w-full justify-center">
        <input
          class="px-1"
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="sliderRelativeMin"
        />
        <input
          class="px-1"
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="sliderRelativeMax"
        />
      </div>

      <input
        id="input1"
        type="range"
        min="0"
        max="100"
        step="1"
        v-model="sliderMin"
      />
      <input
        id="input2"
        type="range"
        min="0"
        max="100"
        step="1"
        v-model="sliderMax"
      />
      <input
        id="input3"
        type="range"
        min="0"
        max="100"
        step="1"
        v-model="sliderRelativeMin"
      />
      <input
        id="input4"
        type="range"
        min="0"
        max="100"
        step="1"
        v-model="sliderRelativeMax"
      />

      <!-- TODO: put the dynamic color gradient backdrop here -->

      <div class="bg-base-200 h-2 w-full flex justify-end">
        <div
          class="absolute w-full h-2 bg-yellow-500"
          :style="getWidth('a')"
        ></div>
        <div
          class="absolute w-full h-2 bg-green-500"
          :style="getWidth('b')"
        ></div>
        <div
          class="absolute w-full h-2 bg-yellow-500"
          :style="getWidth('c')"
        ></div>
        <div
          class="absolute w-full h-2 rounded-[24px] bg-red-500"
          :style="getWidth('d')"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .range-slider {
    width: 700px;
    margin: auto;
    text-align: center;
    position: relative;
  }

  .range-slider input[type='range'] {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  input[type='range'] {
    -webkit-appearance: none;
    background: transparent;
    width: 100%;
  }

  input[type='range']::-webkit-slider-thumb {
    @apply bg-base-100;
    border: 6px solid;
    margin-top: -8px;
    z-index: 2;
    position: relative;
    border-radius: 100%;
    -webkit-appearance: none;
    transition-duration: 200ms;
  }

  input[type='range']::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  input[type='range']::-webkit-slider-thumb:active {
    transform: scale(1.1);
  }

  #input1::-webkit-slider-thumb {
    @apply border-green-500 z-10 w-6 h-6;
  }

  #input2::-webkit-slider-thumb {
    @apply border-green-500 z-10 w-6 h-6;
  }

  #input3::-webkit-slider-thumb {
    @apply border-yellow-500 w-6 h-6;
  }

  #input4::-webkit-slider-thumb {
    @apply border-yellow-500 w-6 h-6;
  }

  input[type='range']::-webkit-slider-runnable-track {
    @apply bg-red-500;
    width: 100%;
    height: 8px;
    border-radius: 24px;
    cursor: pointer;
    box-shadow: none;
    border: none;
  }
</style>
