<script setup>
  const emit = defineEmits(['update:modelValue', 'submit', 'reset'])

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
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
    margin: 0,
  })

  onMounted(() => {
    state.margin =
      props.data.unit == '%'
        ? props.data.margin * 100
        : props.data.min - props.data.rel_min

    state.min_value =
      props.data.unit == '%' ? props.data.min * 100 : props.data.min

    state.max_value =
      props.data.unit == '%' ? props.data.max * 100 : props.data.max

    state.rel_min_value =
      props.data.unit == '%' ? props.data.rel_min * 100 : props.data.rel_min

    state.rel_max_value =
      props.data.unit == '%' ? props.data.rel_max * 100 : props.data.rel_max

    state.abs_min_value = props.data.unit == '%' ? 0 : props.data.abs_min

    state.abs_max_value = props.data.unit == '%' ? 100 : props.data.abs_max
  })

  function syncMargins() {
    const overflow_l = state.rel_min_value < state.abs_min_value
    const overflow_r = state.rel_max_value > state.abs_max_value
    if (overflow_l || overflow_r) {
      state.rel_min_value = overflow_l
        ? state.abs_min_value
        : state.rel_min_value
      state.rel_max_value = overflow_r
        ? state.abs_max_value
        : state.rel_max_value
    } else {
      if (state.margin < 0) {
        state.min_value = state.rel_min_value - state.margin
        state.max_value = state.rel_max_value + state.margin
      } else {
        state.rel_min_value = state.min_value - state.margin
        state.rel_max_value = state.max_value + state.margin
      }
    }
  }

  watch(
    () => state,
    () => {
      emit('update:modelValue', {
        name: props.data.name,
        title: props.data.title,
        relative_min:
          state.abs_min_value < props.data.relative_min
            ? props.data.unit == '%'
              ? state.abs_min_value / 100
              : state.abs_min_value
            : props.data.relative_min,
        relative_max:
          state.abs_max_value > props.data.relative_max
            ? props.data.unit == '%'
              ? state.abs_max_value / 100
              : state.abs_max_value
            : props.data.relative_max,
        min: [props.data.unit == '%' ? min.value / 100 : min.value],
        median: [
          props.data.unit == '%'
            ? (min.value + max.value) / 200
            : (min.value + max.value) / 2,
        ],
        max: [props.data.unit == '%' ? max.value / 100 : max.value],
        margin: [props.data.unit == '%' ? state.margin / 100 : state.margin],
        unit: props.data.unit,
        step: props.data.step,
      })
    },
    { deep: true }
  )

  watch(
    () => state.rel_min_value,
    val => {
      state.margin = state.min_value - val
      syncMargins()
    }
  )

  watch(
    () => state.min_value,
    val => {
      syncMargins()
      state.margin = val - state.rel_min_value
    }
  )

  watch(
    () => state.max_value,
    val => {
      syncMargins()
      state.margin = state.rel_max_value - val
    }
  )

  watch(
    () => state.rel_max_value,
    val => {
      state.margin = val - state.max_value
      syncMargins()
    }
  )

  // watch(
  //   () => state.margin,
  //   val => {
  //     console.log('margin', val)
  //   }
  // )

  const min = computed({
    get: () => {
      var val = Number(state.min_value)
      return val
    },
    set: val => {
      val = Number(val)
      if (val < state.rel_min_value) state.rel_min_value = val // rel_min collision 🟡
      if (val > state.max_value) state.max_value = val // max collision 🟢
      if (val > state.rel_max_value) state.rel_max_value = val // rel_max collision 🟡
      state.min_value = val
    },
  })

  const max = computed({
    get: () => {
      var val = Number(state.max_value)
      return val
    },
    set: val => {
      val = Number(val)
      if (val < state.rel_min_value) state.rel_min_value = val // rel_min collision 🟡
      if (val < state.min_value) state.min_value = val // min collision 🟢
      if (val > state.rel_max_value) state.rel_max_value = val // rel_max collision 🟡
      state.max_value = val
    },
  })

  const rel_min = computed({
    get: () => {
      var val = Number(state.rel_min_value)
      return val
    },
    set: val => {
      val = Number(val)
      if (val > state.min_value) state.min_value = val // min collision 🟢
      if (val > state.max_value) state.max_value = val // max collision 🟢
      if (val > state.rel_max_value) state.rel_max_value = val // rel_max collision 🟡
      state.rel_min_value = val
    },
  })

  const rel_max = computed({
    get: () => {
      var val = Number(state.rel_max_value)
      return val
    },
    set: val => {
      val = Number(val)
      if (val < state.rel_min_value) state.rel_min_value = val // rel_min collision 🟡
      if (val < state.min_value) state.min_value = val // min collision 🟢
      if (val < state.max_value) state.max_value = val // max collision 🟢
      state.rel_max_value = val
    },
  })

  function getWidth(context) {
    const range = Math.abs(state.abs_max_value) - state.abs_min_value
    const a = (rel_min.value - state.abs_min_value) / range
    const b = (min.value - state.abs_min_value) / range
    const c = (max.value - state.abs_min_value) / range
    const d = (rel_max.value - state.abs_min_value) / range
    const values = { a, b, c, d }
    const w = values[context] * 100
    const result = `width: ${100 - w}%`
    return result
  }
