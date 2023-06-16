<script setup>
  const router = useRouter();
</script>

<template>
  <div>
    <input type="checkbox" id="csv-upload" class="modal-toggle" />
    <label for="csv-upload" class="modal">
      <label for="" class="p-0 m-0">
        <div class="modal-box !border-base-200">
          <div class="w-[30vw] h-[50vh] flex justify-center items-center">
            🚧 This is the upload modal
          </div>
          <div class="modal-action absolute top-0 right-6">
            <label
              @click="router.push({ hash: '' })"
              for="csv-upload"
              class="btn btn-ghost btn-circle"
            >
              <Icon name="close" />
            </label>
          </div>
        </div>
      </label>
    </label>
  </div>
</template>
