<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading" v-if="currentView == 'none'">
                <h4 class="pull-left">Add Payment Method</h4>
                <div class="clearfix"></div>
                <p>Please choose the payment method you wish to add.</p>
            </div>
            <div class="panel-heading" v-else-if="currentView == 'card'">
                <h4 class="pull-left">Add Credit / Debit Card</h4>
                <button v-if="showChangeButton" class="btn btn-primary" @click="currentView = 'none'">Change Payment Method</button>
                <div class="clearfix"></div>
                <p>Register your credit card here. Your credit card details is handled by payment gateway and will not go through our servers (SAQ A PCI Compliant). To register a card, a $1 fee will be charged to avoid fraud. It will be refunded once the fraud check completed.</p>
            </div>
            <div class="panel-heading" v-else-if="currentView == 'PayPal'">
                <h4 class="pull-left">Add PayPal Account</h4>
                <button v-if="showChangeButton" class="btn btn-primary" @click="currentView = 'none'">Change Payment Method</button>
                <div class="clearfix"></div>
                <p>Register your PayPal here. Your PayPal password won't be running through our server as you will be authenticating directly with Braintree and PayPal.</p>
            </div>
            <div class="panel-body">
                <loader v-if="working"></loader>
                <p class="text-center"><br><span v-if="working" class="badge badge-dark" v-text="loadingStatus"></span></p>

                <div v-if="currentView == 'none' && !working" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <img src="~img/braintree-logo.png" loading="lazy" class="center-block img-responsive braintree-logo">
                </div>

                <div v-if="currentView == 'none' && !working">
                    <div @click="changeView('card')" class="text-center col-xs-12 col-sm-6 col-md-6 col-lg-6 selection">
                        <img src="~img/credit-card.svg" loading="lazy" alt="Credit Card Icon"/>
                        <span class="badge badge-dark">Credit / Debit Card</span>
                    </div>
                    <div @click="changeView('PayPal')" class="col-xs-12 col-sm-6 col-md-6 col-lg-6 selection text-center">
                        <img src="~img/credit-card/paypal.svg" loading="lazy" alt="PayPal"/>
                        <span class="label label-dark">Paypal</span>
                    </div>
                </div>

                <credit-card-form
                    v-if="currentView == 'card'"
                    @working="manageWorking"
                    @message="updateLoadingStatus"
                    :url="url"
                    :client-instance="clientInstance">
                </credit-card-form>
                <paypal-form
                    v-if="currentView == 'PayPal'"
                    @working="manageWorking"
                    @message="updateLoadingStatus"
                    :url="url"
                    :client-instance="clientInstance">
                </paypal-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String
        },

        data () {
            return {
                currentView: 'none',
                showChangeButton: true,
                working: false,
                loadingStatus: '',
                clientInstance: null,
                deviceData: null
            }
        },

        created () {
            this.initialize()
        },

        methods: {
            initialize () {
                this.working = true
                this.loadingStatus = 'Requesting authorization...'

                window.braintree.client.create({
                    authorization: window.RunCloud.braintreeToken
                }, (err, clientInstance) => {
                    this.working = false
                    if (err) {
                        // window.swal('Oopss!', 'Unknown error while authorizing with Payment Gateway', 'error')
                        window.swal.error('Oopss!', 'Unknown error while authorizing with payment gateway')
                    } else {
                        this.clientInstance = clientInstance
                    }
                })
            },

            changeView (view) {
                this.currentView = view
            },

            manageWorking (bool) {
                this.showChangeButton = !bool
                this.working = bool
            },

            updateLoadingStatus (status) {
                this.loadingStatus = status
            }
        }
    }
</script>

<style lang="scss" scoped>

    .braintree-logo {
        width: 20rem;
        margin-bottom: 3rem;
    }

    .selection {
        margin-top: 3rem;
        margin-bottom: 3rem;

        img,
        span {
            cursor: pointer;
        }

        img {
            width: 150px;
            height: auto;
            display: block;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 20px;
        }


        @media (min-width: 768px) {
            &:first-child {
                border-right: 2px solid #f2f6fa;
            }
        }


    }
</style>
