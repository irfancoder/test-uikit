<template>
    <div class="rc-wrapper">
        <div>
            <div class="payment-method">
                <div class="heading">
                    <h4>Select payment method</h4>
                </div>

                <div class="body">
                    <div role="tab" class="panel panel-default panel-add-card">
<!--                        <a data-toggle="modal" data-target="#modalAddNewPaymentMethod">-->
<!--                            <div class="panel-body">-->
<!--                                <div class="img-add-card"></div>-->
<!--                                <span>Add a New Payment Method</span>-->
<!--                            </div>-->
<!--                        </a>-->
                    </div>

<!--                    <modal-add-payment-method-->
<!--                        :store-url="addPaymentMethodLink"-->
<!--                        :refetch="true"-->
<!--                        :countries="countries">-->
<!--                    </modal-add-payment-method>-->

                    <loader v-if="fetchingCard"></loader>

                    <div class="card-selection" v-else>
                        <label v-for="(paymentMethod, index) in paymentMethods" :class="{ active: paymentMethod.default }" @click="changePaymentMethod(paymentMethod)" :key="index">
                            <input type="radio" name="card">
                            <img :src="paymentMethod.image" loading="lazy" alt="card-icon"/>
                            <div>
                                <p>{{ paymentMethod.type }}</p>
                                <p>{{ paymentMethod.identifier }}</p>
                            </div>
                            <p v-if="paymentMethod.default" class="text-success default">Default</p>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="payment-breakdown">
                <div class="heading">
                    <h4>{{ plan.name }}</h4>
                    <div>
                        <h1 class="price"><span class="dollar-sign">$</span>{{ plan.originalPrice }}</h1>
                        <p class="per">{{ plan.billingCycle }}</p>
                    </div>
                </div>
                <div v-if="isFree" class="body">
                    <p>
                        Your subscription <strong>will not be cancelled immediately</strong>. You will automatically be cancelled on the last day of your billing cycle. You can change your subscription back to your current plan before cancellation due date <strong>for free</strong>.
                    </p>

                    <form @submit.prevent="submit" role="form">
                        <div class="form-group agreement">
                            <div class="checkbox checkbox-primary">
                                <input type="checkbox" id="refundPolicy" name="refundPolicy" required>
                                <label for="refundPolicy">By downgrading my account, I agree that no refund will be issued.</label>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-danger btn-block">Cancel Subscription</button>
                    </form>
                </div>
                <div v-else class="body">
                    <div v-if="plan.price !== plan.originalPrice" class="alert alert-warning">
                        <p>Your plan includes a discount with <strong>{{ promotion.discount }}% off</strong>. You will be charged with this amount until <strong>{{ promotion.numberOfBillingCycle }} billing cycle(s).</strong></p>
                    </div>
                    <p>You’ll be charged <strong>${{ plan.originalPrice }}</strong> {{ plan.billingCycle }} until you cancel your subscription. Your payment data is encrypted and secure. All amounts shown are in USD.</p>

                    <p>Below is the payment breakdown:</p>

                    <loader v-if="fetchingPaymentBreakdown"></loader>
                    <div v-else>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th colspan="2">Payment Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Original Package Price</td>
                                    <td>${{ paymentBreakdown.originalPrice }}</td>
                                </tr>
                                <tr>
                                    <td>Price per Day</td>
                                    <td>${{ paymentBreakdown.pricePerDay }}</td>
                                </tr>
                                <tr>
                                    <td>Discount</td>
                                    <td>-${{ paymentBreakdown.promotion.discount }}</td>
                                </tr>
                                <tr>
                                    <td>Unused Balance</td>
                                    <td>-${{ paymentBreakdown.unusedBalance }}</td>
                                </tr>
                                <tr>
                                    <td>Unpaid Previous Charges</td>
                                    <td>+${{ paymentBreakdown.unpaidBalance }}</td>
                                </tr>
                                <tr>
                                    <td>Tax Amount</td>
                                    <td>+${{ paymentBreakdown.taxAmount }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Amount to be Paid</strong></td>
                                    <td><strong>${{ paymentBreakdown.payingPrice }}</strong></td>
                                </tr>
                            </tbody>
                        </table>

                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th colspan="2">Subscription Info</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Original days from package</td>
                                    <td>{{ paymentBreakdown.originalDaysFromPackage }} day(s)</td>
                                </tr>
                                <tr>
                                    <td>Days can be claimed</td>
                                    <td>{{ paymentBreakdown.daysCanBeClaim }} day(s)</td>
                                </tr>
                                <tr>
                                    <td>Days from referral program (<small>Will only be added if amount to be paid is >= ${{ paymentBreakdown.promotion.priceAfterDiscount }}</small>)</td>
                                    <td>{{ paymentBreakdown.remainingDays }} day(s)</td>
                                </tr>
                                <tr>
                                    <td>Days as referred user</td>
                                    <td>{{ paymentBreakdown.referralDays }} day(s)</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Period</strong></td>
                                    <td><strong>{{ paymentBreakdown.totalDays }} day(s)</strong></td>
                                </tr>
                                <tr>
                                    <td>Next Payment</td>
                                    <td><moment type="date" :time="paymentBreakdown.endDate"></moment></td>
                                </tr>
                            </tbody>
                        </table>

                        <form @submit.prevent="submit" role="form">
                            <div class="form-group agreement">
                                <div class="checkbox checkbox-primary">
                                    <input type="checkbox" id="nonRefundable" name="nonRefundable" required>
                                    <label for="nonRefundable">By clicking <strong>Pay Now</strong> button, you agree to our <a href="https://runcloud.io/legal/terms-of-service" alt="terms of service">Terms of Service</a> and <a href="https://runcloud.io/legal/refund-policy" alt="refund policy">Refund Policy</a>.</label>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block">Pay Now</button>

                            <p class="text-center secure"><i class="rc rc-glyph-lock text-success"></i> Secure credit card payment</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            plan: Object,
            promotion: Object,
            fetchPaymentMethodLink: String,
            addPaymentMethodLink: String,
            checkPriceLink: String,
            countries: Object,
            legacy: Boolean
        },

        data () {
            return {
                paymentMethods: [],
                fetchingCard: false,
                fetchingPaymentBreakdown: false,
                paymentBreakdown: {}
            }
        },

        computed: {
            isFree () {
                if (this.plan.name === 'Free') {
                    return true
                }

                return false
            }
        },

        created () {
            this.fetchPaymentMethod()
            if (!this.isFree) {
                this.fetchPaymentBreakdown()
            }

            let that = this

            window.bus.$on('refetch', data => {
                that.fetchPaymentMethod()
            })
        },

        methods: {
            fetchPaymentMethod () {
                this.fetchingCard = true
                window.enterPage(this.fetchPaymentMethodLink).then(({ data }) => {
                    this.fetchingCard = false
                    this.paymentMethods = data
                }).catch(e => { })
            },

            fetchPaymentBreakdown () {
                this.fetchingPaymentBreakdown = true
                let item = {
                    plan: this.plan.id
                }

                window.enterPage(this.checkPriceLink, item, { method: 'post' }).then(({ data }) => {
                    this.fetchingPaymentBreakdown = false
                    this.paymentBreakdown = data
                }).catch(e => { })
            },

            submit ($event) {
                this.$emit('make-payment', this.paymentBreakdown)
            },

            openTab () {
                let win = window.open(this.addPaymentMethodLink, '_blank')

                var timer = setInterval(() => {
                    if (win.closed) {
                        clearInterval(timer)
                        this.fetchPaymentMethod()
                    }
                }, 100)
            },

            changePaymentMethod (paymentMethod) {
                let self = this

                window.swal.fire({
                    title: 'Change Payment Method',
                    html: `If you set this <strong>${paymentMethod.type} (${paymentMethod.identifier})</strong> as your default payment method, we will charge this <strong>${paymentMethod.type}</strong> when you are subscribing to us. Continue making this <strong>${paymentMethod.type}</strong> as your default payment method?`,
                    customClass: {
                        container: 'rc-swal'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Change',
                    showLoaderOnConfirm: true,
                    preConfirm (value) {
                        return new Promise((resolve, reject) => {
                            let url = `/settings/subscription/steps/paymentmethods/${paymentMethod.id}/make-default`

                            if (self.legacy) {
                                url = `/settings/subscription/legacy/steps/paymentmethods/${paymentMethod.id}/make-default`
                            }

                            window.enterPage(url, {}, { method: 'post' }).then(response => {
                                self.analyticEvent('Payment Method', 'Click', 'Set as Default')
                                resolve(response)
                            }).catch(error => {
                                window.toastr.error(error.response.data.message, 'Oopss!')
                                // window.swal({
                                //     title: 'Error',
                                //     text: error.response.data.message,
                                //     type: 'error'
                                // })
                            })
                        })
                    }
                }).then(response => {
                    // window.notie.alert({ type: 'success', text: response.data.message, time: 2 })
                    window.toastr.success(response.data.message)
                    self.fetchPaymentMethod()
                }).catch(window.swal.noop)
            }
        }
    }
</script>
