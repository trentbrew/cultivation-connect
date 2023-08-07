<script setup>
  const global = useGlobalStore()
  const router = useRouter()

  const props = defineProps({
    slotted: {
      type: Boolean,
      default: false,
    },
    for: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
    item: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  })

  function handleDrawerToggle() {
    router.push({ hash: `#${props.for}` })
    global.setDrawerContext(props.for)
    global.setCurrentItem(props.item) // for editing
  }
</script>

<template>
  <label
    v-if="!props.slotted"
    @click="handleDrawerToggle"
    for="drawer"
    class="btn flex gap-2 justify-center items-center"
    :class="
      props.disabled
        ? `btn-disabled pointer-events-none ${!props.icon ? 'pl-6' : ''}`
        : `${!props.icon ? (props.label ? 'px-6' : 'pl-6 pr-0') : ''}`
    "
  >
    <Icon v-show="props.icon" :name="props.icon" />
    <span v-if="props.label" class="font-bold">{{ props.label }}</span>
  </label>
  <label v-else for="drawer" @click="handleDrawerToggle"><slot /></label>
</template>
