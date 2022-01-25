<template>
    <span>{{ result }}</span>
</template>

<script>
    export default {
        props: {
            type: String,
            time: String,
            live: { type: Boolean, default: false },
            format: String
        },

        data () {
            return {
                result: null,
                intervalId: null
            }
        },

        watch: {
            time () {
                if (this.live) {
                    clearInterval(this.intervalId)
                    this.convertLive(this.time)
                } else {
                    this.convertTime(this.time)
                }
            }
        },

        created () {
            if (this.live) {
                this.convertLive(this.time)
            } else {
                this.convertTime(this.time)
            }
        },

        methods: {
            convertTime (time) {
                let moment = window.moment.utc(time).local()

                if (this.format !== undefined) {
                    this.result = moment.format(this.format)

                    return
                }

                if (this.type === 'date') {
                    this.result = moment.format('DD MMM YYYY')
                } else if (this.type === 'simpletime') {
                    this.result = moment.format('hh:mm a')
                } else if (this.type === 'time') {
                    this.result = moment.format('hh:mm:ss A')
                } else if (this.type === 'datetime') {
                    this.result = moment.format('DD MMMM YYYY (hh:mm:ss A)')
                } else if (this.type === 'fromnow') {
                    this.result = moment.fromNow()
                }
            },

            convertLive (time) {
                this.convertTime(time)
                this.intervalId = setInterval(() => {
                    this.convertTime(time)
                }, 1000)
            }
        }
    }
</script>
