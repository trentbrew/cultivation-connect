<script setup>
  import utils from '@/helpers/utils'

  const route = useRoute()

  onMounted(() => {
    console.log('route: ', route)
  })
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <div class="flex justify-start items-center gap-6 p-6 px-10">
      <h1 class="text-lg">
        <span class="text-base-content/30">Settings</span>
        <span class="text-base-300 mx-4">/</span>
        <span class="font-bold">
          {{ utils.capitalize(route.path.split('/')[2]) }}
        </span>
      </h1>
    </div>
  </div>
</template>
