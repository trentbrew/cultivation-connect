<script setup>
  const nuxtApp = useNuxtApp()
  const global = useGlobalStore()
  const pb = usePocketbase()
  const route = useRoute()

  nuxtApp.hook('page:finish', () => {
    window.scrollTo(0, 0)
  })

  var modifierPressed = false

  window.addEventListener('keydown', e => {
    const modifiers = ['`']
    if (modifiers.includes(e.key)) modifierPressed = true
    // if (modifierPressed && e.key === 'a') debug.authCheck()
  })

  const debug = {
    authCheck: () => {
      if (loggedIn.value) {
        global.toast(
          'success',
          `Logged in as ${pb.api.authStore.model.email} (${pb.api.authStore.model.id})`
        )
      } else {
        global.toast('error', "You're not logged in")
      }
    },
  }

  const state = reactive({
    layout: 'auth',
  })

  const authRoutes = ['/auth/login', '/auth/signup']

  watch(
    () => route.path,
    val => {
      if (authRoutes.includes(val)) state.layout = 'auth'
      else if (val != '/intake') state.layout = 'default'
      else state.layout = 'intake'
    }
  )

  onMounted(() => {
    if (authRoutes.includes(route.path)) state.layout = 'auth'
    else if (route.path != '/intake') state.layout = 'default'
    else state.layout = 'intake'
    if (loggedIn.value) fetchNotifications()
  })

  function fetchNotifications() {
    pb.get('notifications', {
      filter: `user.id = "${pb.api.authStore.model.id}" && status != "dismissed"`,
    }).then(notifications => {
      notifications.forEach(item => {
        global.pushNotification(item)
      })
    })
  }

  const loggedIn = computed(() => {
    const user = pb.api.authStore
    if (user.isValid && user.model.id && user.token) {
      return true
    } else {
      return false
    }
  })
</script>

<template>
  <Html :data-theme="global.getTheme">
    <Head>
      <Title>{{ global.getTitle }}</Title>
    </Head>
    <div>
      <NuxtLayout :name="state.layout" />
    </div>
    <!-- <ModalTest /> -->
    <ModalConfirmation />
    <ModalHelp />
    <ModalCsv />
    <ModalRecords />
    <ModalDetails />
    <Toast />
  </Html>
</template>

<style>
  .btn {
    text-transform: none !important;
  }
  .btn-ghost {
    @apply hover:bg-base-200;
  }
  .modal {
    @apply backdrop-contrast-50 !bg-base-100/50;
  }
  .modal-box {
    @apply border border-base-200;
    width: auto !important;
    max-width: none !important;
    max-height: none !important;
  }
  .alert {
    border-radius: 8px !important;
  }
</style>
