<template>
    <div class="subscription-wrapper">
        <div class="column-1">
            <div class="container">
                <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                        <slot name="top"></slot>

                        <h4>Switch payment provider</h4>

                        <p style="font-size: 16px; margin-top: 32px; margin-bottom: 24px" class="font-semibold"><span class="number">1</span> Subscription</p>

                        <div class="panel panel-default">
                            <div class="panel-body">
                                <div class="flex justify-content-between">
                                    <div>
                                        <h5 class="font-weight-bold">Current Server Plan</h5>
                                        <p>{{ currentPlan.description }}</p>
                                    </div>
                                    <div>
                                        <h4 style="padding: unset">USD {{  currentPlan.price }}</h4>
                                        <p class="text-right">/ {{ currentBillingCycle }}</p>
                                    </div>
                                </div>
                            </div>

                            <hr style="margin: unset">

                            <div class="panel-body">
                                <div class="flex justify-content-between">
                                    <div>
                                        <h5 class="font-weight-bold">Changing Server Plan?</h5>
                                        <p>Skip this step if you don't want to change plan</p>
                                        <br>
                                        <modal-base title="Server Management Plans" description="Simplifying Server Management For Everyone" modal-class="modal-dialog top-12 w-full md:w-8/12">
                                            <template #trigger="{ open }">
                                                <a @click.prevent="open" role="button">Compare Plans</a>
                                            </template>
                                            <template #form>
                                                <div class="modal-body max-h-80 md:max-h-screen-7/10 table-responsive">
                                                    <pricing-plan-comparison type="server">
                                                        <template #server-plan-comparison>
                                                            <slot name="server-plan-comparison"></slot>
                                                        </template>
                                                    </pricing-plan-comparison>
                                                </div>
                                            </template>
                                        </modal-base>
                                    </div>
                                    <div v-if="newPlan !== null">
                                        <div class="toggle">
                                            <span style="margin-right: 8px">Monthly</span>
                                            <toggle-button :value="showYearly" :sync="true" :height="24" :margin="4" :switch-color="'#151515'" :color="{ checked: '#e9edf0', unchecked: '#e9edf0' }" @change="changeBillingCycle"></toggle-button>
                                            <span style="margin-left: 8px">Yearly</span>
                                        </div>

                                        <h4 class="text-right" style="padding: unset">USD {{ parseInt(newPlan.price) }}</h4>
                                        <p class="text-right">/ {{ newBillingCycle }} </p>
                                    </div>
                                </div>
                                <div class="form-group" style="width: 240px; margin-bottom: 0">
                                    <label class="control-label" for="serverPlanSelection"></label>
                                    <select class="form-control selectpicker" data-live-search="true" v-model.number="selectedNewPlan">
                                        <option v-for="plan in displayedPlans" :value="plan.id" :key="plan.id">{{ `${plan.publicName} - USD ${plan.price}` }}</option>
                                    </select>
                                </div>
                            </div>

                            <hr style="margin: unset">

                            <div class="panel-body">
                                <div class="flex justify-content-between">
                                    <div class="table-responsive">
                                        <h5 style="margin-bottom: 20px;">Backup Plan</h5>
                                        <div class="alert alert-primary">
                                            <p>You are entitled to get <strong>FREE Backup Pro plan for 30 days</strong>.</p>
                                        </div>
                                        <table class="table table-hover table-borderless table-sm">
                                            <tbody>
                                                <tr colspan="2">
                                                    <td style="padding: 6px 0;">Current active backup file</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0;">Total Sites (web app &amp; database):</td>
                                                    <td style="padding: 6px 0;" class="text-right">{{ backup.totalSites }}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0;">Total Storage:</td>
                                                    <td style="padding: 6px 0;" class="text-right">{{ backup.totalStorage }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p>With the new backup system, one site can consist of a web app or database. Due to the new restructuring, all backup legacy data will be considered as separate sites.</p>
                                    </div>
                                </div>
                            </div>

                            <hr style="margin: unset">

                            <div class="panel-body">
                                <div class="flex justify-content-between">
                                    <div class="table-responsive">
                                        <h5 style="margin-bottom: 20px;">Credit Summary</h5>
                                        <table class="table table-hover table-borderless table-sm">
                                            <tbody>
                                                <tr>
                                                    <td style="padding: 6px 0;">Subscription Credit (unused time after <moment :time="time" type="date"></moment>):</td>
                                                    <td style="padding: 6px 0;" class="text-right">USD {{ credit.unusedTime.toFixed(2) }}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0;">Backup Credit:</td>
                                                    <td style="padding: 6px 0;" class="text-right">USD {{ credit.backup.toFixed(2) }}</td>
                                                </tr>
                                                <tr v-if="credit.pastDue > 0">
                                                    <td style="padding: 6px 0;">Past Due Amount:</td>
                                                    <td style="padding: 6px 0;" class="text-right">USD -{{ credit.pastDue.toFixed(2) }}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 6px 0;"><strong>Total credit to be transferred:</strong></td>
                                                    <td style="padding: 6px 0;" class="text-right"><strong>USD {{ credit.total.toFixed(2) }}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p>Your unused time for the existing paid server plan and backup credit will be transferred to Stripe credit. And your credit will be deducted if you have any past due amount. You can use this credit to subscribe server and backup plan in the new billing system.</p>
                                    </div>
                                </div>
                            </div>

                            <hr style="margin: unset">

                            <div class="panel-body">
                                <div class="flex justify-content-between">
                                    <div>
                                        <h4 style="padding: unset">Amount To Pay:</h4>
                                    </div>
                                    <div>
                                        <h4 style="padding: unset">USD {{ amountToPay > 0 ? amountToPay : '0.00' }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

<!--                        <modal-add-payment-method-->
<!--                            :store-url="addPaymentMethodUrl"-->
<!--                            :refetch="true"-->
<!--                            :countries="countries">-->
<!--                        </modal-add-payment-method>-->

                        <p style="font-size: 16px; margin-top: 32px; margin-bottom: 24px" class="font-semibold"><span class="number">2</span> Payment Method</p>

                        <div class="panel panel-default payment-method">
                            <div class="panel-body" style="padding-bottom: unset">
                                <div role="tab" class="panel panel-default panel-add-card">
<!--                                    <a data-toggle="modal" data-target="#modalAddNewPaymentMethod">-->
<!--                                        <div class="panel-body">-->
<!--                                            <div class="img-add-card"></div>-->
<!--                                            <span>Add a New Payment Method</span>-->
<!--                                        </div>-->
<!--                                    </a>-->
                                </div>

                                <template v-if="paymentMethods.length > 0">
                                    <hr>
                                    <loader v-if="isFetchingCard"></loader>
                                    <label v-else v-for="paymentMethod in paymentMethods" class="btn btn-block btn-checkbox" :class="{ active: paymentMethod.main }" @click="changePaymentMethod(paymentMethod)" :key="paymentMethod.id">
                                        <input type="radio" name="card">
                                        <img :src="paymentMethod.image" loading="lazy" alt="card-icon"/>
                                        <div>
                                            <p>{{ paymentMethod.type }}</p>
                                            <p>{{ paymentMethod.identifier }}</p>
                                        </div>
                                        <p v-if="paymentMethod.main" class="text-success default">Default</p>
                                    </label>
                                </template>
                            </div>
                        </div>

                        <div class="panel-default">
                            <div class="panel-body">
                                <div class="form-group text-center" style="margin-bottom: unset">
                                    <div class="checkbox checkbox-primary" style="margin-left: 24px; margin-top: 0; margin-bottom: 0">
                                        <input type="checkbox" id="migrationConsent" name="migrationConsent" required v-model="migrationConsent">
                                        <label for="migrationConsent">I hereby allow RunCloud to update and process my payment and subscription</label>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <button class="btn btn-default" @click="preConfirm" :disabled="isSubmitting">
                                    <spinner text="Switch Payment Provider" :working="isSubmitting"></spinner>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" tabindex="-1" id="modalPaymentMigration" role="dialog" data-toggle="modal" data-backdrop="static" ref="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" aria-label="Close" @click="closeModal">
                        <span aria-hidden="true">
                            <i class="rc rc-cross"></i>
                        </span>
                        </button>
                        <h4 class="modal-title">Switch Payment Provider Confirmation</h4>
                    </div>
                    <div class="modal-body">
                        <div>
                            <p>
                                You are about to switch your payment provider from Braintree to Stripe. Your current {{ currentPlan.name }} subscription will be stopped.
                            </p>
                            <p v-if="newPlan !== null">
                                New {{ newPlan.publicName }} subscription will be created with {{ newBillingCycle }} billing cycle starting from <strong>{{ now }}</strong> and you will be charged <strong>USD {{ amountToPay > 0 ? amountToPay : '0.00' }}</strong> today
                            </p>
                            <p v-if="amountToPay > 0">
                                If you do not want to get charged today, you can wait until the end of your current billing cycle before you switch your payment provider.
                            </p>
                        </div>
                        <br>
                        <button class="btn btn-default btn-block" @click="doMigration">Yes, please proceed to switch my payment provider now</button>
                        <br>
                        <div class="text-center">
                            <a href="javascript:void(0)" @click="closeModal">No, I will switch my payment provider later</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import StripeMixins from '~/js/mixins/StripeMixins'
    import $ from 'jquery'
    import moment from 'moment'

    export default {
        props: {
            currentPlan: Object,
            backup: Object,
            credit: Object,
            migrationUrl: String,
            availablePlansUrl: String,
            addPaymentMethodUrl: String,
            fetchPaymentMethodUrl: String,
            redirectUrl: String,
            countries: Object
        },

        mixins: [StripeMixins],

        data () {
            return {
                plans: {
                    monthly: [],
                    yearly: []
                },
                newPlan: null,
                displayedPlans: [],
                currentBillingCycle: '',
                newBillingCycle: '',
                selectedNewPlan: 0,
                paymentMethods: [],
                showYearly: false,
                isFetchingPlan: false,
                isFetchingCard: false,
                isSubmitting: false,
                migrationConsent: false,
                time: new Date(),
                stripe: Object,
                now: moment().format('DD MMMM YYYY')
            }
        },

        created() {
            this.stripe = window.Stripe(window.RunCloud.stripeKey)
            this.currentBillingCycle = this.currentPlan.monthOfValidity === 12 ? 'yearly' : 'monthly'
            this.newBillingCycle = this.currentBillingCycle
            this.showYearly = this.newBillingCycle === 'yearly'

            this.fetchAvailablePlans()
            this.fetchPaymentMethod()

            const that = this
            window.bus.$on('refetch', data => {
                that.fetchPaymentMethod()
            })
        },

        computed: {
            amountToPay() {
                if (this.newPlan === null) {
                    return 0
                }

                return (this.newPlan.price - this.credit.total).toFixed(2)
            }
        },

        updated () {
            $('.selectpicker').selectpicker('refresh')
        },

        methods: {
            closeModal() {
                window.$('#modalPaymentMigration').modal('hide')
            },

            changeBillingCycle (eventObject) {
                this.showYearly = eventObject.value
            },

            fetchAvailablePlans () {
                this.isFetchingPlan = true
                window.enterPage(this.availablePlansUrl, {}, { method: 'get' }).then(({ data }) => {
                    data.data.map(plan => {
                        this.plans[plan.billingCycle].push(plan)
                    })

                    this.displayedPlans = this.plans[this.newBillingCycle]
                    this.displayedPlans.map((plan) => {
                        if (parseInt(plan.price) === parseInt(this.currentPlan.price)) {
                            this.selectedNewPlan = plan.id
                        }
                    })
                }).catch(() => {

                }).finally(() => {
                    this.isFetchingPlan = false
                })
            },

            fetchPaymentMethod () {
                this.isFetchingCard = true
                window.enterPage(this.fetchPaymentMethodUrl).then(({ data }) => {
                    this.isFetchingCard = false
                    this.paymentMethods = data.map((item) => {
                        return {
                            ...item,
                            image: require(`img/credit-card/${window._.lowerCase(item.type).replace(/\s/g, '')}.svg`)
                        }
                    })
                }).catch(e => { })
            },

            preConfirm() {
                // if (this.paymentMethods.length === 0) {
                //     window.swal({
                //         title: 'Error',
                //         text: 'Please add at least 1 payment method',
                //         type: 'error'
                //     }).catch(window.swal.noop)

                //     return
                // }

                if (!this.migrationConsent) {
                    window.swal.fire({
                        title: 'Error',
                        text: 'Please tick the checkbox to agree to update and process your payment and subscription',
                        customClass: {
                            container: 'rc-swal',
                            confirmButton: 'swal2-delete'
                        }
                    }).catch(window.swal.noop)

                    return
                }

                window.$('#modalPaymentMigration').modal('show')
            },

            doMigration () {
                this.closeModal()
                this.isSubmitting = true

                // if (this.paymentMethods.length === 0) {
                //     window.swal({
                //         title: 'Error',
                //         text: 'Please add at least 1 payment method',
                //         type: 'error'
                //     }).catch(window.swal.noop)

                //     this.isSubmitting = false

                //     return
                // }

                if (!this.migrationConsent) {
                    window.swal.fire({
                        title: 'Error',
                        text: 'Please tick the checkbox to agree to update and process your payment and subscription',
                        customClass: {
                            container: 'rc-swal',
                            confirmButton: 'swal2-delete'
                        }
                    }).catch(window.swal.noop)

                    this.isSubmitting = false

                    return
                }

                const data = {
                    plan: this.selectedNewPlan
                }

                window.enterPage(this.migrationUrl, data, { method: 'post' })
                    .then(({ data }) => {
                        let payload = {
                            subscription: data,
                            paymentIntent: null
                        }

                        if (data.latest_invoice.payment_intent !== undefined) {
                            payload.paymentIntent = data.latest_invoice.payment_intent
                            if (payload.paymentIntent.last_payment_error !== null) {
                                const err = {
                                    isRedirect: true,
                                    error: {
                                        message: payload.paymentIntent.last_payment_error.message
                                    }
                                }

                                throw err
                            }
                        }

                        return payload
                    })
                    .then(this.handle3ds)
                    .then(this.handleRequirePaymentMethod)
                    .then(this.handleSubscriptionComplete)
                    .catch(e => {
                        if (e.hasOwnProperty('isRedirect') && e.isRedirect) {
                            const url = this.redirectUrl.replace('is_success_migration=1', 'is_success_migration=0')
                            window.handleRedirect(`${url}&message=${e.error.message}`, false)
                        } else if (e.error.message !== undefined) {
                            window.swal.fire({
                                title: 'Error',
                                text: e.error.message,
                                customClass: {
                                    container: 'rc-swal',
                                    confirmButton: 'swal2-delete'
                                }
                            }).catch(window.swal.noop)
                        } else {
                            window.swal.fire({
                                title: 'Error',
                                text: 'Unknown error while making subscription',
                                customClass: {
                                    container: 'rc-swal',
                                    confirmButton: 'swal2-delete'
                                }
                            }).catch(window.swal.noop)
                        }

                        this.isSubmitting = false
                    })
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
                            let url = `/settings/subscription/payment-methods/${paymentMethod.id}/make-default`

                            window.enterPage(url, {}, { method: 'post' }).then(response => {
                                self.analyticEvent('Payment Method', 'Click', 'Set as Default')
                                resolve(response.data)
                            }).catch(error => {
                                window.swal.fire({
                                    title: 'Error',
                                    text: error.response.data.message,
                                    customClass: {
                                        container: 'rc-swal',
                                        confirmButton: 'swal2-delete'
                                    }
                                })
                            })
                        })
                    }
                }).then(response => {
                    window.toastr.success(response.value.message)
                    self.fetchPaymentMethod()
                }).catch(window.swal.noop)
            }
        },

        watch: {
            selectedNewPlan: function (value) {
                const plan = window._.find(this.displayedPlans, {id: value})
                if (plan !== undefined) {
                    this.newPlan = plan
                } else {
                    this.newPlan = null
                }
            },
            showYearly: function (value) {
                this.displayedPlans = value ? this.plans.yearly : this.plans.monthly
                this.newBillingCycle = value ? 'yearly' : 'monthly'

                this.selectedNewPlan = window._.find(this.displayedPlans, {'publicName': this.newPlan.publicName}).id
            }
        }
    }
</script>
