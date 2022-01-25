<template>
    <span :class="[iconClass]" class="pr-2"></span>
</template>

<script>
    export default {
        props: {
            provider: { required: true, type: String }
        },

        data: () => ({
            iconClass: null
        }),

        created () {
            if (this.provider === 'custom') {
                this.iconClass = 'rc rc-br-github'
            } else if (this.provider === 'selfhostedgitlab') {
                this.iconClass = 'rc rc-br-gitlab'
            } else {
                this.iconClass = `rc rc-br-${this.provider}`
            }
        }
    }
</script>
