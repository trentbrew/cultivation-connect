<script setup>
  // const emit = defineEmits(['update:modelValue'])

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  })

  const state = reactive({
    min_value: 0,
    max_value: 0,
    rel_min_value: 0,
    rel_max_value: 0,
    abs_min_value: 0,
    abs_max_value: 0,
  })

  onMounted(() => {
    state.min_value = props.data.min
    state.max_value = props.data.max
    state.rel_min_value = props.data.rel_min
    state.rel_max_value = props.data.rel_max
    state.abs_min_value = props.data.abs_min
    state.abs_max_value = props.data.abs_max
    console.log('state: ', state)
  })

  watch(
    () => state,
    () => {
      // emit('update:modelValue', {
      //   min: state.min_value,
      //   max: state.max_value,
      //   rel_min: state.rel_min_value,
      //   rel_max: state.rel_max_value,
      //   abs_min: state.abs_min_value,
      //   abs_max: state.abs_max_value,
      // })
    },
    { deep: true }
  )

  const min = computed({
    get: () => {
      var val = parseInt(state.min_value)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val < state.rel_min_value) state.rel_min_value = val
      if (val > state.max_value) state.max_value = val
      if (val > state.rel_max_value) state.rel_max_value = val
      state.min_value = val
    },
  })

  const max = computed({
    get: () => {
      var val = parseInt(state.max_value)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val < state.min_value) state.min_value = val
      if (val < state.rel_min_value) state.rel_min_value = val
      if (val > state.rel_max_value) state.rel_max_value = val
      state.max_value = val
    },
  })

  const rel_min = computed({
    get: () => {
      var val = parseInt(state.rel_min_value)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val > state.min_value) state.min_value = val
      if (val > state.max_value) state.max_value = val
      if (val > state.rel_max_value) state.rel_max_value = val
      state.rel_min_value = val
    },
  })

  const rel_max = computed({
    get: () => {
      var val = parseInt(state.rel_max_value)
      return val
    },
    set: val => {
      val = parseInt(val)
      if (val < state.max_value) state.max_value = val
      if (val < state.min_value) state.min_value = val
      if (val < state.rel_min_value) state.rel_min_value = val
      state.rel_max_value = val
    },
  })

  function getWidth(context) {
    const range = Math.abs(state.abs_max_value - state.abs_min_value)
    // console.log('range: ', range)
    const values = {
      a: rel_min.value / range,
      b: min.value / range,
      c: max.value / range,
      d: rel_max.value / range,
    }
    // console.log('values: ', values)
    const w = values[context] * 100
    return `width: ${100 - w}%`
  }
</script>

<template>
  <div class="w-full h-[140px] flex flex-col justify-center items-center">
    <div class="flex flex-col gap-12 w-full">
      <div class="range-slider">
        <input
          id="input3"
          type="range"
          :min="state.abs_min_value"
          :max="state.abs_max_value"
          :step="props.data.step"
          v-model="rel_min"
        />
        <input
          id="input1"
          type="range"
          :min="state.abs_min_value"
          :max="state.abs_max_value"
          :step="props.data.step"
          v-model="min"
        />
        <input
          id="input2"
          type="range"
          :min="state.abs_min_value"
          :max="state.abs_max_value"
          :step="props.data.step"
          v-model="max"
        />
        <input
          id="input4"
          type="range"
          :min="state.abs_min_value"
          :max="state.abs_max_value"
          :step="props.data.step"
          v-model="rel_max"
        />
        <div class="bg-base-200 h-1 w-full flex justify-end">
          <div
            class="absolute w-full h-1 bg-yellow-500"
            :style="getWidth('a')"
          ></div>
          <div
            class="absolute w-full h-1 bg-green-500"
            :style="getWidth('b')"
          ></div>
          <div
            class="absolute w-full h-1 bg-yellow-500"
            :style="getWidth('c')"
          ></div>
          <div
            class="absolute w-full h-1 rounded-[24px] bg-red-500"
            :style="getWidth('d')"
          ></div>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <div class="flex gap-2 justify-center w-[600px]">
          <input
            class="px-1 input input-sm bg-base-100 font-normal w-full border-2 border-red-500"
            type="number"
            :step="props.data.step"
            v-model="state.abs_min_value"
          />
          <input
            class="px-1 input input-sm bg-base-100 font-normal w-full border-2 border-yellow-500"
            type="number"
            :min="state.abs_min_value"
            :max="state.abs_max_value"
            :step="props.data.step"
            v-model="rel_min"
          />
          <input
            class="px-1 input input-sm bg-base-100 font-normal w-full border-2 border-green-500"
            type="number"
            :min="state.abs_min_value"
            :max="state.abs_max_value"
            :step="props.data.step"
            v-model="min"
          />
          <input
            class="px-1 input input-sm bg-base-100 font-normal w-full border-2 border-green-500"
            type="number"
            :min="state.abs_min_value"
            :max="state.abs_max_value"
            :step="props.data.step"
            v-model="max"
          />
          <input
            class="px-1 input input-sm bg-base-100 font-normal w-full border-2 border-yellow-500"
            type="number"
            :min="state.abs_min_value"
            :max="state.abs_max_value"
            :step="props.data.step"
            v-model="rel_max"
          />
          <input
            class="px-1 input input-sm bg-base-100 font-normal w-full border-2 border-red-500"
            type="number"
            :step="props.data.step"
            v-model="state.abs_max_value"
          />
          <div></div>
          <div></div>
          <button class="btn btn-sm btn-outline">Reset</button>
          <button class="btn btn-sm bg-black">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .range-slider {
    min-width: 90%;
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
    border: 4px solid;
    margin-top: -10px;
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
    height: 4px;
    border-radius: 24px;
    cursor: pointer;
    box-shadow: none;
    border: none;
  }
</style>
