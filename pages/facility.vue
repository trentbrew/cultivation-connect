<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const router = useRouter()

  const state = reactive({
    data: {
      facility: null,
      rooms: null,
      zones: null,
      cultivars: null,
      cycles: null,
      records: null,
    },
  })

  function pbFetch(collection, options) {
    let data
    if (!options) {
      data = pb.get(collection, {
        filter: `facility.id = "${pb.api.authStore.model.facility}"`,
      })
    } else {
      data = pb.get(collection, options)
    }
    return data
  }

  onMounted(async () => {
    console.clear()
    console.log('facility page mounted. fetching data...')
    const user = pb.api.authStore.model
    state.data.facility = await pbFetch('facilities', { id: user.facility })
    state.data.rooms = await pbFetch('rooms')
    state.data.zones = await pbFetch('zones')
    state.data.cultivars = await pbFetch('cultivars')
    state.data.cycles = await pbFetch('cycles')
    console.log('state.data: ', state.data)
  })

  const greet = computed(() => {
    const now = new Date()
    const hour = now.getHours()
    const name = pb.api.authStore.model.first_name
    if (hour < 12) return `Good morning, ${name}!`
    else if (hour < 18) return `Good afternoon, ${name}!`
    else return `Good evening, ${name}!`
  })
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div id="content" class="flex flex-col flex-grow">
        <div class="w-full flex flex-col justify-center items-start p-8">
          <span class="text-lg">{{ greet }}</span>
          <h1 class="text-5xl mt-4">{{ state.data.facility?.company_name }}</h1>
        </div>
        <header class="p-4">
          <div
            class="stats stats-horizontal rounded w-full border border-base-300"
          >
            <div class="stat">
              <div class="stat-title">Yield</div>
              <div class="stat-value">{{ 0 }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Active cycles</div>
              <div class="stat-value">
                {{ 0 }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Vital conditions</div>
              <div class="stat-value">
                {{ 0 }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Dire conditions</div>
              <div class="stat-value">
                {{ 0 }}
              </div>
            </div>
          </div>
        </header>

        <div class="w-full h-full p-4 pt-0">
          <div class="w-full h-full grid grid-rows-2 gap-4 grid-cols-4">
            <div
              class="border-[1px] border-base-300 rounded-[8px] p-4 bg-base-100 col-span-4"
            >
              multi-line chart
            </div>
            <div
              class="border-[1px] border-base-300 rounded-[8px] p-4 bg-base-100 col-span-2"
            >
              twin table
            </div>
            <div
              class="border-[1px] border-base-300 rounded-[8px] p-4 bg-base-100"
            >
              table
            </div>
            <div
              class="border-[1px] border-base-300 rounded-[8px] p-4 bg-base-100"
            >
              table
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthRouteGuard>
</template>
