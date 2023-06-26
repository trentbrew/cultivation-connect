<script setup>
  const global = useGlobalStore()

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })

  const state = reactive({
    range: {},
    change: {
      value: null,
      direction: null,
    },
    style: null,
    status: null,
  })

  const styles = [
    'bg-success text-success-content',
    'bg-warning text-warning-content',
    'bg-error text-error-content',
  ]

  onMounted(() => {
    state.range = global.getRange(props.id)

    const r = state.range
    const v = props.value
    const p = 0 // TODO: get phase from cycle data

    const maxmax = r?.max[p] + r?.margin[p]
    const max = r?.max[p]
    const min = r?.min[p]
    const minmin = r?.min[p] - r?.margin[p]

    const red = v > maxmax || v < minmin
    const yellow = (v > max || v < min) && !red
    const green = v <= max && v >= min

    state.style = green ? styles[0] : yellow ? styles[1] : styles[2]

    state.change.value = Math.abs(v - r?.median[p])
    state.change.direction = v > r?.median[p] ? 'above' : 'below'
  })
</script>

<template>
  <div
    class="pl-2 pr-3 h-6 w-fit rounded-full flex justify-center items-center gap-1 !cursor-default group-hover:scale-[1.04] group-active:scale-[1.11] group-active:brightness-105 duration-150"
    :class="`${state.style} ${
      props.disabled ? '!bg-black/20 !animate-none !pl-3' : ''
    }`"
  >
    <div
      v-if="state.status == 'bad'"
      class="absolute w-16 h-6 rounded-full bg-error animate-ping"
    ></div>
    <Icon
      v-show="!props.disabled"
      name="arrow_top_right"
      size="16"
      :class="state.change.direction == 'above' ? 'nudge-down' : 'nudge-up'"
    />
    <span v-show="!props.disabled" class="text-xs font-medium">
      {{
        `${(state.change.value * (state.range?.unit == '%' ? 100 : 1)).toFixed(
          Number.isInteger(state.change.value) ? '0' : '2'
        )} ${state.range?.unit}`
      }}
    </span>
    <span class="font-medium text-xs" v-show="props.disabled">
      Not recorded
    </span>
  </div>
</template>
