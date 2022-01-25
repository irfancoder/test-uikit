<template>
    <button class="inline-block mt-7 btn btn-primary" @click="openAuth(url)">{{ btnText}}</button>
</template>

<script>
export default {
    props: {
        btnText: String,
        url: String
    },
    methods: {
        openAuth(url) {
            window.open(url, '', 'width=1000,height=800')
        }
    }
}
</script>
