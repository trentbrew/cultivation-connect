<script setup>
  const pb = usePocketbase();
  const global = useGlobalStore();
  const router = useRouter();

  function handleFileInput(event) {
    if (event.target.files[0]) {
      state.payload.avatar = event.target.files[0];
    }
  }
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex flex-col">
      <div class="w-full h-full flex flex-col justify-center items-center p-4">
        <h1 class="text-3xl mb-12 font-bold">🚧 Settings page</h1>
        <p class="w-[50%] text-center">
          This page allows users to configure their profile, change their password, and update their avatar.
        </p>
      </div>
    </div>
  </AuthRouteGuard>
</template>
