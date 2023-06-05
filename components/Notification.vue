<script setup>
  const pb = usePocketbase()
  const router = useRouter()
  const global = useGlobalStore()

  const props = defineProps({
    notification: {
      type: Object,
      required: true,
    },
  })

  function dismiss() {
    console.log('dismisssing notification...', props.notification.id)
    global.dismissNotification(props.notification.id)
    pb.update('notifications', props.notification.id, {
      status: 'dismissed',
    })
  }

  function handleAction() {
    router.push(props.notification.path)
  }
</script>

<template>
  <div
    @click.self="handleAction"
    :to="props.link"
    class="group alert !rounded bg-base-100 border border-base-200 w-full md:w-[50vw] hover:scale-[0.98] cursor-pointer active:scale-[0.96] duration-150"
  >
    <div>
      <div class="pl-1">
        <h3 class="font-bold">{{ props.notification.title }}</h3>
        <div class="text-xs">{{ props.notification.body }}</div>
      </div>
    </div>
    <div class="flex-none">
      <Icon
        name="open"
        size="18"
        class="text-transparent group-hover:text-primary duration-150"
      />
      <button @click="dismiss" class="btn btn-sm btn-ghost ml-1">✕</button>
    </div>
  </div>
</template>
