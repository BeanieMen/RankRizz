<template>
  <div class="flex flex-col items-center justify-center bg-gray-900 h-[calc(100vh-4rem)]">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="space-y-4 text-black">
        <p>ID: <span class="font-bold">{{ user.id }}</span></p>
        <p>Username: <span class="font-bold">{{ user.username }}</span></p>
        <p>Pass Key: <span class="font-bold">{{ user.pass_key }}</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const user = ref({ id: null, username: null, pass_key: null })
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch(`/api/user/${route.params.id}`)
    const userData = await response.json()
    user.value = userData.user
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
  finally {
    loading.value = false
  }
})
</script>
