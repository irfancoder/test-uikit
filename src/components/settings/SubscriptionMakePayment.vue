<template>
    <button class="btn btn-primary" :disabled="subscribing" @click="makePayment">
        <spinner text="Continue payment" :working="subscribing"></spinner>
    </button>
</template>

<script>
import StripeMixins from '~/js/mixins/StripeMixins'

export default {
    props: {
        url: {},
        redirectUrl: String
    },

    mixins: [StripeMixins],

    data () {
        return {
            working: false,
            subscribing: false,
            stripe: Object
        }
    },

    methods: {
        makePayment () {
            this.subscribing = true
            this.stripe = window.Stripe(window.RunCloud.stripeKey)

            window.enterPage(this.url, {}, { method: 'post' })
                .then(({data}) => {
                    let payload = {
                        subscription: data,
                        paymentIntent: null
                    }

                    if (data.latest_invoice.payment_intent !== undefined) {
                        payload.paymentIntent = data.latest_invoice.payment_intent
                    }

                    return payload
                })
                .then(this.handle3ds)
                .then(this.handleRequirePaymentMethod)
                .then(this.handleSubscriptionComplete)
                .catch(e => {
                    this.subscribing = false
                    if (e.error.message !== undefined) {
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
                })
        }
    }
}
</script>
