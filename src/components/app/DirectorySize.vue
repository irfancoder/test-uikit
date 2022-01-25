<template>
    <span>
        <span v-if="label">{{ label }} </span>
        <loader v-if="working" text="" :working="true" :loadingText="loadingText"></loader>
        <label v-else>{{ size }}</label>
    </span>
</template>

<script>
    export default {
        props: {
            url: String,
            label: { required: false },
            loadingText: String
        },

        data () {
            return {
                working: true,
                size: 0
            }
        },

        created () {
            this.fetch()
        },

        methods: {
            fetch () {
                window.enterPage(this.url).then(({data}) => {
                    this.working = false
                    this.size = data.size
                }).catch(e => {
                    if (e.response.status === 500) {
                        this.working = false
                        this.size = '-'
                    }
                    this.fetchingList = false
                })
            }
        }
    }
</script>
