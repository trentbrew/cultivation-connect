<script setup>
  const props = defineProps({
    img: {
      type: String,
      default: 'growth',
    },
  });

  const images = {
    growth:
      'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/xldvs19b2ve3rmg/growth_uGK2pz7EBq.gif',
    dandelion:
      'https://cultivationconnect.fly.dev/api/files/dsgp80sss2cymxu/eklda8zjnp34dgq/dandelion_RCEhPhOzd0.gif',
  };
</script>

<template>
  <img
    class="w-[200px]"
    :class="
      ['growth', 'dandelion'].includes(props.img) ? 'brightness-[0.91]' : ''
    "
    :src="images[props.img]"
    alt="You got this <3"
  />
</template>
