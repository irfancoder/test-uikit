<template>
    <div>{{ short }}</div>
</template>

<script>
    export default {
        props: {
            text: String,
            start: { default: 0 },
            end: { default: 2 }
        },

        data () {
            return {
                short: null
            }
        },

        created () {
            this.short = this.text.slice(this.start, this.end)
        }
    }
</script>
