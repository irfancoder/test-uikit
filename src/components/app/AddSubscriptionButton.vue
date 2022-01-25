<template>
    <a v-if="canAddSubscription" :href="subscriptionCreateUrl" class="btn btn-success pull-right">Add Subscription</a>
</template>

<script>
export default {
    props: {
        subscriptionCreateUrl: String,
        propCanAddSubscription: Boolean
    },

    data() {
        return {
            canAddSubscription: false
        }
    },

    created () {
        this.canAddSubscription = this.propCanAddSubscription

        window.Echo.private(`users.${window.RunCloud.user}`).listen('.CanAddSubscription', res => {
            this.canAddSubscription = res.canAddSubscription
        })
    }
}
</script>

<style scoped>

</style>
