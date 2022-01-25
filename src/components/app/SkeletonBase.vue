<template>
    <vue-content-loading :width="width" :height="height" :speed="speed">
        <slot></slot>
    </vue-content-loading>
</template>

<script>
    import { VueContentLoading } from 'vue-content-loading'
    export default {
        components: {
            VueContentLoading
        },
        props: {
            width: { type: Number, required: true, default: 300 },
            height: { type: Number, required: true, default: null },
            speed: { type: Number, required: false, default: 1 }
        }
    }
</script>