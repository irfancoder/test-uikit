<template></template>

<script>
    export default {
        props: {
            redirectUrl: String
        },

        created () {
            window.Echo.private('servers.' + window.RunCloud.server).listen('.ServerSetToOnline', status => {
                if (status.server_id === window.RunCloud.server) {
                    window.handleRedirect(this.redirectUrl)
                }
            })
        }
    }
</script>
