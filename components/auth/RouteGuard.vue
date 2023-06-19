<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const router = useRouter()
  const route = useRoute()

  const props = defineProps({
    reverse: Boolean,
    redirect: String,
  })

  const state = reactive({
    loggedIn: false,
    valid: false,
  })

  const loggedIn = computed(() => {
    const user = pb.api.authStore
    if (user.isValid && user.model.id && user.token) {
      return true
    } else {
      return false
    }
  })

  onMounted(() => {
    if (!props.reverse) {
      if (loggedIn.value) {
        if (route.path == '/') {
          router.push('/facility')
        }
        if (!pb.api.authStore.model.onboarded && route.path != '/intake') {
          router.push('/intake')
        } else {
          state.valid = true
        }
      } else {
        global.toast('error', 'You have been logged out')
        router.push('/auth/login')
      }
    } else {
      if (!loggedIn.value) {
        state.valid = true
      } else {
        global.toast('success', 'Login successful')
        router.push(props.redirect || '/cycles')
      }
    }
  })
</script>

<template>
  <div v-if="state.valid">
    <slot></slot>
  </div>
</template>
