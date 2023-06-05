<script setup>
  const global = useGlobalStore();
  const pb = usePocketbase();
  const router = useRouter();
  const route = useRoute();

  const state = reactive({
    loading: false,
    payload: {
      email: '',
      password: '',
    },
  });

  onMounted(() => {
    console.log('mounted login page', route.path);
  });

  async function handleLogin() {
    state.loading = true;
    const user = await pb
      .login(state.payload)
      .then(res => {
        // TODO: route to onboarding if user is new
        setTimeout(() => {
          router.push('/intake');
        }, 1000);
      })
      .catch(err => {
        if (err.data.data.message) {
          global.toast('error', err.data.data.message);
        } else {
          global.toast('error', 'Incorrect email or password');
        }
        state.loading = false;
      });
  }
</script>

<template>
  <AuthRouteGuard reverse>
    <h1 class="text-2xl mb-24 w-full text-center">Welcome back!</h1>

    <div class="flex flex-row">
      <form class="card flex-col w-[30vw] gap-4">
        <input
          class="input input-bordered w-full"
          type="email"
          id="email"
          placeholder="Email"
          v-model="state.payload.email"
          autocomplete="username"
        />
        <input
          class="input input-bordered w-full"
          type="password"
          id="password"
          placeholder="Password"
          v-model="state.payload.password"
          autocomplete="off"
        />
        <button @click.prevent="handleLogin" class="btn btn-primary" :disabled="state.loading">
          {{ state.loading ? 'Logging in...' : 'Log in' }}
        </button>
        <span class="font-medium text-sm w-full text-center mt-12">
          Not registered yet?
          <nuxt-link class="text-primary hover:underline" to="/auth/signup">Sign up</nuxt-link>
        </span>
      </form>
    </div>
  </AuthRouteGuard>
</template>
