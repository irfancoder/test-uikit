<template>
    <div class="panel panel-default"> 
        <div class="panel-heading" style="margin-bottom: 0px;">
            <h4>Satisfaction Rating</h4>
        </div>
        <div class="panel-body pt-4">
            <div v-if="!submitted">
                    <p> {{ ticketIsClosed ? 'How satisfied are you with the support given by our agent?' : 'Don\'t forget to rate your experience with our support once the ticket is closed.' }}</p>
                    <br>
                    <div class="flex justify-center gap-4">
                        <form-card-selection label="Rating" 
                            class-name="border-0 flex justify-center"
                            name="rate" 
                            :model="form"
                            value="value"
                            cols="grid-cols-3"
                            align="justify-center"
                            :selection="ratings">

                            <template v-slot:custom="prop">
                                <div class="flex w-full items-center text-center justify-center" v-tooltip="prop.obj.title">
                                    <img :class="`h-16 w-16 ${ form.rate !== prop.obj.value && form.rate !== '' ? 'opacity-50' : ''}`" :src="prop.obj.icon"/>
                                </div>
                            </template>
                        </form-card-selection>
                    </div>
                
                    <div v-if="form.rate !== ''">
                    <form-textarea label="Feedback" name="feedback" :model="form" v-model="form.feedback" placeholder="How can we improve?"></form-textarea>
                    <hr class="pb-7">

                    <form-button :model="form" :disabled="form.feedback === ''" @click.native="submitFeedback" button-class="btn btn-primary w-full">
                        <button-loader text="Submit" :working="working" ></button-loader>
                    </form-button>
                </div>
            </div>

            <div v-else>
                <div class="flex justify-between items-center">
                <p><strong>Rating:</strong></p>
                <div class="flex items-center mb-0 space-x-2">
                    <span>{{ displayFeedback(currentOrPastFeedback).title }}</span>
                    <img class="h-8 w-8" :src="displayFeedback(currentOrPastFeedback).icon"/>
                    <!-- <i :class="displayFeedback(currentOrPastFeedback).icon" style="font-size: 2em"></i> -->
                </div>
                </div>
                <p><strong>Feedback:</strong></p>
                <p class="py-4">{{ form.feedback !== '' ?  form.feedback : pastFeedback.feedback }}</p>

                <hr>
                <p class="py-4">Thank you for your feedback! <br>We will try our best to serve you better next time.</p>
                <a @click.prevent="rateAgain" class="pt-7 cursor-pointer">Rate again?</a>
            </div>
        </div>
    </div>

</template>

<script>
import AjaxForm from '@/classes/AjaxForm'
export default {
    props: {
        ticket: Object,
        url: String,
        pastFeedback: { type: Object, default: null }
    },

    data () {
        return {
            submitted: false,
            working: false,
            form: new AjaxForm({
                rate: '',
                feedback: ''
            })
        }
    },

    mounted() {
        if (this.pastFeedback !== null) this.submitted = true
    },

    computed: {
        currentOrPastFeedback() {
            return this.form.rate !== '' ? this.form.rate : this.pastFeedback !== null ? this.pastFeedback.ratings.default_question : ''
        },

        ticketIsClosed() {
            return ['closed', 'resolved'].some(status => status === this.ticket.status)
        },

        ratings() {
            return [
                {
                    value: 103,
                    title: 'Satisfied',
                    icon: '/assets/img/em-satisfied.png',
                    disabled: !this.ticketIsClosed
                },
                {
                    value: 100,
                    title: 'Neutral',
                    icon: '/assets/img/em-neutral.png',
                    disabled: !this.ticketIsClosed
                },
                {
                    value: -103,
                    title: 'Dissatisfied',
                    icon: '/assets/img/em-dissatisfied.png',
                    disabled: !this.ticketIsClosed
                }
            ]
        }
    },

    methods: {
        submitFeedback () {
            let data = {
                'feedback': this.form.feedback,
                'ratings': {
                    'default_question': this.form.rate
                }
            }
            this.working = true

            window.enterPage(this.url, data, { method: 'post' }).then(() => {
                this.working = false
                this.submitted = true
                window.toastr.success('Feedback submitted!')
            }).catch(() => {
                this.working = false
            })
        },

        rateAgain() {
            this.form = new AjaxForm({
                rate: '',
                feedback: ''
            })
            this.submitted = false
        },

        displayFeedback(rateValue) {
            return this.ratings.find((val) => val.value === rateValue)
        }
    }
}
</script>