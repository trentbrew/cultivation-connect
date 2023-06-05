<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const route = useRoute()

  const pages = [
    {
      name: 'Cycles',
      path: '/cycles',
    },
    {
      name: 'Plants',
      path: '/plants',
    },
    {
      name: 'Tasks',
      path: '/tasks',
    },
  ]

  const avatar = computed(() => global.avatarUrl)

  const notifications = computed(() => global.notifications)

  const loggedIn = computed(() => {
    const user = pb.api.authStore
    if (user.isValid && user.model.id && user.token) return true
    return false
  })

  const context = computed(() => {
    let ctx = route.name
    if (ctx == 'account-username') return pb.api.authStore.model.username
    if (ctx == 'auth-login') return 'Login'
    if (ctx == 'auth-signup') return 'Sign Up'
    return ctx.charAt(0).toUpperCase() + ctx.slice(1)
  })
</script>

<template>
  <div class="navbar bg-base-100 z-50 border-b border-base-200 p-0">
    <!-- navbar-start -->

    <div class="navbar-start">
      <div v-if="loggedIn" class="dropdown">
        <label
          tabindex="0"
          class="btn btn-ghost active:bg-transparent hover:bg-transparent lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </label>
        <ul
          v-if="loggedIn"
          tabindex="0"
          class="py-2 mt-2 dropdown-content menu w-60 border bg-base-100 border-base-200 rounded-br"
        >
          <li v-for="(page, index) in pages" :key="index">
            <nuxt-link class="!rounded-none" :to="page.path">{{
              page.name
            }}</nuxt-link>
          </li>
        </ul>
      </div>
      <a
        class="normal-case text-xl md:ml-4 flex items-center justify-start gap-4"
      >
        <span class="text-primary">
          <svg
            width="24"
            height="24"
            viewBox="0 0 38 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M36.9497 5.9155C37.0577 5.66224 36.9879 5.36855 36.7774 5.19023C36.5669 5.0119 36.2645 4.99023 36.0305 5.13671C35.2355 5.63441 33.8926 6.38667 32.4702 7.01206C31.0238 7.64797 29.5901 8.10935 28.5782 8.10935C28.2288 8.10935 27.9456 8.39123 27.9456 8.73895C27.9456 9.08667 28.2288 9.36855 28.5782 9.36855C29.7803 9.36855 31.2799 8.88618 32.6571 8.3038C31.2174 9.53901 29.5173 10.8141 27.465 11.8354C22.6075 14.2526 19.9978 15.6064 17.1741 18.2347C16.239 19.1051 15.0615 20.3609 13.9841 21.51L13.984 21.51C13.8752 21.6261 13.7674 21.7411 13.661 21.8545C13.0761 22.4775 12.532 23.0533 12.0774 23.5097C11.6053 23.9836 11.2792 24.2774 11.1149 24.3828C10.8214 24.5714 10.737 24.9611 10.9265 25.2532C11.1159 25.5454 11.5075 25.6294 11.801 25.4408C12.1014 25.2479 12.5236 24.8502 12.9759 24.3962C13.4456 23.9246 14.0019 23.3358 14.5855 22.7141C14.6908 22.6019 14.797 22.4887 14.9038 22.3748C15.9901 21.2163 17.137 19.9934 18.0384 19.1544C20.7106 16.6671 23.1618 15.3845 28.0308 12.9616C30.7326 11.6172 32.872 9.84097 34.5548 8.31007L32.523 13.0774C32.3866 13.3975 32.5367 13.7671 32.8584 13.9029C33.18 14.0386 33.5514 13.8892 33.6878 13.5691L36.9497 5.9155ZM25.6973 9.36853C26.0467 9.36555 26.3275 9.08127 26.3245 8.73356C26.3215 8.38585 26.0359 8.10639 25.6865 8.10937C22.4318 8.13712 14.8994 10.1483 10.1474 17.8739C7.85123 21.607 5.87744 24.3132 4.34837 26.1755C2.80813 28.0515 1.74291 29.042 1.26819 29.375C1.06016 29.5209 0.960256 29.7767 1.01464 30.0242C1.06902 30.2716 1.26711 30.4625 1.51735 30.5087C5.2493 31.1971 11.233 31.2962 17.1286 29.3688C23.0416 27.4356 28.8871 23.4538 32.2399 15.9803C32.3823 15.6628 32.2392 15.2905 31.9202 15.1487C31.6011 15.0069 31.227 15.1494 31.0846 15.4669C27.9056 22.5529 22.3804 26.3264 16.7337 28.1724C11.7269 29.8093 6.64114 29.923 3.07183 29.4742C3.67452 28.886 4.43463 28.0605 5.32811 26.9723C6.89822 25.0599 8.90465 22.3062 11.2265 18.5314C15.7108 11.241 22.7972 9.39325 25.6973 9.36853Z"
              fill="currentColor"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <h1 class="text-lg min-w-fit font-medium">Cultivation Connect</h1>
      </a>
    </div>

    <!-- navbar-center -->

    <div class="navbar-center hidden lg:flex">
      <ul v-if="loggedIn" class="menu menu-horizontal px-1">
        <li v-for="(page, index) in pages" :key="index">
          <nuxt-link class="!rounded-none" :to="page.path">{{
            page.name
          }}</nuxt-link>
        </li>
      </ul>
    </div>

    <!-- navbar-end -->

    <ul class="navbar-end pr-2">
      <!-- <li v-if="loggedIn" id="notifications">
        <ModalTrigger target="notifications" class="group">
          <div class="indicator">
            <span
              v-if="notifications?.length > 0"
              class="indicator-item rounded-full h-3 w-3 -translate-x-[14px] translate-y-[10px] badge badge-error p-0 cursor-pointer"
            ></span>
            <Icon
              name="bell"
              size="24"
              class="btn btn-ghost hover:bg-transparent group-hover:opacity-50 text-base-content px-3"
            />
          </div>
        </ModalTrigger>
      </li> -->
      <li
        v-if="loggedIn"
        class="dropdown dropdown-bottom dropdown-end cursor-pointer h-full"
      >
        <label
          tabindex="0"
          class="btn btn-ghost -mr-2 pl-3 rounded-none h-full flex items-center gap-2 cursor-pointer group hover:bg-transparent"
        >
          <div class="avatar rounded-full border border-base-200">
            <div class="w-6 rounded-full">
              <img :src="avatar" alt="Avatar" />
            </div>
          </div>
          <Icon
            name="dropdown"
            class="text-base-content duration-75 group-hover:translate-y-[2px] group-hover:opacity-50"
          />
        </label>

        <ul
          tabindex="0"
          class="dropdown-content menu w-60 border border-base-200 rounded-bl -mr-2"
        >
          <li>
            <nuxt-link :to="`/account/${pb.api.authStore.model.username}`">
              <Icon name="user" size="18" />
              <span>Profile</span>
            </nuxt-link>
          </li>
          <li class="group">
            <nuxt-link to="/settings">
              <Icon
                name="settings"
                size="18"
                class="group-hover:rotate-45"
                style="transition: transform 300ms ease"
              />
              <span>Settings</span>
            </nuxt-link>
          </li>
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

      <ul v-if="!loggedIn" class="menu menu-horizontal px-1">
        <li id="login">
          <nuxt-link to="/auth/login" class="!rounded-none">Login</nuxt-link>
        </li>
        <li id="signup">
          <nuxt-link to="/auth/signup" class="!rounded-none">Signup</nuxt-link>
        </li>
      </ul>
    </ul>
  </div>
</template>

<style lang="scss">
  .navbar-center ul,
  .navbar-end,
  #login,
  #signup {
    height: 4rem;
  }
  .navbar-center li a,
  #login a,
  #signup a {
    @apply font-medium border-b-2 border-transparent text-base-300 hover:text-base-content hover:bg-transparent active:opacity-[1] translate-y-[1px] duration-75 active:scale-95;
  }
  .navbar-center li a.router-link-exact-active,
  #signup a.router-link-exact-active,
  #login a.router-link-exact-active {
    @apply opacity-[1] bg-transparent border-primary text-base-content;
  }
  .navbar-end li a,
  .navbar-start li a {
    @apply active:bg-neutral/20 active:text-neutral hover:bg-neutral/10;
    &.router-link-exact-active {
      @apply bg-base-100 hover:bg-neutral/10;
    }
  }
</style>
