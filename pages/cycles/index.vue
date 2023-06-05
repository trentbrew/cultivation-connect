<script setup>
  const pb = usePocketbase();
  const global = useGlobalStore();
  const router = useRouter();
  const route = useRoute();

  const facilityID = pb.api.authStore.model.facility;

  const state = reactive({
    data: {
      cycles: [],
    },
  });

  onMounted(() => {
    fetchCycles();
  });

  async function fetchCycles() {
    const data = await pb.get('cycles', {
      filter: `facility.id = "${facilityID}"`,
    });
    state.data.cycles = data;
    if (data.length > 0) {
      const path = `/cycles/${state.data.cycles[0].id}`;
      console.log('routing to', path);
      router.push(path);
    }
  }
</script>

<template>
  <AuthRouteGuard>
    <div class="h-screen w-full p-4">
      <div
        class="flex flex-col justify-center items-center rounded w-full h-full gap-10"
      >
        <Icon name="calendar" size="120" class="text-base-200" />
        <h1 class="text-center max-w-lg">
          <strong>Cycles</strong>
          <span class="text-base-content/50">
            allow you to track the health of your crops by visualizing your grow
            conditions over time and providing predictive insights that help you
            make better decisions.
          </span>
        </h1>
        <DrawerToggle
          for="new-cycle"
          label="Create a new cycle"
          icon="plus"
          class="btn-primary"
        />
      </div>
    </div>
  </AuthRouteGuard>
</template>
