<script setup>
  const global = useGlobalStore();

  const props = defineProps({
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
  });

  function handleDrawerToggle() {
    console.log('setting drawer context: ', props.for);
    global.setDrawerContext(props.for);
    global.setCurrentItem(props.item); // for editing
  }
</script>

<template>
  <label
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
</template>
