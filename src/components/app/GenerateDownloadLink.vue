<template>
    <div style="position: relative">
        <spinner loading-text="" text="" :working="fetchingLink" v-if="fetchingLink"></spinner>
        <a href="#" @click.prevent="generateDownloadLink" role="button">{{ fileName }}</a>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            fileName: String
        },

        data () {
            return {
                fetchingLink: false
            }
        },

        methods: {
            generateDownloadLink (blogId, userId) {
                this.fetchingLink = true
                window.enterPage(this.url, {}, { method: 'get', showAlert: false }).then(response => {
                    if (response.data.url !== undefined) {
                        window.open(response.data.url, '_blank')
                    }

                    this.fetchingLink = false
                    // eslint-disable-next-line handle-callback-err
                }).catch(error => {
                    this.fetchingLink = false
                }).finally(() => {
                    this.fetchingLink = false
                })
            }
        }
    }
</script>
