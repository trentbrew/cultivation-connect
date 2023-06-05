<script setup>
  const pb = usePocketbase();
  const global = useGlobalStore();
  const router = useRouter();
  const route = useRoute();

  const testData = [
    {
      name: 'Tomato',
      color: 'red',
      size: 'medium',
    },
    {
      name: 'Potato',
      color: 'brown',
      size: 'small',
    },
    {
      name: 'Carrot',
      color: 'orange',
      size: 'medium',
    },
  ];

  // TODO: fetch plants from pocketbase
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div class="w-full h-full flex flex-col justify-center items-center p-4">
        <h1 class="text-3xl mb-8 font-bold">🚧 Plants page</h1>
        <p class="w-[50%] text-center mb-8">This page is an overview of your inventory.</p>
        <DrawerToggle class="bg-black font-bold" for="new-plant" label="Add plants" icon="plus" :item="route.hash" />
      </div>
    </div>
  </AuthRouteGuard>
</template>
