<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const route = useRoute()

  const state = reactive({
    avatarUrl: '',
    ui: {
      collections: true,
      context: '',
    },
  })

  const pages = [
    {
      name: 'Overview',
      path: '/facility',
      icon: 'analytics',
    },
    {
      name: 'Cycles',
      path: '/cycles',
      icon: 'calendar',
    },
    {
      name: 'Settings',
      path: '/settings/account',
      icon: 'settings',
    },
  ]

  const nonCollectionRoutes = [
    'facility',
    'cycles',
    'plants',
    'settings',
    'account-username',
    'auth-login',
    'auth-signup',
  ]

  const loggedIn = computed(() => {
    const user = pb.api.authStore
    if (user.isValid && user.model.id && user.token) return true
    return false
  })

  const collectionless = computed(() =>
    nonCollectionRoutes.includes(route.name)
  )

  const collectionsActive = computed(() => global.getCollectionsState)

  const context = computed(() => {
    let ctx = route.name
    if (ctx == 'account-username') return pb.api.authStore.model?.username
    if (ctx == 'auth-login') return 'Login'
    if (ctx == 'auth-signup') return 'Sign Up'
    return ctx.charAt(0).toUpperCase() + ctx.slice(1)
  })

  onMounted(() => {
    state.ui.context = route.name
    pb.getAvatarUrl().then(url => {
      state.avatarUrl = url
    })
  })

  watch(
    () => route.name,
    val => {
      state.ui.context = val
    }
  )

  watch(
    () => collectionsActive.value,
    val => {
      state.ui.collections = val
    }
  )
</script>

