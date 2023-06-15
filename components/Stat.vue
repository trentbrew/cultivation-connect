<script setup>
  const global = useGlobalStore();
  const router = useRouter();

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    title: {
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
    status: null,
    style: null,
    icon: null,
  });

  const styles = [
    {
      card: 'bg-success/25 border-success',
      icon: {
        name: 'check_circle_outline',
        color: 'text-success-content',
      },
    },
    {
      card: 'bg-warning/25 border-warning',
      icon: {
        name: 'caution',
        color: 'text-warning-content',
      },
    },
    {
      card: 'bg-error/25 border-error',
      icon: {
        name: 'error',
        color: 'text-error-content',
      },
    },
  ];

  onMounted(() => {
    state.range = global.getRange(props.id);
    const r = state.range;
    const v = props.value;
    const p = 0; // TODO: get phase from cycle data

    // if (props.id == 'yield') {
    //   const outerRange = {
    //     ok: () => r.min[p] < v && v < r.max[p],
    //     good: () => v > r.max[p],
    //   }
    //   if (outerRange.good()) {
    //     state.style = styles[0]
    //     state.status = 'good'
    //   } else if (outerRange.ok()) {
    //     state.style = styles[1]
    //     state.status = 'ok'
    //   } else {
    //     state.style = styles[2]
    //     state.status = 'bad'
    //   }
    // } else {

    const innerRange = {
      ok: () => {
        return (
          (r.min[p] - r.margin[p] < v && v < r.min[p]) ||
          (r.max[p] < v && v < r.max[p] + r.margin[p])
        );
      },
      good: () => {
        return r.min[p] <= v && v <= r.max[p];
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

    // }

    state.change.value = Math.abs(v - r.median[p]);
    state.change.direction = v > r.median[p] ? 'above' : 'below';
  });

  function handleMove() {
    console.log('handling reorder');
    // global.toast('default', 'This feature is not yet available.')
  }

  function triggerDetails() {
    global.setDetails(props.id);
    router.push(`#${props.id}`);
  }
</script>

<template>
  <div
    v-if="state.style"
    @click="triggerDetails"
    class="w-full h-full border hover:scale-[0.98] active:scale-[0.94] active:brightness-95 rounded duration-150 p-4 group cursor-pointer group"
    :class="state.style.card"
  >
    <div class="h-full flex flex-col justify-between items-start">
      <div class="flex justify-between w-full">
        <div class="flex justify-start gap-2 items-center w-full">
          <div :class="state.style.icon.color" v-if="state.style.icon">
            <Icon :name="state.style.icon.name" :size="18" />
          </div>
          <span class="text font-medium">{{ props.title }}</span>
        </div>
        <div class="cursor-move" @click="handleMove">
          <Icon
            class="text-transparent group-hover:text-base-content"
            name="grip"
            size="24"
          />
        </div>
      </div>
      <div>
        <h2 class="text-4xl font-bold mb-3">
          <span>
            {{
              state.range.unit == '%'
                ? Number.isInteger(props.value * 100)
                  ? props.value * 100
                  : (props.value * 100).toFixed(2)
                : props.value
            }}
          </span>
          <span class="text-sm ml-1">{{ state.range.unit }}</span>
        </h2>
        <Pill :id="props.id" :value="props.value" />
      </div>
    </div>
  </div>
</template>
