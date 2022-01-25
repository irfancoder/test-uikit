<template></template>

<script>
    export default {
        props: {
            projectId: Number,
            deploymentId: Number
        },

        created () {
            window.Echo.private('atomicproject.' + this.projectId).listen('.RefreshDeployment', data => {
                if (this.projectId === data.projectId) {
                    if (this.deploymentId === undefined) {
                        window.handleRedirect(window.location.href)
                    } else if (this.deploymentId === data.deploymentId) {
                        window.handleRedirect(window.location.href)
                    }
                }
            })
        },

        destroyed () {
            window.Echo.leave('atomicproject.' + this.projectId)
        }
    }
</script>
