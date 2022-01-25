<template>
    <div class="flex items-center justify-center">
        <loader v-if="_.toLower(status) === 'deploying'" class="mr-3"></loader>
        <label v-if="!status" class="px-2">-</label>
        <label v-else :class="`badge badge-${className}`">{{ _.startCase(_.toLower(status)) }}</label>
    </div>
    <!-- pending, deploying, completed, failed -->
</template>

<!-- eslint-disable -->
<script>
    export default {
        props: {
            status: { required: true, type: String }
        },

        computed: {
            className () {
                let sts = window._.toLower(this.status)

                if (sts === 'pending') { return 'warning' }
                if (sts === 'deploying') { return 'default' }
                if (sts === 'completed') { return 'success' }
                if (sts === 'failed') { return 'danger' }
            }
        }
    }
</script>
