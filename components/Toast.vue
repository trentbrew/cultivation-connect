<script setup>
  const global = useGlobalStore()

  const message = computed(() => global.getToast.message)
  const flavor = computed(() => global.getToast.type || '')
  const toasty = computed(() => {
    if (global.getToast.active) return `opacity-1 translate-y-0`
    else return `opacity-0 translate-y-6`
  })

  const defaults = ['default', 'info', 'primary', 'secondary']
</script>

<template>
  <div
    class="toast w-full duration-300 fixed p-0 pointer-events-none z-50"
    :class="toasty"
  >
    <div class="alert" :data-flavor="flavor">
      <div>
        <svg
          v-show="defaults.includes(flavor) || !flavor"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current flex-shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <svg
          v-show="flavor == 'success' && flavor != 'info'"
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-show="flavor == 'warning' && flavor != 'info'"
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <svg
          v-if="flavor == 'error' && flavor != 'info'"
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ message }}</span>
      </div>
      <div
        v-if="flavor == 'notification' && flavor != 'info'"
        class="flex-none"
      >
        <button class="btn btn-sm btn-ghost">Ignore</button>
        <button class="btn btn-sm btn-primary">View</button>
      </div>
    </div>
  </div>
</template>

<style>
  .alert {
    border-radius: 0px;
  }
  .alert[data-flavor='default'] {
    background-color: hsl(var(--bc));
    color: hsl(var(--b1));
  }
  .alert[data-flavor='info'] {
    background-color: hsl(var(--in));
    color: hsl(var(--inc));
  }
  .alert[data-flavor='primary'] {
    background-color: hsl(var(--p));
    color: hsl(var(--pc));
  }
  .alert[data-flavor='success'] {
    background-color: hsl(var(--su));
    color: hsl(var(--suc));
  }
  .alert[data-flavor='warning'] {
    background-color: hsl(var(--wa));
    color: hsl(var(--wac));
  }
  .alert[data-flavor='error'] {
    background-color: hsl(var(--er));
    color: hsl(var(--erc));
  }
</style>
