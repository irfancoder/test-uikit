<template>
    <div class="table-responsive py-0">
        <div>
        <ul class="nav nav-tabs mx-7 mb-0" role="tablist">
            <li role="presentation" class="nav-item" v-for="(status, index) in parsedStatuses" :key="status">
                <a :href="`#${status}`" @click="switchTab(status)" :class="{ 'active': currentSelected === status }" role="tab" class="nav-link" data-toggle="tab" :aria-controls="index" aria-selected="true" style="text-transform: capitalize">{{ status }}</a>
            </li>
        </ul>
        <div class="tab-content" >
            <div role="tabpanel" :class="{'tab-pane': true, 'active': currentSelected === status, 'panel-table': true}" v-for="status in statuses" :key="status" :id="status">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>Subscriptions</th>
                        <th>{{ status !== 'incomplete' ? 'Products' : 'Scope' }}</th>
                        <th>Cost</th>
                        <th>Cycle</th>
                        <th>{{ status !== 'incomplete' ? 'Cancellation Date' : '' }}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody v-if="subscriptions[status].length">
                        <tr v-for="subscription in subscriptions[status]" :key="subscription.id">
                            <td>
                                <div class="d-inline-block">
                                    <a :href="`${subscriptionShowUrl.replace('=id=', subscription.id)}`">Subscription <moment type="date" :time="subscription.startDate"></moment> - <moment type="date" :time="subscription.endDate"></moment></a>
                                    <br>
                                    <span>{{ subscription.subscriptionId }}</span>
                                </div>
                            </td>
                            <td>
                                <ul class="list-disc" style="padding-left: 16px">
                                    <template v-if="status !== 'incomplete'">
                                        <li v-for="(product, index) in subscription.products" v-show="product" :key="index">
                                            <span v-if="index === 'server'">
                                                Server Management <strong>({{ product }})</strong>
                                            </span>
                                            <span v-if="index === 'backup'">
                                                Backup {{ product.indexOf("Sites") != -1 ? 'Pro ' : 'Basic ' }}<strong>({{ product }})</strong>
                                            </span>
                                            <span v-if="index === 'chat-support'">
                                                Chat Support <strong>({{ product }})</strong>
                                            </span>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li v-for="(scope, index) in subscription.scopes" :key="index">
                                           <span>{{ scope }}</span>
                                        </li>
                                    </template>
                                </ul>
                            </td>
                            <td>${{ subscription.totalPrice }}</td>
                            <td style="text-transform: capitalize">{{ subscription.billingCycle }}</td>
                            <td class="text-center">
                                {{ subscription.cancelAt }}
                            </td>
                            <td class="text-right">
                                <div class="dropdown" v-if="status === 'active'">
                                    <a role="button"
                                       class="dropdown-toggle btn btn-default icon-only"
                                       data-toggle="dropdown"
                                       aria-haspopup="true"
                                       aria-expanded="false"
                                       v-tooltip.top="'Summary, Edit, Cancel'">
                                        <i class="rc rc-ln-more"></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                        <li><a :href="`${subscriptionShowUrl.replace('=id=', subscription.id)}`" class="btn btn-primary btn-act"><i class="rc rc-ln-table"></i><span>Summary</span></a></li>
                                        <li><a :href="`${subscriptionEditUrl.replace('=id=', subscription.id)}`" class="btn btn-primary btn-act"><i class="rc rc-ln-pencil"></i><span>Edit</span></a></li>
                                        <li v-if="subscription.cancelAt === null">
                                            <universal-ajax
                                                :url="`${subscriptionToggleUrl.replace('=id=', subscription.id)}`"
                                                method="post"
                                                button-type="button"
                                                button-text="Cancel"
                                                button-class="btn-primary btn-act"
                                                button-icon="rc rc-ln-ban"
                                                confirm-button-text="Yes, cancel it"
                                                title="Cancel"
                                                text="Your subscription will continue to run until the end of the billing cycle. You can always resume your subscription before it is truly canceled."
                                                type="warning"
                                                action="delete"
                                                analytic-category="Subscription"
                                                analytic-action="Cancel subscription">
                                            </universal-ajax>
                                        </li>
                                        <li v-else>
                                            <universal-ajax
                                                :url="`${subscriptionToggleUrl.replace('=id=', subscription.id)}`"
                                                method="post"
                                                button-type="button"
                                                button-text="Resume"
                                                button-icon="rc rc-ln-box-caret-right"
                                                button-class="btn-primary btn-act"
                                                title="Resume Subscription"
                                                :text="resumeModalText(subscription)"
                                                confirm-button-text="Yes, resume my subscription"
                                                type="warning"
                                                analytic-category="Subscription"
                                                analytic-action="Resume subscription">
                                            </universal-ajax>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div v-if="status === 'incomplete'">
                                    <div v-if="waitForWebhook && isToday(subscription.createdAt)">
                                        <label class="label label-warning">Waiting for payment gateway to settle</label>
                                    </div>
                                    <div v-else>
                                        <universal-ajax
                                            :url="subscriptionToggleUrl.replace('=id=', subscription.id)"
                                            method="post"
                                            button-type="button"
                                            button-text="Cancel"
                                            confirm-button-text="Cancel Subscription"
                                            button-class="btn btn-danger"
                                            action="delete"
                                            title="Cancel Subscription"
                                            text="Your subscription will continue to run until the end of the billing cycle. You can always resume your subscription before it is truly canceled."
                                            type="warning"
                                            analytic-category="Subscription"
                                            analytic-action="Cancel subscription">
                                        </universal-ajax>
                                        <subscription-make-payment
                                            :url="subscriptionPayUrl.replace('=id=', subscription.id)"
                                            :redirect-url="subscriptionRedirectUrl">
                                        </subscription-make-payment>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                    <tr>
                        <td>Looks like you don't have anything here yet.</td>
                    </tr>
                    </tbody>
                </table>
                
            </div>
        </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        subscriptionShowUrl: String,
        subscriptionEditUrl: String,
        subscriptionToggleUrl: String,
        subscriptionByStatusUrl: String,
        subscriptionPayUrl: String,
        subscriptionRedirectUrl: String,
        waitForWebhook: Boolean
    },

    data() {
        return {
            statuses: ['incomplete', 'active', 'inactive', 'canceled'],
            currentSelected: 'incomplete',
            subscriptions: {
                active: [],
                inactive: [],
                canceled: [],
                incomplete: []
            }
        }
    },

    created () {
        this.fetchSubscriptions('incomplete').then(() => {
            if (!this.subscriptions.incomplete.length) {
                this.currentSelected = 'active'
                this.fetchSubscriptions(this.currentSelected)
            }
        })

        window.Echo.private(`users.${window.RunCloud.user}`).listen('.SubscriptionUpdated', res => {
            for (const status in this.subscriptions) {
                if (this.subscriptions.hasOwnProperty(status)) {
                    this.subscriptions[status] = this.subscriptions[status].filter(function (subscription) {
                        return subscription.subscriptionId !== res.subscriptionId
                    })
                }
            }

            this.subscriptions[res.status.toLowerCase()].unshift(res)
        })
    },

    computed: {
        parsedStatuses() {
            return this.subscriptions.incomplete.length ? this.statuses : this.statuses.filter(status => status !== 'incomplete')
        }
    },

    methods: {
        switchTab(status) {
            if (this.subscriptions[status].length === 0) {
                this.fetchSubscriptions(status)
            }
        },

        async fetchSubscriptions(status) {
            const url = this.subscriptionByStatusUrl.replace('=status=', status)
            await window.enterPage(url)
                .then(response => {
                    const { data: { data } } = response
                    this.subscriptions[status] = data
                    return data
                })
        },

        isToday(date) {
            const todayDate = new Date()
            const checkedDate = new Date(date)

            return todayDate.toDateString() === checkedDate.toDateString()
        },

        resumeModalText(subscription) {
            let moment = window.moment.utc(subscription.endDate).local()

            let resumeModalStr = subscription.resumeModalText.replace('=endDate=', moment.fromNow())
            return resumeModalStr
        }
    }
}
</script>

<style scoped>
ul.nav.nav-tab > li > a {
    text-transform: capitalize;
}
</style>
