<template>
    <div>
        <loader v-if="fetching" :show="true"></loader>
        <p v-else-if="result.type === 'prepping'">Please wait while we are preparing your account.</p>
        <p v-else-if="result.type === 'unknown'">Unknown error has occured. Please refresh this page or contact support if this problem occured more than an hour.</p>
        <div v-else-if="result.type === 'nosubscription'">
            <button @click="subscribe" class="btn btn-primary" :disabled="working">
                <button-loader text="Subscribe Newsletter" :working="working"></button-loader>
            </button>
        </div>
        <template v-else-if="result.type === 'success'">
            <table class="table table-hover table-stackable border-b mb-4 -mt-7">
                <tbody>
                    <tr>
                        <td>
                            <h6>Newsletter is currently enabled</h6>
                        </td>
                        <td>
                            <button @click="unsubscribe" class="btn btn-default" :disabled="working">
                                <button-loader text="Unsubscribe from our newsletter" :working="working"></button-loader>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <form @submit.prevent="submitForm(form, $event, 'Newsletter', 'Update', 'Update Subscription')" :action="updateUrl">
                <div class="form-group" :class="{ 'has-error': form.errors.has('subscription.*') }">
                    <label class="form-label">Newsletter subscription</label>
                    <div v-for="(ac, index) in result.available" class="checkbox checkbox-primary py-3" :key="index">
                        <input :id="index" type="checkbox" :key="index" :value="index" v-model="form.subscription">
                        <label :for="index" class="flex flex-col">
                            <h6>{{ index }}</h6>
                            <p>{{ ac }}</p>
                        </label>
                    </div>
                    <span v-if="form.errors.has('subscription.*')" v-text="form.errors.get('subscription.*')" class="help-block"></span>
                </div>

                <panel-footer class="justify-end">
                    <form-button :model="form" :disabled="working">
                        <button-loader text="Update" :working="working"></button-loader>
                    </form-button>
                </panel-footer>
            </form>
        </template>
    </div>
</template>

<script>
    import AjaxForm from '@/classes/AjaxForm'

    export default {
        props: {
            url: String,
            updateUrl: String,
            subscribeUrl: String,
            unsubscribeUrl: String
        },

        data () {
            return {
                fetching: true,
                working: false,
                result: {
                    type: null,
                    subscribing: {},
                    available: {}
                },
                form: new AjaxForm({
                    subscription: []
                })
            }
        },

        created () {
            this.fetch()
        },

        methods: {
            fetch () {
                window.enterPage(this.url).then(({data}) => {
                    this.result = data
                    this.fetching = false
                    for (let subscribing in data.subscribing) {
                        this.form.subscription.push(subscribing)
                    }
                }).catch(() => {})
            },

            subscribe () {
                this.working = true
                this.analyticEvent('Notifications', 'Subscribe', 'Subscribe Newsletter')
                window.enterPage(this.subscribeUrl, {}, { method: 'post', showAlert: true }).then(({data}) => {
                    this.working = false
                    this.fetching = true
                    this.fetch()
                }).catch(() => {
                    this.working = false
                })
            },

            unsubscribe () {
                this.working = true
                this.analyticEvent('Notifications', 'Unsubscribe', 'Unsubscribe Newsletter')
                window.enterPage(this.unsubscribeUrl, {}, { method: 'post', showAlert: true }).then(({data}) => {
                    this.working = false
                    this.fetching = true
                    this.fetch()
                }).catch(() => {
                    this.working = false
                })
            }
        }
    }
</script>
