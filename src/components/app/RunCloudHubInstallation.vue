<template>
    <div class="flex items-center space-x-2">
        <loader></loader>
        <span>{{ newStatus }}</span>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            status: String,
            webAppId: Number
        },

        data () {
            return {
                newStatus: null
            }
        },

        created () {
            this.newStatus = this.status
            let that = this

            window.Echo.private('webapp.' + this.webAppId).listen('.InstallRunCloudHub', data => {
                that.newStatus = data.status

                if (data.status === 'Completed' || data.status === 'Error') {
                    window.handleRedirect(window.location.href)
                }
            })
        },

        destroyed () {
            window.Echo.leave('webapp.' + this.webAppId)
        }
    }
</script>
