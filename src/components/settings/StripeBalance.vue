<template>
    <div>
        <vue-content-loading v-if="working" :width="300" :height="24" :speed="1">
            <rect x="0" y="0" rx="2" ry="2" width="128" height="16" />
        </vue-content-loading>
        <h4 style="padding-top: unset" v-else>${{balance}}</h4>
    </div>
</template>

<script>
import { VueContentLoading } from 'vue-content-loading'

export default {
    props: {
        url: { default: '/settings/subscription/userbalance' }
    },

    components: {
        VueContentLoading
    },

    data () {
        return {
            working: true,
            balance: null
        }
    },

    created () {
        this.fetch()

        window.Echo.private('users.' + window.RunCloud.user).listen('.CreditWasTopUp', res => {
            this.balance = res.credit
        })
    },

    methods: {
        fetch () {
            setTimeout(() => {
                window.enterPage(this.url, {}, { method: 'get' }).then(({data}) => {
                    this.balance = data.balance
                    this.working = false
                })
            }, 500)
        }
    }
}
</script>
