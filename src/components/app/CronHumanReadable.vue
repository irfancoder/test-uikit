<template>
    <span>{{ cron | toHumanReadable }}</span>
</template>

<script>
    import cronstrue from 'cronstrue'

    export default {
        props: {
            cron: ''
        },

        filters: {
            toHumanReadable: function (value) {
                return cronstrue.toString(value)
            }
        }
    }
</script>
