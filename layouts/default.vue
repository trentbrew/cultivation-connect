<script setup>
  const global = useGlobalStore()
  const route = useRoute()
  const router = useRouter()

  const state = reactive({
    ui: {
      collections: false,
      currentItem: null,
    },
  })

  const collectionsActive = computed(() => global.getCollectionsState)
  const currentItem = computed(() => global.getCurrentItem)

  onMounted(() => {
    state.ui.collections = collectionsActive.value
    state.ui.currentItem = currentItem.value
  })

  watch(
    () => collectionsActive.value,
    val => {
      state.ui.collections = val
    }
  )

  watch(
    () => currentItem.value,
    val => {
      state.ui.currentItem = val
    }
  )

  const nonCollectionRoutes = [
    'facility',
    'cycles',
    'plants',
    'settings',
    'account-username',
    'auth-login',
    'auth-signup',
  ]
</script>

<template>
  <div class="drawer drawer-end">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="flex drawer-content">
      <LayoutSidebar />
      <div
        v-if="!nonCollectionRoutes.includes(route.name)"
        id="collections"
        :class="!state.ui.collections && 'hidden'"
      >
        <LayoutCollections />
      </div>
      <main class="duration-300 w-full h-screen bg-base-100 overflow-auto">
        <NuxtPage />
      </main>
    </div>
    <div class="drawer-side">
      <label
        @click="router.push({ hash: '' })"
        for="drawer"
        class="drawer-overlay backdrop-contrast-50 !bg-base-100/50"
      ></label>
      <LayoutDrawer :item="state.currentItem" />
    </div>
  </div>
</template>
