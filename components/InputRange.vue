<script setup>
  const state = reactive({
    l: {
      active: false,
      value: 40,
    },
    r: {
      active: false,
      value: 60,
    },
  })

  watch(
    () => state.l.value,
    val => {
      state.l.active = true
      state.r.active = false
    }
  )

  watch(
    () => state.r.active,
    val => {
      state.r.active = true
      state.l.active = false
    }
  )
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center gap-32">
    <div class="w-[600px] flex justify-center items-center gap-60">
      <h1 class="text-5xl text-error">{{ state.l.value * -1 }}</h1>
      <h1 class="text-5xl text-success">{{ state.r.value }}</h1>
    </div>
    <div class="w-[600px] flex justify-center pl-[16px]">
      <input
        v-model="state.l.value"
        type="range"
        min="0"
        max="100"
        class="range range-xs range-error rotate-180"
        :class="state.l.value == 0 ? 'z-50' : ''"
      />
      <div
        class="min-w-[16px] min-h-[16px] z-10 rounded-full translate-x-[-16px] bg-blend-difference border-base-100 border-[3px] bg-base-content"
      ></div>
      <input
        v-model="state.r.value"
        type="range"
        min="0"
        max="100"
        class="range range-xs range-success translate-x-[-32px]"
        :class="state.r.value == 0 ? 'z-50' : ''"
      />
    </div>
  </div>
</template>
