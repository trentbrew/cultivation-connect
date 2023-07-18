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
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center gap-32">
    <div class="range-slider">
      <div class="mb-2 gap-2 flex w-full justify-center">
        <input
          class="bg-green-600/50 text-center"
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="sliderMin"
        />
        <input
          class="bg-green-600/50 text-center"
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="sliderMax"
        />
      </div>

      <div class="mb-12 gap-2 flex w-full justify-center">
        <input
          class="bg-yellow-500/50 text-center"
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="sliderRelativeMin"
        />
        <input
          class="bg-yellow-500/50 text-center"
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="sliderRelativeMax"
        />
      </div>

      <input type="range" min="0" max="100" step="1" v-model="sliderMin" />
      <input type="range" min="0" max="100" step="1" v-model="sliderMax" />

      <input
        type="range"
        min="0"
        max="100"
        step="1"
        v-model="sliderRelativeMin"
      />
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        v-model="sliderRelativeMax"
      />

      <!-- TODO: put the dynamic color gradient backdrop here -->

      <div class="bg-base-300 h-4 w-full rounded-[16px]"></div>
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
    z-index: 2;
    position: relative;
    -webkit-appearance: none;
    background: black;
    width: 16px;
    height: 16px;
    border-radius: 100%;
  }

  input[type='range']::-webkit-slider-runnable-track {
    /* @apply bg-base-300; */
    width: 100%;
    height: 16px;
    border-radius: 16px;
    cursor: pointer;
    border-radius: 16px;
    box-shadow: none;
    border: none;
  }
</style>
