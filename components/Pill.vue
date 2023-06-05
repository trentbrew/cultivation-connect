<script setup>
  const global = useGlobalStore();

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  });

  const state = reactive({
    range: {},
    change: {
      value: null,
      direction: null,
    },
    style: null,
    status: null,
  });

  const styles = [
    'bg-success text-success-content',
    'bg-warning text-warning-content',
    'bg-error text-error-content',
  ];

  onMounted(() => {
    state.range = global.getRange(props.id);
    const r = state.range;
    const v = props.value;
    const p = 0; // TODO: get phase from cycle data

    const innerRange = {
      ok: () => {
        return (
          (r?.min[p] - r?.margin[p] < v && v < r?.min[p]) ||
          (r?.max[p] < v && v < r?.max[p] + r?.margin[p])
        );
      },
      good: () => {
        return r?.min[p] <= v && v <= r?.max[p];
      },
    };

    if (innerRange.good()) {
      state.style = styles[0];
      state.status = 'good';
    } else if (innerRange.ok()) {
      state.style = styles[1];
      state.status = 'ok';
    } else {
      state.style = styles[2];
      state.status = 'bad';
    }

    state.change.value = Math.abs(v - r?.median[p]);
    state.change.direction = v > r?.median[p] ? 'above' : 'below';
  });
</script>

<template>
  <div
    class="pl-2 pr-3 h-6 w-fit rounded-full flex justify-center items-center gap-1 !cursor-default group-hover:scale-[1.04] group-active:scale-[1.11] group-active:brightness-105 duration-150"
    :class="`${state.style}`"
  >
    <div
      v-if="state.status == 'bad'"
      class="absolute w-16 h-6 rounded-full bg-error animate-ping"
    ></div>
    <Icon
      name="arrow_top_right"
      size="16"
      :class="
        state.change.direction == 'above'
          ? 'rotate-90 nudge-down'
          : 'rotate-0 nudge-up'
      "
    />
    <span class="text-xs font-medium">
      {{
        `${(state.change.value * (state.range?.unit == '%' ? 100 : 1)).toFixed(
          Number.isInteger(state.change.value) ? '0' : '2'
        )} ${state.range?.unit}`
      }}
    </span>
  </div>
</template>
