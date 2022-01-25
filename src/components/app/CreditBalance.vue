<template>
    <span class="btn btn-primary" style="cursor: default">Current Credit: ${{ parseFloat(balance).toFixed(2) }}</span>
</template>

<script>
    export default {
        props: {
            defaultBalance: Number
        },

        data () {
            return {
                balance: null
            }
        },

        created () {
            this.balance = this.defaultBalance

            window.Echo.private('users.' + window.RunCloud.user).listen('.CreditWasTopUp', res => {
                this.balance = res.credit
            })
        }
    }
</script>
