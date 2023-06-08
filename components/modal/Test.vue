<script setup>
  const pb = usePocketbase();
  const router = useRouter();
</script>

<template>
  <div>
    <input type="checkbox" id="test-modal" class="modal-toggle" />
    <label for="test-modal" class="modal modal-bottom sm:modal-middle">
      <label for="" class="p-0 m-0">
        <div class="modal-box p-4 rounded-t-none sm:rounded-t !w-full !border-base-200">
          <p>This is just a test modal</p>
          <div class="modal-action">
            <label for="test-modal" class="btn btn-sm btn-primary">OK</label>
          </div>
        </div>
      </label>
    </label>
  </div>
</template>
