<script setup>
  const pb = usePocketbase()
  const global = useGlobalStore()
  const router = useRouter()
</script>

<template>
  <AuthRouteGuard>
    <div><h1></h1></div>
  </AuthRouteGuard>
</template>
