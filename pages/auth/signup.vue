<script setup>
  const router = useRouter()
  const global = useGlobalStore()
  const pb = usePocketbase()

  const state = reactive({
    loading: false,
    payload: {
      username: null,
      email: null,
      emailVisibility: true,
      password: null,
      passwordConfirm: null,
      first_name: null,
      last_name: null,
      facility: '',
    },
  })

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  async function handleSignup() {
    state.loading = true
    pb.signup({
      ...state.payload,
      first_name: capitalize(state.payload.first_name ?? ''),
      last_name: capitalize(state.payload.last_name ?? ''),
      email: (state.payload.email ?? '').toLowerCase(),
      contact_email: (state.payload.email ?? '').toLowerCase(),
    })
      .then(() => {
        setTimeout(() => {
          global.toast('primary', 'Signup successful! Login to continue.')
          router.push('/auth/login')
        }, 3000)
      })
      .catch(err => {
        console.log('ope...', { err })
        if (err.data?.data[0]) {
          const errorContext = Object.entries(err.data?.data)[0]
          console.log('errorContext: ', errorContext)
          const message = `${capitalize(
            errorContext[0]
          )}: ${errorContext[1].message.toLowerCase()}`
          console.log('message:', message)
          global.toast('error', message)
          state.loading = false
        } else {
          const errorContext = Object.entries(err.data?.data)[0]
          console.log('err.data?.data: ', errorContext)
          global.toast(
            'error',
            `${capitalize(errorContext[0])}: ${errorContext[1].message}`
          )
          state.loading = false
        }
      })
  }
</script>

<template>
  <AuthRouteGuard reverse>
    <h1 class="text-2xl mb-24 w-full text-center">Create a new account</h1>
    <div class="flex flex-row">
      <div class="w-fit flex justify-center items-center">
        <form class="card flex-col gap-4 w-[30vw]">
          <div class="flex gap-4 w-full">
            <input
              class="input input-bordered w-full"
              type="text"
              id="first_name"
              placeholder="First name"
              v-model="state.payload.first_name"
              autocomplete="off"
            />
            <input
              class="input input-bordered w-full"
              type="text"
              id="last_name"
              placeholder="Last name"
              v-model="state.payload.last_name"
              autocomplete="off"
            />
          </div>
          <input
            class="input input-bordered"
            type="text"
            id="email"
            placeholder="Email"
            v-model="state.payload.email"
            autocomplete="off"
          />
          <input
            class="input input-bordered"
            type="text"
            id="username"
            placeholder="Username"
            v-model="state.payload.username"
            autocomplete="off"
          />
          <div class="flex gap-4 w-full">
            <input
              class="input input-bordered w-full"
              type="password"
              id="password"
              placeholder="Password"
              v-model="state.payload.password"
              autocomplete="off"
            />
            <input
              class="input input-bordered w-full"
              type="password"
              id="confirm-password"
              placeholder="Confirm password"
              v-model="state.payload.passwordConfirm"
              autocomplete="off"
            />
          </div>
          <button
            @click.prevent="handleSignup"
            class="btn btn-primary"
            :disabled="state.loading"
          >
            {{ state.loading ? 'Creating account...' : 'Create account' }}
          </button>
          <span class="font-medium text-sm w-full text-center mt-12">
            Already a user?
            <nuxt-link class="text-primary hover:underline" to="/auth/login">
              Login
            </nuxt-link>
          </span>
        </form>
      </div>
    </div>
  </AuthRouteGuard>
</template>
