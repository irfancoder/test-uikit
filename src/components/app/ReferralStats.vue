<template>
    <div class="referral-stat">
        <div class="grid grid-cols-12 md:gap-7">
            <div class="panel panel-default col-span-12 md:col-span-6 2xl:col-span-4">
                <div class="panel-body">
                    <div class="flex justify-between">
                        <div>
                            <h5 class="font-semibold">User</h5>
                            <h1 class="text-4xl">{{ stats.totalSignups }} <span class="text-sm font-normal">Total Signup</span></h1>
                        </div>
                        <i class="rc rc-ln-user mr-7 text-blue-500 text-3xl"></i>
                    </div>

                    <hr class="mt-4">
                    <div class="pt-2">
                        <div class="flex items-center mb-1">
                            <h6 class="font-normal">Sign up this Month: </h6> 
                            <p class="text-black-500 ml-auto">{{ stats.currentMonthSignups }}</p>
                        </div>
                        <div class="flex items-center">
                            <h6 class="font-normal">Sign up Today: </h6> 
                            <p class="text-black-500 ml-auto">{{ stats.todaySignups }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel panel-default col-span-12 md:col-span-6 2xl:col-span-4">
                <div class="panel-body">
                    <div class="flex justify-between">
                        <div>
                            <h5 class="font-semibold">Credit</h5>
                            <h1 class="text-4xl">$ {{ stats.totalCashReward.toFixed(2) }} <span class="text-sm font-normal">Total Earned</span></h1>
                        </div>
                        <i class="rc rc-ln-billing mr-7 text-blue-500 text-3xl"></i>
                    </div>

                    <hr class="mt-4">
                    <div class="pt-2">
                        <div class="flex items-center mb-1">
                            <h6 class="font-normal">Claim: </h6> 
                            <p class="text-black-500 ml-auto">$ {{ stats.claimedRewards }}</p>
                        </div>
                        <div class="flex items-center">
                            <h6 class="font-normal">UnClaimed: </h6> 
                            <p class="text-black-500 ml-auto">
                                <universal-ajax
                                    v-if="!adminView && !fetching"
                                    button-type="button"
                                    button-text="Cash Out"
                                    button-class="btn btn-primary btn-xs mr-2"
                                    confirm-button-text="Request Cash Out"
                                    :url="cashOutUrl"
                                    method="post"
                                    title="Cash Out"
                                    text="<p>Your unclaimed rewards will be reset to $0.00 after you click Request Cash Out button. Cash out request will be processed not more than 7 days. You won't receive full cash out rewards bacause PayPal will take some for processing fees.</p>"
                                    analytic-category="Referral"
                                    analytic-action="cash out"
                                    @completed="completed()">
                                </universal-ajax>
                                $ {{ stats.unclaimedRewards.toFixed(2) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            cashOutUrl: String,
            adminView: { default: false, type: Boolean }
        },

        data () {
            return {
                fetching: true,
                stats: {}
            }
        },

        created () {
            this.fetch()
        },

        methods: {
            fetch () {
                window.enterPage(this.url).then(({ data }) => {
                    this.fetching = false
                    this.stats = data
                }).catch(() => {})
            },

            completed () {
                this.fetch()
                this.$emit('completed')
            }
        }
    }
</script>
