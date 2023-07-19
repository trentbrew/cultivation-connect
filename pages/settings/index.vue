<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const router = useRouter()

  const state = reactive({
    facility: '',
    avatar_url: '',
    payload: {
      avatar: null,
      username: {
        editing: false,
        value: '',
      },
      email: {
        editing: false,
        value: '',
      },
    },
  })

  onMounted(async () => {
    state.facility = await getFacilityName()
    state.avatarUrl = await pb.getAvatarUrl()
    const contactEmail = pb.api.authStore.model.contact_email
    if (!contactEmail) {
      await pb
        .update('users', pb.api.authStore.model.id, {
          contact_email: pb.api.authStore.model.email,
        })
        .then(() => {
          console.log('contact_email updated')
        })
        .catch(err => {
          console.log('error updating contact_email: ', err)
        })
    }
  })

  function edit(context) {
    state.payload[context].editing = true
  }

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

  async function refresh() {
    state.facility = await getFacilityName()
    state.avatarUrl = await pb.getAvatarUrl()
  }

  async function updateUsername() {
    await pb.update('users', pb.api.authStore.model.id, {
      username: state.payload.username.value,
    })
    refresh()
    global.toast('default', 'Username has been updated')
    state.payload.username.editing = false
  }

  async function updateEmail() {
    await pb.update('users', pb.api.authStore.model.id, {
      contact_email: state.payload.email.value,
    })
    refresh()
    global.toast('default', 'Email has been updated')
    state.payload.email.editing = false
  }

  function handleCancel() {
    state.payload.username.editing = false
    state.payload.email.editing = false
  }
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div
        class="w-full h-full flex flex-col pt-12 items-center justify-between p-4"
      >
        <!-- HEADER -->

        <!-- <div
          class="w-full pl-12 flex flex-col items-center justify-center gap-2 h-full"
        >
          <div class="h-32 w-32 rounded-full mb-8">
            <img :src="state.avatarUrl" alt="Avatar" class="rounded-full" />
          </div>
          <h1 class="text-3xl font-bold mb-10">
            {{ pb.api.authStore.model.first_name }}
            {{ pb.api.authStore.model.last_name }}
          </h1>
        </div> -->

        <!-- MAIN -->

        <!-- <div class="w-full flex flex-col gap-4 max-h-full">
          <div class="flex gap-4 h-full">
            <div
              class="stats stats-vertical rounded w-full border border-base-300 bg-blue-500"
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
                  <span v-show="!state.payload.username.editing">
                    {{ pb.api.authStore.model.username }}
                  </span>
                  <Icon
                    @click="edit('username')"
                    v-show="!state.payload.username.editing"
                    name="edit"
                    class="hover:opacity-50 cursor-pointer"
                  />
                  <input
                    class="bg-base-200/50 h-[32px] w-full mr-2 rounded-[8px]"
                    v-show="state.payload.username.editing"
                    v-model="state.payload.username.value"
                    type="text"
                  />
                  <div
                    v-show="state.payload.username.editing"
                    class="flex gap-2"
                  >
                    <button @click="handleCancel" class="btn btn-ghost btn-sm">
                      Cancel
                    </button>
                    <button
                      @click="updateUsername"
                      class="btn btn-primary btn-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              <div class="stat">
                <div class="stat-title">Email</div>
                <div class="stat-value text-xl flex justify-between">
                  <span v-show="!state.payload.email.editing">
                    {{
                      pb.api.authStore.model.contact_email ??
                      pb.api.authStore.model.email
                    }}
                  </span>
                  <Icon
                    @click="edit('email')"
                    v-show="!state.payload.email.editing"
                    name="edit"
                    class="hover:opacity-50 cursor-pointer"
                  />
                  <input
                    class="bg-base-200/50 h-[32px] w-full mr-2 rounded-[8px]"
                    v-show="state.payload.email.editing"
                    v-model="state.payload.email.value"
                    type="text"
                  />
                  <div v-show="state.payload.email.editing" class="flex gap-2">
                    <button @click="handleCancel" class="btn btn-ghost btn-sm">
                      Cancel
                    </button>
                    <button @click="updateEmail" class="btn btn-primary btn-sm">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full h-full bg-blue-500"><Table /></div>
          </div>
          <div class="flex gap-4 h-full">
            <div class="w-full h-full bg-blue-500"><Table /></div>
            <div class="w-full h-full bg-blue-500"><Table /></div>
          </div>
        </div> -->
      </div>
    </div>
  </AuthRouteGuard>
</template>
