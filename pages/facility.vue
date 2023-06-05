<script setup>
  const pb = usePocketbase();
  const global = useGlobalStore();
  const router = useRouter();
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div class="w-full h-full flex flex-col justify-center items-center p-4">
        <h1 class="text-3xl mb-12 font-bold">🚧 Facility overview</h1>
        <p class="w-[50%] text-center">
          This page is collection of tables displaying your facility's rooms, zones, benches, and active cycles for
          each.
        </p>
      </div>
    </div>
  </AuthRouteGuard>
</template>