<template>
  <div
    id="sidebar"
    class="bg-base-100 h-screen border-r border-base-300 flex flex-col justify-between items-center"
  >
    <!-- navbar-start -->
    <div v-if="loggedIn" class="w-full">
      <!-- <div
        id="logo"
        class="text-base-content h-[72px] w-full flex justify-center items-center bg-transparent"
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 10C0 4.47715 4.47715 0 10 0H30C35.5229 0 40 4.47715 40 10V30C40 35.5229 35.5229 40 30 40H10C4.47715 40 0 35.5229 0 30V10Z"
            class="fill-primary"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M31.9651 11.608C32.0401 11.4321 31.9916 11.2281 31.8454 11.1043C31.6993 10.9805 31.4892 10.9654 31.3267 11.0671C30.7747 11.4128 29.8421 11.9352 28.8543 12.3695C27.8499 12.8111 26.8542 13.1315 26.1516 13.1315C25.9089 13.1315 25.7122 13.3272 25.7122 13.5687C25.7122 13.8102 25.9089 14.0059 26.1516 14.0059C26.9863 14.0059 28.0277 13.6709 28.9841 13.2665C27.9843 14.1243 26.8037 15.0098 25.3785 15.719C22.0052 17.3976 20.1929 18.3378 18.232 20.163C17.5827 20.7674 16.7649 21.6395 16.0167 22.4375C15.9411 22.5181 15.8662 22.598 15.7923 22.6767C15.3862 23.1094 15.0083 23.5092 14.6926 23.8261C14.3648 24.1553 14.1383 24.3592 14.0243 24.4325C13.8204 24.5634 13.7618 24.8341 13.8934 25.0369C14.0249 25.2398 14.2968 25.2982 14.5007 25.1672C14.7093 25.0332 15.0025 24.7571 15.3166 24.4418C15.6428 24.1143 16.0291 23.7054 16.4344 23.2737C16.5075 23.1957 16.5813 23.1171 16.6554 23.038C17.4098 22.2335 18.2062 21.3842 18.8322 20.8016C20.6879 19.0743 22.3902 18.1837 25.7714 16.5011C27.6476 15.5675 29.1333 14.334 30.302 13.2708L28.891 16.5815C28.7962 16.8038 28.9005 17.0604 29.1239 17.1547C29.3472 17.249 29.6051 17.1453 29.6999 16.9229L31.9651 11.608ZM24.1509 14.0059C24.3935 14.0038 24.5885 13.8064 24.5865 13.5649C24.5844 13.3235 24.386 13.1294 24.1434 13.1315C21.8832 13.1507 16.6524 14.5474 13.3524 19.9124C11.7578 22.5049 10.3871 24.3841 9.32526 25.6774C8.25564 26.9801 7.51591 27.668 7.18625 27.8993C7.04178 28.0006 6.9724 28.1782 7.01017 28.3501C7.04793 28.5219 7.18549 28.6545 7.35927 28.6866C9.9509 29.1646 14.1062 29.2334 18.2004 27.8949C22.3067 26.5525 26.366 23.7874 28.6944 18.5974C28.7933 18.3769 28.6939 18.1183 28.4723 18.0199C28.2508 17.9214 27.991 18.0204 27.8921 18.2409C25.6845 23.1617 21.8475 25.7822 17.9262 27.0642C14.4492 28.2009 10.9175 28.2798 8.43877 27.9682C8.85731 27.5597 9.38516 26.9864 10.0056 26.2307C11.096 24.9027 12.4893 22.9904 14.1018 20.369C17.2158 15.3062 22.1369 14.0231 24.1509 14.0059Z"
            class="fill-primary-content"
          />
        </svg>
      </div> -->
      <ul
        v-if="loggedIn"
        id="nav-items"
        tabindex="0"
        class="flex flex-col justify-start items-center p-4"
      >
        <nuxt-link
          v-for="(page, index) in pages"
          :key="index"
          :data-tip="page.name"
          :to="page.path"
          :class="
            state.ui.context.includes('cycles') && index == 1
              ? 'router-link-active router-link-exact-active'
              : state.ui.context.includes('settings') && index == 2
              ? 'router-link-active router-link-exact-active'
              : ''
          "
          class="btn btn-ghost hover:text-base-content active:scale-90 duration-150 flex justify-center items-center hover:tooltip-open tooltip tooltip-right"
        >
          <li>
            <Icon :name="page.icon" />
          </li>
        </nuxt-link>
      </ul>
    </div>

    <!-- navbar-end -->

    <ul class="flex flex-col justify-start items-center">
      <li
        v-if="loggedIn"
        class="dropdown dropdown-top cursor-pointer h-full w-fit"
      >
        <label
          tabindex="0"
          class="btn btn-ghost p-0 rounded-none h-full cursor-pointer hover:!bg-transparent"
        >
          <li
            class="avatar rounded-full hover:bg-transparent hover:brightness-90 duration-150"
            :class="collectionless && 'translate-y-16'"
          >
            <div class="w-8 rounded-full border border-base-300">
              <img :src="state.avatarUrl" alt="Avatar" />
            </div>
          </li>
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu w-fit border bg-base-100 border-base-300 rounded mb-3"
          :class="collectionless && 'translate-y-16'"
        >
          <li id="logout">
            <ModalTrigger
              target="confirmation"
              class="text-error active:!bg-error active:!text-error-content"
            >
              <Icon name="exit" size="18" />
              <span>Logout</span>
            </ModalTrigger>
          </li>
        </ul>
      </li>
      <li
        :class="collectionless && 'pointer-events-none opacity-0 scale-90'"
        class="tooltip tooltip-right hover:tooltip-open duration-150"
        :data-tip="`${state.ui.collections ? 'Close' : 'Open'} ${
          context.toLowerCase().split('-')[0] || ''
        } list`"
      >
        <button class="btn btn-ghost m-4" @click="global.toggleCollections">
          <Icon
            name="arrow_alt_left"
            class="duration-300"
            :class="state.ui.collections ? 'rotate-[0deg]' : 'rotate-[180deg]'"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
  #nav-items {
    @apply text-base-300/75;
  }

  #nav-items .router-link-active,
  #nav-items .router-link-exact-active {
    @apply text-black;
  }
</style>
