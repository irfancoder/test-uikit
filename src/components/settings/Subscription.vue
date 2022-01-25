<template>
    <div>
        <div class="container">
            <div class="rc-heading">
                <h4 v-if="linkName === 'selectPlan'" class="section-title">Select plan that work for you</h4>
                <h4 v-if="linkName === 'subscriptionConfirmation'" class="section-title">Almost there</h4>
                <h4 v-if="linkName === 'makePayment'" class="section-title">Do not close this page</h4>

                <ul class="list-inline step pull-left">
                    <li :class="{ active: linkName === 'selectPlan' }">
                        <a role="button" @click="linkName = 'selectPlan'" :class="{ 'btn disabled': linkName === 'makePayment' }">1. Select a Plan</a>
                    </li>
                    <li :class="{ active: linkName === 'subscriptionConfirmation' }">
                        <a role="button" :class="{ 'btn disabled': linkName === 'makePayment' }">2. Confirm Subscription</a>
                    </li>
                    <li :class="{ active: linkName === 'makePayment' }">
                        <a role="button" :class="{ 'btn disabled': linkName === 'makePayment' }">3. Make Payment</a>
                    </li>
                </ul>

                <div v-if="linkName === 'selectPlan'" class="toggle pull-right">
                    <span>Monthly</span>
                    <toggle-button :value="showYearly" :sync="true" :color="{ checked: '#2ecc71', unchecked: '#2ecc71' }" @change="changeBillingCycle"></toggle-button>
                    <span>Yearly</span>
                </div>

                <div class="clearfix"></div>
            </div>


            <subscription-plan-selection
                v-if="linkName === 'selectPlan'"
                :plans="plans"
                :current-plan="currentPlan"
                :showYearly="showYearly"
                @plan-selected="changePlan"
                :promotion="promotion">
            </subscription-plan-selection>
            <subscription-confirmation
                v-else-if="linkName === 'subscriptionConfirmation'"
                :plan="selectedPlan"
                :promotion="promotion"
                :fetch-payment-method-link="fetchPaymentMethodLink"
                :add-payment-method-link="addPaymentMethodLink"
                :check-price-link="checkPriceLink"
                :countries="countries"
                :legacy="legacy"
                @make-payment="readyToMakePayment">
            </subscription-confirmation>
<!--            <subscription-payment-->
<!--                v-else-if="linkName === 'makePayment'" -->
<!--                :plan="selectedPlan"-->
<!--                :payment-breakdown="paymentBreakdown"-->
<!--                :legacy="legacy"-->
<!--                @payment-error="paymentError">-->
<!--            </subscription-payment>-->
        </div>

        <slot v-if="linkName === 'selectPlan'"></slot>
    </div>
</template>

<script>
    export default {
        props: {
            plansArray: Array,
            currentPlan: Number,
            promotion: Object,
            fetchPaymentMethodLink: String,
            addPaymentMethodLink: String,
            checkPriceLink: String,
            countries: Object,
            legacy: { default: false }
        },

        data () {
            return {
                showYearly: false,
                linkName: 'selectPlan',
                selectedPlan: {},
                paymentBreakdown: {}
            }
        },

        computed: {
            plans () {
                if (this.showYearly) {
                    return window._.filter(this.plansArray, o => {
                        return o.billingCycle === null || o.billingCycle === 'yearly'
                    })
                }

                return window._.filter(this.plansArray, o => {
                    return o.billingCycle === null || o.billingCycle === 'monthly'
                })
            }
        },

        methods: {
            changeBillingCycle ($event) {
                this.showYearly = $event.value
            },

            changePlan (plan) {
                this.selectedPlan = plan
                this.linkName = 'subscriptionConfirmation'
            },

            readyToMakePayment (paymentBreakdown) {
                this.linkName = 'makePayment'
                this.paymentBreakdown = paymentBreakdown
            },

            paymentError () {
                this.linkName = 'subscriptionConfirmation'
            }
        }
    }
</script>
