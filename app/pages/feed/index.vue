<template>
  <div v-if="noUsersAvailable" class="flex justify-center items-center h-screen">
    <p class="text-center text-5xl text-white">There are currently no photos to be rated.</p>
  </div>
  <div v-else @scroll="handleScroll" class="h-screen overflow-auto flex flex-col">
    <div class="flex-1">
      <template v-if="users.length">
        <Feed 
          v-for="(user, index) in users" 
          :key="index" 
          :image-locations="user.imageLocations"
          :random-user="user.username" 
          :random-user-id="user.userId" 
        />
      </template>
    </div>
    <div v-if="allUsersFetched" class="text-center text-xl font-bold mb-10 mt-4 text-white">All users have been fetched.</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const users = ref<{ imageLocations: string[], username: string, userId: string }[]>([])
const allUsersFetched = ref(false)
const noUsersAvailable = ref(false)
const fetchedUserIds = ref<Set<string>>(new Set())

async function fetchRandomUsers() {
  try {
    const response = await $fetch(`/api/random`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fetchedUserIds: Array.from(fetchedUserIds.value) }),
    })

    const randomData = response

    if (randomData) {
      if (randomData.userId) {
        noUsersAvailable.value = false
        fetchedUserIds.value.add(randomData.userId)
        users.value.push({
          imageLocations: randomData.imageLocations ?? [],
          username: randomData.username ?? '',
          userId: randomData.userId ?? ''
        })
      } else {
        allUsersFetched.value = true
      }
    } else {
      allUsersFetched.value = true
    }
  } catch (error) {
    console.error('Error fetching random users:', error)
  }
}

async function handleScroll(event: Event) {
  if (allUsersFetched.value) return

  const target = event.target as HTMLElement

  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 5) {
    await fetchRandomUsers()
  }
}

// Initial fetch
await fetchRandomUsers()
await fetchRandomUsers()
</script>
