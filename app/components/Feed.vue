<template>
    <div class="max-w-7xl mx-auto p-6 bg-background text-text h-[40rem] flex items-center justify-center">
        <div
            class="w-full max-w-5xl p-6 rounded-lg flex flex-col md:grid md:grid-cols-2 md:gap-x-36 place-items-center">

            <div class="w-full md:w-auto flex justify-center mb-6 md:mb-0">
                <UCarousel :items="imagePaths" :ui="carouselUI" indicators class="w-full md:w-[30rem] mx-auto">
                    <template #default="{ item }">
                        <img :src="item" class="w-full" draggable="false" />
                    </template>
                    <template #indicator="{ onClick, page, active }">
                        <UButton :label="String(page)" :variant="active ? 'solid' : 'outline'" size="2xs"
                            class="rounded-full min-w-6 justify-center" @click="handleIndicatorClick(page, onClick)" />
                    </template>
                </UCarousel>
            </div>

            <div class="flex flex-col space-y-6 w-full md:pl-8">
                <div class="text-center">
                    <h1 class="text-2xl md:text-3xl font-bold mb-4">
                        Username: <span class="text-accent">{{ randomUser }}</span>
                        <h2 class="text-md md:text-lg font-semibold mt-2">Rating image number: {{ pageRef }}</h2>

                    </h1>
                </div>

                <div class="flex flex-col items-center mb-6">
                    <NuxtRating :read-only="false" :rating-size="24" :rating-value="rating" border-color="#db8403"
                        active-color="#ffa41c" inactive-color="#111827" :rating-step="0.5" :rating-level="10"
                        :rating-count="10" :rounded-corners="true" :border-width="5" @rating-selected="updateRating"
                        class="bg-background" />
                </div>

                <div class="w-full mb-6">
                    <h2 class="text-lg md:text-xl font-semibold mb-2 text-center">Leave a comment:</h2>
                    <textarea v-model="comment" rows="4"
                        class="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Write your comment here..."></textarea>
                </div>

                <div class="mt-4 flex flex-col items-center w-full">
                    <button @click="submitFeedback"
                        class="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark">
                        Submit
                    </button>
                    <p v-if="statusMessage" :class="statusMessageClass" class="mt-5">{{ statusMessage }}</p>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    imageIds: string[]
    randomUser: string,
    imagePaths: string[],
}>()


const pageRef = ref(1)
const rating = ref(0)
const comment = ref('')
const statusMessage = ref<string | null>(null)
const statusMessageClass = ref('')
const images = ref<string[]>([])

const carouselUI = {
    item: 'basis-full',
    container: 'rounded-lg',
    indicators: {
        wrapper: 'relative bottom-0 mt-4',
    },
}

function updateRating(value: number) {
    rating.value = value
}

function handleIndicatorClick(page: number, onClick: (page: number) => void) {
    pageRef.value = page
    onClick(page)
}

async function submitFeedback() {
    const formData = new FormData()
    formData.append('imageId', props.imageIds[pageRef.value - 1]!)

    if (rating.value > 0) {
        formData.append('starRating', String(rating.value))
    }
    if (comment.value.trim()) {
        formData.append('comment', comment.value)
    }

    resetForm()

    const response = await $fetch("/api/receive-rating", {
        method: 'POST',
        body: formData,
    })
    if (!response.error) {
        setStatusMessage("Successfully rated!", "text-green-500")
    } else {
        setStatusMessage(response.error, "text-red-500")
    }
}

function resetForm() {
    rating.value = 0
    comment.value = ''
}

function setStatusMessage(message: string, messageClass: string) {
    statusMessage.value = message
    statusMessageClass.value = messageClass
}

</script>