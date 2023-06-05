<template>
  <div class="drawer drawer-end">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="flex drawer-content">
      <NuxtPage />
    </div>
    <div class="drawer-side">
      <label
        for="drawer"
        class="drawer-overlay backdrop-contrast-50 !bg-base-100/50"
      ></label>
      <LayoutDrawer />
    </div>
  </div>
</template>
