<template>
    <div class="flex items-center justify-center min-h-screen bg-background">
        <p class="text-2xl font-semibold text-white">
            Logging in, please wait...
        </p>
    </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'nuxt/app'
import { useCookie } from 'nuxt/app'

const route = useRoute()
const router = useRouter()

const passKey = route.query.pass as string | undefined

if (passKey) {
    const passKeyCookie = useCookie('passKey')
    passKeyCookie.value = passKey

    setTimeout(() => {
        router.push('/user')
    }, 1000)
}
</script>