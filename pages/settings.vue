<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const router = useRouter()

  const state = reactive({
    facility: '',
    avatar_url: '',
  })

  function handleFileInput(event) {
    if (event.target.files[0]) {
      state.payload.avatar = event.target.files[0]
    }
  }

  async function getFacilityName() {
    const facility = pb.api.authStore.model.facility
    const data = await pb.get('facilities', { id: facility })
    return data.company_name
  }

  onMounted(async () => {
    state.facility = await getFacilityName()
    pb.getAvatarUrl().then(url => {
      state.avatarUrl = url
    })
  })
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div class="w-full h-full flex flex-col justify-center items-center p-4">
        <div class="h-32 w-32 rounded-full mb-8">
          <img :src="state.avatarUrl" alt="Avatar" class="rounded-full" />
        </div>
        <h1 class="text-3xl font-bold mb-10">
          {{ pb.api.authStore.model.first_name }}
          {{ pb.api.authStore.model.last_name }}
        </h1>
        <div
          class="stats stats-vertical rounded w-[50%] border border-base-300"
        >
          <div class="stat">
            <div class="stat-title">Facility</div>
            <div class="stat-value text-xl">
              {{ state.facility }}
            </div>
          </div>
          <div class="stat">
            <div class="stat-title">Username</div>
            <div class="stat-value text-xl flex justify-between">
              {{ pb.api.authStore.model.username }}
              <Icon name="edit" class="hover:opacity-50 cursor-pointer" />
            </div>
          </div>
          <div class="stat">
            <div class="stat-title">Email</div>
            <div class="stat-value text-xl flex justify-between">
              {{ pb.api.authStore.model.email }}
              <Icon name="edit" class="hover:opacity-50 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthRouteGuard>
</template>
