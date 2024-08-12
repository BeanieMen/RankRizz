<template>
  <div v-if="noUsersAvailable" class="flex justify-center items-center h-screen">
    <p class="text-center text-5xl text-white">There are currently no photos to be rated.</p>
  </div>
  <div v-else @scroll="handleScroll" class="h-screen overflow-auto flex flex-col">
    <div class="flex-1">
      <Feed 
        v-for="user in users" 
        :key="user.userId" 
        :image-paths="user.imagePath"
        :random-user="user.username" 
      />
    </div>
    <div v-if="allUsersFetched" class="text-center text-xl font-bold mb-10 mt-4 text-white">
      All users have been fetched.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'

const users = ref<{ imageIds: string[], username: string, userId: string, imagePath: string[] }[]>([])
const allUsersFetched = ref(false)
const noUsersAvailable = ref(false)
const fetchedUserIds = ref<Set<string>>(new Set())

async function fetchRandomUsers() {
  try {
    const response = await $fetch('/api/random', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fetchedUserIds: Array.from(fetchedUserIds.value) }),
    })

    if (response && response.userId) {
      noUsersAvailable.value = false
      fetchedUserIds.value.add(response.userId)
      users.value.push({
        imageIds: response.imageIds ?? [],
        username: response.username ?? '',
        userId: response.userId ?? '',
        imagePath: response.imageIds?.map(id => `/user-photos/${response.userId}/id_${id}.webp`) ?? [],
      })
    } else {
      allUsersFetched.value = true
    }
  } catch (error) {
    console.error('Error fetching random users:', error)
  }
}

const handleScroll = useThrottleFn(async (event: Event) => {
  if (allUsersFetched.value) return

  const target = event.target as HTMLElement
  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 5) {
    await fetchRandomUsers()
  }
}, 300)

await fetchRandomUsers()
await fetchRandomUsers()

</script>
