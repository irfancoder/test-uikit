<template>
    <div></div>
</template>

<script>
export default {
    props: {
        user: { required: true, type: Object }
    },

    data () {
        return {
            initData: {
                ...this.user,
                token: 'e45ebd7c-f182-4a0f-8557-082003549b5a',
                host: 'https://wchat.freshchat.com'
            }
        }
    },

    mounted () {
        this.run(() => this.initFreshChat())
    },

    methods: {
        initFreshChat () {
            window.fcWidget.init(this.initData)
        },

        run (func) {
            let d = document
            let id = 'freshchat-js-sdk'

            let fcJS
            if (d.getElementById(id)) {
                func()
                return
            }
            fcJS = d.createElement('script')
            fcJS.id = id
            fcJS.async = true

            // fcJS.setAttribute('data-turbolinks-track', 'reload')
            fcJS.src = 'https://wchat.freshchat.com/js/widget.js'
            fcJS.onload = func
            d.head.appendChild(fcJS)
        }
    }
}
</script>