</script>

<template>
  <div class="w-full h-[300px] flex flex-col justify-center items-center">
    <div class="flex flex-col gap-12 w-full items-center">
      <div class="range-slider">
        <input
          id="input3"
          type="range"
          :min="state.abs_min_value"
          :max="state.abs_max_value"
          v-model="rel_min"
          :step="
            props.data.unit == '%' ? props.data.step * 100 : props.data.step
          "
        />
        <input
          id="input1"
          type="range"
          :min="state.abs_min_value"
          :max="state.abs_max_value"
          v-model="min"
          :step="
            props.data.unit == '%' ? props.data.step * 100 : props.data.step
          "
        />
        <input
          id="input2"
          type="range"
          :min="state.abs_min_value"
          :max="state.abs_max_value"
          v-model="max"
          :step="
            props.data.unit == '%' ? props.data.step * 100 : props.data.step
          "
        />
        <input
          id="input4"
          type="range"
          :min="state.abs_min_value"
          :max="state.abs_max_value"
          v-model="rel_max"
          :step="
            props.data.unit == '%' ? props.data.step * 100 : props.data.step
          "
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
        <div class="flex gap-2 justify-center">
          <label class="input-group w-full">
            <input
              class="w-[80px] input input-sm bg-base-100 font-normal border-2 border-red-500"
              type="number"
              v-model="state.abs_min_value"
              :step="props.data.step"
            />
            <span class="text-xs bg-base-200 px-[12px]">
              {{ props.data.unit }}
            </span>
          </label>
          <label class="input-group w-full">
            <input
              class="w-[80px] input input-sm bg-base-100 font-normal border-2 border-yellow-500"
              type="number"
              :min="state.abs_min_value"
              :max="state.abs_max_value"
              v-model="rel_min"
              :step="props.data.step"
            />
            <span class="text-xs bg-base-200 px-[12px]">
              {{ props.data.unit }}
            </span>
          </label>
          <label class="input-group w-full">
            <input
              class="w-[80px] input input-sm bg-base-100 font-normal border-2 border-green-500"
              type="number"
              :min="state.abs_min_value"
              :max="state.abs_max_value"
              v-model="min"
              :step="props.data.step"
            />
            <span class="text-xs bg-base-200 px-[12px]">
              {{ props.data.unit }}
            </span>
          </label>
          <label class="input-group w-full">
            <input
              class="w-[80px] input input-sm bg-base-100 font-normal border-2 border-green-500"
              type="number"
              :min="state.abs_min_value"
              :max="state.abs_max_value"
              v-model="max"
              :step="props.data.step"
            />
            <span class="text-xs bg-base-200 px-[12px]">
              {{ props.data.unit }}
            </span>
          </label>
          <label class="input-group w-full">
            <input
              class="w-[80px] input input-sm bg-base-100 font-normal border-2 border-yellow-500"
              type="number"
              :min="state.abs_min_value"
              :max="state.abs_max_value"
              v-model="rel_max"
              :step="props.data.step"
            />
            <span class="text-xs bg-base-200 px-[12px]">
              {{ props.data.unit }}
            </span>
          </label>
          <label class="input-group w-full">
            <input
              class="w-[80px] input input-sm bg-base-100 font-normal border-2 border-red-500"
              type="number"
              v-model="state.abs_max_value"
              :step="props.data.step"
            />
            <span class="text-xs bg-base-200 px-[12px]">
              {{ props.data.unit }}
            </span>
          </label>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          @click="$emit('reset')"
          class="btn btn-sm btn-outline flex gap-4"
        >
          Reset
        </button>
        <button @click="$emit('submit')" class="btn btn-sm bg-black flex gap-4">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .range-slider {
    width: 88%;
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
