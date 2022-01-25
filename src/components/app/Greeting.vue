<template>
    <span>{{ greet }}</span>
</template>

<script>
export default {
    data () {
        return {
            greet: null
        }
    },

    mounted () {
        let m = window.moment()

        let g = null // return g

        if (!m || !m.isValid()) { return } // if we can't find a valid or filled moment, we return.

        let splitAfternoon = 12 // 24hr time to split the afternoon
        let splitEvening = 17 // 24hr time to split the evening
        let currentHour = parseFloat(m.format('HH'))

        if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
            g = 'afternoon'
        } else if (currentHour >= splitEvening) {
            g = 'evening'
        } else {
            g = 'morning'
        }

        this.greet = g
    }
}
</script>
