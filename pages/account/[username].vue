<script setup>
  const pb = usePocketbase()
  const router = useRouter()
  const global = useGlobalStore()
</script>

<template>
  <AuthRouteGuard>
    <div class="w-full h-screen flex justify-center items-center">
      🚧 Profile page
    </div>
  </AuthRouteGuard>
</template>
