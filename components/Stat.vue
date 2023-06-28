<script setup>
  const global = useGlobalStore()
  const router = useRouter()

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
      type: [Number, String],
      required: false,
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
    status: null,
    style: null,
    icon: null,
  })

  const styles = [
    {
      card: 'bg-success/25 border-primary/50',
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
    {
      card: `pointer-events-none cursor-not-allowed ${
        props.id.includes('_time')
          ? 'bg-base-100 border-neutral/40'
          : 'bg-base-200 border-neutral/50' // maybe sun do a spin?
      }`,
      icon: {
        name: props.id.includes('night_time')
          ? 'moon'
          : props.id.includes('day_time')
          ? 'sun'
          : 'cross_box',
        color: 'text-neutral-content',
      },
    },
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

    state.style = props.disabled
      ? styles[3]
      : green
      ? styles[0]
      : yellow
      ? styles[1]
      : styles[2]

    state.change.value = Math.abs(v - r.median[p])
    state.change.direction = v > r.median[p] ? 'above' : 'below'
  })

  function handleMove() {
    console.log('handling reorder')
  }

  function triggerDetails() {
    global.setDetails(props.id)
    router.push(`#${props.id}`)
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
            <Icon
              :name="state.style.icon.name"
              :size="18"
              :class="props.disabled ? 'invert' : ''"
            />
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
          <span v-show="props.value">
            {{
              state.range.unit == '%'
                ? Number.isInteger(props.value * 100)
                  ? props.value * 100
                  : (props.value * 100).toFixed(2)
                : props.value
            }}
          </span>
          <span v-show="props.value" class="text-sm ml-1">
            {{ state.range.unit }}
          </span>
          <span v-show="!props.value && state.value !== 0">{{ '' }}</span>
        </h2>
        <Pill
          :id="props.id"
          :value="props.disabled ? 0 : props.value"
          :disabled="props.disabled"
        />
      </div>
    </div>
  </div>
</template>
