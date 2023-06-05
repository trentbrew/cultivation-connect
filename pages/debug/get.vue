<script setup>
  const pb = usePocketbase()
  const res = await pb.get('test_collection')
  console.log(res)
</script>
