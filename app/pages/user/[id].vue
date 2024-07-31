<template>
  <div class="flex flex-col items-center justify-center bg-gray-900 h-[calc(100vh-4rem)]">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="space-y-4 text-black">
        <p>ID: <span class="font-bold">{{ data.id }}</span></p>
        <p>Username: <span class="font-bold">{{ data.username }}</span></p>
        <p>User ID: <span class="font-bold">{{ data.user_id }}</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const data = ref({ id: null, username: null, user_id: null })
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch(`/api/user/${route.params.id}`)
    const user = await response.json()
    data.value = user.user // Access nested user object
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
  finally {
    loading.value = false
  }
})
</script>
