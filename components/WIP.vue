<script setup>
  const props = defineProps({
    img: {
      type: String,
      default: 'growth',
    },
  })

  const images = {
    growth:
      'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/xldvs19b2ve3rmg/growth_uGK2pz7EBq.gif',
    dandelion:
      'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/eklda8zjnp34dgq/dandelion_RCEhPhOzd0.gif',
    cycles:
      'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/uogkqkvocyr4crk/cycles_5yNBAYZFKu.gif',
    records:
      'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/udrtfkvs8nlb691/static_records_xhGAfA1iv5.webp',
    data: 'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/ljtug7x87rixmvo/datatable_7Yf1hCCV2K.gif',
    grow: 'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/ewpximjizqf5n3e/grow_jZc9gFF3Jo.gif',
  }
</script>

<template>
  <img
    class="w-[200px]"
    :class="
      ['growth', 'dandelion'].includes(props.img) ? 'brightness-[0.91]' : ''
    "
    :src="images[props.img]"
    alt="Image not found"
  />
</template>
