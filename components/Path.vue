<script setup>
  const router = useRouter();
  const props = defineProps({
    page: {
      type: String,
      required: true,
    },
    cycle: {
      type: Object,
      default: 'Untitled cycle',
    },
  });
</script>

<template>
  <div>
    <div class="flex justify-start items-center gap-6">
      <h1 class="text-lg">
        <span class="text-base-content/30">{{ props.page }}</span>
        <span class="text-base-300 mx-4">/</span>
        <span class="font-bold">{{ props.cycle.name }}</span>
      </h1>
      <!-- TODO: link to cultivar settings based on hash -->
      <DrawerToggle
        @click="router.push({ hash: `#edit–${props.cycle.id}` })"
        :for="`edit-cultivar`"
        icon="edit"
        class="btn btn-ghost -ml-3"
      />
    </div>
  </div>
</template>
