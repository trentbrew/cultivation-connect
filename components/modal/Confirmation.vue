<script setup>
  const pb = usePocketbase();
  const router = useRouter();

  function handleLogout() {
    pb.logout();
    setTimeout(() => {
      router.push('/auth/login');
    }, 1000);
  }
</script>

<template>
  <div>
    <input type="checkbox" id="confirmation" class="modal-toggle" />
    <label for="confirmation" class="modal modal-bottom sm:modal-middle">
      <label for="" class="p-0 m-0">
        <div
          class="modal-box p-4 rounded-t-none sm:rounded-t !w-full !border-base-200"
        >
          <p>Are you sure you want to log out?</p>
          <div class="modal-action">
            <label for="confirmation" class="btn btn-sm btn-outline">
              Cancel
            </label>
            <label
              for="confirmation"
              class="btn btn-sm btn-error"
              @click="handleLogout"
            >
              Log out
            </label>
          </div>
        </div>
      </label>
    </label>
  </div>
</template>
