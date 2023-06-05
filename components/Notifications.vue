<script setup>
  const global = useGlobalStore()
  const pb = usePocketbase()

  const state = reactive({
    notifications: [],
  })

  const notifications = computed(() => global.getNotifications)

  async function fetchNotifications() {
    const notifications = await pb.getFiltered('notifications', {
      filter: `user.id = "${pb.api.authStore.model.id}" && status != "dismissed"`,
    })
    state.notifications = notifications
  }

  watch(
    () => notifications.value,
    val => {
      console.log('notifications store was updated: ', val)
      state.notifications = val
    }
  )

  function handleModalToggle() {
    fetchNotifications()
  }

  function clearAll() {
    global.clearNotifications()
  }
</script>

<template>
  <div>
    <input
      @change="handleModalToggle"
      type="checkbox"
      id="notifications"
      class="modal-toggle"
    />
    <label for="notifications" class="modal sm:modal-middle">
      <label for="" class="p-0 m-0">
        <h1 v-if="state.notifications.length > 0" class="text-2xl mb-6 px-2">
          Notifications
        </h1>
        <ul class="overflow-y-auto max-h-[50vh]">
          <li
            v-if="state.notifications?.length > 0"
            class="flex flex-col gap-2 rounded"
          >
            <div
              v-for="(notification, index) in state.notifications"
              :key="index"
            >
              <Notification :key="index" :notification="notification" />
            </div>
          </li>
        </ul>
        <div
          v-if="state.notifications?.length == 0"
          class="h-96 flex justify-center items-center mt-12"
        >
          <p class="text-center">No notifications</p>
        </div>
        <div class="flex gap-2 mt-6 px-2">
          <!-- <button class="btn btn-sm bg-primary" @click="removeFilter">
            View dismissed
          </button> -->
          <button
            v-if="state.notifications?.length > 0"
            class="btn btn-sm"
            @click="clearAll"
          >
            Clear all
          </button>
        </div>
      </label>
    </label>
  </div>
</template>
