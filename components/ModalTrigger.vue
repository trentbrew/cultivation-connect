<script setup>
  const props = defineProps({
    target: {
      type: String,
      required: true,
    },
  })
</script>

<template>
  <label :for="props.target"><slot /></label>
</template>
