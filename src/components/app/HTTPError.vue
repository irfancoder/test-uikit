<template>
    <div class="container mx-auto h-full">
        <div class="text-center">
            <img :src="imgSrc" loading="lazy" class="w-80 my-8 mx-auto" alt="http-error-image">
            <h1 class="font-black text-2xl mb-1">{{ title }}</h1>
            <p class="text-lg mb-2" v-html="message"></p>
            <a :href="url" class="mb-7 inline-block">{{ urlLabel }}</a>
        </div>
        <slot name="error"></slot>
    </div>
</template>

<script>
    export default {
        props: {
            imgSrc: { required: true },
            message: { required: true },
            title: { required: true },
            url: { required: true },
            urlLabel: { required: true }
        }
    }
</script>
