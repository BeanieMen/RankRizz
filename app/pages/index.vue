<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-900 text-gray-100">
    <div class="flex">
      <div class="w-48 h-48 rounded-2xl overflow-hidden">
        <img
          :src="imageSrc || ''"
          :alt="randomUser || 'Random User'"
          class="w-full h-full object-cover"
        >
      </div>
      <div class="w-2/3 ml-8 flex flex-col justify-center">
        <h1 class="text-2xl font-bold mb-6">
          Username: {{ randomUser }}
        </h1>
      </div>
    </div>
    <GenerateAccountLink />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const imageSrc = ref<string | null>(null)
const randomUser = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(`/api/random`)
    const userData: { imageSrc: string, userName: string } = await response.json()
    imageSrc.value = userData.imageSrc
    randomUser.value = userData.userName
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>
