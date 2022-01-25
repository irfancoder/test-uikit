<template>
    <div class="subscription-wrapper">
        <div class="column-1">
            <div class="lg:mx-32 md:mx-20 px-4">
                <slot name="top"></slot>

                <template v-if="subscription">
                    <h4>Editing Subscription <moment type="date" :time="subscription.startDate"></moment> - <moment type="date" :time="subscription.endDate"></moment></h4>
                    <p>{{ subscription.subscription_id }}</p>
                </template>
                <template v-else>
                    <h4>Create Subscription</h4>
                </template>

                <p style="font-size: 16px; margin-top: 32px; margin-bottom: 24px" class="font-medium text-black-700"><span class="number">1</span> Customize plan</p>

                <div v-for="(plans, idx) in sections" :key="idx">
                    <p v-if="idx === 'suggestion'" style="font-size: 16px; margin-top: 32px; margin-bottom: 24px" class="font-medium">You might be interested in ...</p>
                    <p v-else-if="idx === 'current'" style="font-size: 16px; margin-top: 32px; margin-bottom: 24px" class="font-medium">Your existing subscription</p>

                    <div class="panel panel-default">
                        <div class="panel-body">
                            <div v-for="(plan, planIdx) in plans" :key="planIdx">
                                <template v-if="planIdx != 0">
                                    <br>
                                    <hr style="margin: unset">
                                    <br>
                                </template>
                                <template v-if="plan === 'server'">
                                    <div class="flex justify-between">
                                        <div>
                                            <h5 class="font-semibold">Server Management</h5>
                                            <p v-if="serverDetails.description !== ''">{{ serverDetails.description }}</p>
                                            <br>

                                            <!-- Modal Pricing Plan Server -->
                                            <modal-base title="Server Management Plans" description="Simplifying Server Management For Everyone" modal-class="modal-dialog top-8 w-full md:w-8/12">
                                                <template #trigger="{ open }">
                                                    <a @click.prevent="open" role="button">Compare Plans</a>
                                                </template>
                                                <template #form="{ close }">
                                                    <div class="modal-body max-h-120 2xl:max-h-210">
                                                        <pricing-plan-comparison type="server" :is-workspace="isWorkspace">
                                                            <template #server-plan-comparison>
                                                                <slot name="server-plan-comparison"></slot>
                                                            </template>
                                                        </pricing-plan-comparison>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button class="btn btn-default" @click.prevent="close">Close</button>
                                                    </div>
                                                </template>
                                            </modal-base>
                                        </div>
                                        <div>
                                            <h4 style="padding: unset">USD {{ serverDetails.price }}</h4>
                                            <p class="text-right">{{ selectedBillingCycle }}</p>
                                        </div>
                                    </div>
                                    <div class="form-group" style="width: 240px; margin-bottom: 0">
                                        <label class="control-label" for="serverPlanSelection"></label>
                                        <select class="form-control input-lg" data-live-search="true" v-model.number="serverPlanId">
                                            <option value="0" selected>Free</option>
                                            <option v-for="(plan, index) in displayedPlans.server" :value="plan.id" :key="index">{{ `${plan.publicName} - USD ${plan.price}` }}</option>
                                        </select>
                                    </div>
                                </template>

                                <template v-else-if="plan === 'backup'">
                                    <div class="flex justify-between">
                                        <div>
                                            <h5 class="font-semibold">Backup Pro</h5>
                                            <p v-if="backupDetails.description !== ''">{{ backupDetails.description }}</p>
                                            <br>

                                            <!-- Modal Pricing Plan Backup -->
                                            <modal-base title="Backup Plans" description="Stay protected with our incremental site backup plans, at an affordable price" modal-class="modal-dialog top-12 w-full md:w-8/12">
                                                <template #trigger="{ open }">
                                                    <a @click.prevent="open" role="button">Compare Plans</a>
                                                </template>
                                                <template #form>
                                                    <div class="modal-body max-h-120 2xl:max-h-210">
                                                        <pricing-plan-comparison type="backup"></pricing-plan-comparison>
                                                    </div>
                                                </template>
                                            </modal-base>
                                        </div>
                                        <div>
                                            <h4 style="padding: unset">USD {{ backupDetails.price }}</h4>
                                            <p class="text-right">{{ selectedBillingCycle }}</p>
                                        </div>
                                    </div>

                                    <br/>
                                    <table class="table table-hover table-vertical-middle table-fixed">
                                        <tbody>
                                        <tr>
                                            <td class="w-2/6">Backup Pro Site</td>
                                            <td class="w-3/6 text-right">
                                                <input type="number" min="0" @keydown="onlyNumbers($event)" max="500000" class="form-control input-lg" v-model.number="backupProQuantity">
                                            </td>
                                            <td class="text-right">
                                                <div class="whitespace-nowrap">USD {{ backupDetails.priceSite }}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="w-2/6">Backup Pro Storage</td>
                                            <td class="w-3/6">
                                                <div class="form-group" style="margin-bottom: 0">
                                                    <select class="form-control input-lg" data-live-search="true" v-model.number="backupStoragePlanId">
                                                        <option value="0">No storage</option>
                                                        <option v-for="(plan, index) in displayedPlans['backup-storage']" :value="plan.id" :key="index">{{ `${_.replace(plan.publicName, 'Backup Storage - ', '')} - USD ${plan.price}` }}</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td class="text-right">
                                                <div class="whitespace-nowrap">USD {{ backupDetails.priceStorage }}</div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </template>

                                <template v-else-if="plan === 'chat-support' && canSubscribeChatSupport">
                                    <div class="flex justify-between">
                                        <div>
                                            <h5 class="font-semibold">Chat Support</h5>
                                            <p v-if="chatSupportDetails.description !== ''">{{ chatSupportDetails.description }}</p>
                                            <br>
                                        </div>
                                        <div>
                                            <h4 style="padding: unset">USD {{ chatSupportDetails.price }}</h4>
                                            <p class="text-right">{{ selectedBillingCycle }}</p>
                                        </div>
                                    </div>
                                    <div class="form-group" style="width: 240px; margin-bottom: 0">
                                        <label class="control-label"></label>
                                        <select class="form-control input-lg" data-live-search="true" v-model.number="chatSupportPlanId">
                                            <option value="0" selected>Free</option>
                                            <option v-for="(plan, index) in displayedPlans['chat-support']" :value="plan.id" :key="index">{{ `${plan.publicName} - USD ${plan.price}` }}</option>
                                        </select>
                                    </div>
                                </template>

                                <template v-else-if="plan === 'workspace-member' && canSubscribeWorkspaceMember">
                                    <div class="flex justify-between">
                                        <div>
                                            <h5 class="font-semibold">Workspace</h5>
                                            <!-- <p>{{ backupDetails.description }}</p> -->
                                            <!-- <br> -->
                                            <!-- <a href="#" data-toggle="modal" data-target="#modalPricingPlanForBackup" role="button" type="button">Compare Plans</a> -->
                                        </div>
                                        <div>
                                            <h4 style="padding: unset">USD {{ workspaceMemberDetails.price }}</h4>
                                            <p class="text-right">{{ selectedBillingCycle }}</p>
                                        </div>
                                    </div>
                                    <br/>
                                    <table class="table table-hover table-vertical-middle table-fixed">
                                        <tbody>
                                        <tr>
                                            <td class="w-2/6">Workspace Member</td>
                                            <td class="w-3/6 text-right">
                                                <input type="number" min="0" @keydown="onlyNumbers($event)" max="500000" class="form-control input-lg" v-model.number="workspaceMemberQuantity">
                                            </td>
                                            <td class="text-right">
                                                <div class="whitespace-nowrap">USD {{ workspaceMemberDetails.price }}</div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <p style="font-size: 16px; margin-top: 32px; margin-bottom: 24px" class="font-medium text-black-700"><span class="number">2</span> Select payment method</p>

                <div class="panel panel-default payment-method">
                    <div class="panel-body" style="padding-bottom: unset">
                        <div role="tab" class="panel panel-default panel-add-card">
                            <modal-base title="Add a New Payment Method" label="Add a New Payment Method">
                                <template #trigger="{ open }">
                                    <a href="#" @click.prevent="open()">
                                        <div class="panel-body">
                                            <div class="img-add-card"></div>
                                            <span>Add a New Payment Method</span>
                                        </div>
                                    </a>
                                </template>

                                <template #form="{ close }">
                                    <add-payment-method-form
                                        :store-url="addPaymentMethodLink"
                                        :countries="countries"
                                        :refetch="true"
                                        :close="close"
                                        :analytics="{ page: 'payment methods', action: 'add new payment method' }">
                                    </add-payment-method-form>
                                </template>
                            </modal-base>
                        </div>

                        <template v-if="paymentMethods.length > 0">
                            <hr>
                            <br/>
                            <loader v-if="fetchingCard"></loader>
                            <div v-else>
                                <div class="grid grid-cols-1 gap-4">
                                    <div class="card-selection card-checkbox" :class="{ active: paymentMethod.main }" v-for="(paymentMethod, index) in paymentMethods" :key="index" @click="changePaymentMethod(paymentMethod)">
                                        <label class="h-16">
                                            <input type="radio" role="radio" aria-checked="true" name="card"/>
                                            <img :src="paymentMethod.image" loading="lazy" alt="card-icon"/>
                                            <div>
                                                <p class="inline">{{ paymentMethod.type }}</p>
                                                <span v-if="paymentMethod.main" class="text-blue-800 inlineya">(Default)</span>
                                                <p>{{ paymentMethod.identifier }}</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <br/>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="column-2 subscription-summary">
            <h4>Subscription Summary</h4>

            <div class="toggle">
                <span style="margin-right: 8px">Bill Monthly</span>
                <toggle-button :value="showYearly" :sync="true" :height="24" :margin="4" :switch-color="'#151515'" :color="{ checked: '#e9edf0', unchecked: '#e9edf0' }" @change="changeBillingCycle"></toggle-button>
                <span style="margin-left: 8px">Bill Yearly (Save 2 months)</span>
            </div>

            <br/>
            <hr style="margin-bottom: unset">

            <ul class="list-unstyled">
                <template v-if="subscriptionSummary.server.name || (subscriptionSummary.backupTotal !== 0 && (subscriptionSummary.backup.name || subscriptionSummary.backupStorage.name)) || subscriptionSummary.chatSupport.name || subscriptionSummary.workspaceMember.name">
                    <li v-if="subscriptionSummary.server.name !== ''">
                        <div class="flex justify-between">
                            <span class="font-semibold">Server Management</span>
                            <span>USD {{ subscriptionSummary.serverTotal }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-paragraph">{{ subscriptionSummary.server.name }}</span>
                        </div>
                    </li>
                    <li v-if="subscriptionSummary.backupTotal !== 0 && (subscriptionSummary.backup.name || subscriptionSummary.backupStorage.name)">
                        <div class="flex justify-between">
                            <span class="font-semibold">Backup Pro</span>
                            <span>USD {{ subscriptionSummary.backupTotal  }}</span>
                        </div>
                        <div class="flex justify-between text-paragraph" v-if="subscriptionSummary.backup.name !== ''">
                            <span>{{ subscriptionSummary.backup.name }}</span>
                            <span>USD {{ subscriptionSummary.backup.price }}</span>
                        </div>
                        <div class="flex justify-between text-paragraph" v-if="subscriptionSummary.backupStorage.name !== ''">
                            <span>{{ subscriptionSummary.backupStorage.name }}</span>
                            <span>USD {{ subscriptionSummary.backupStorage.price }}</span>
                        </div>
                    </li>
                    <li v-if="subscriptionSummary.chatSupport.name !== ''">
                        <div class="flex justify-between">
                            <span class="font-semibold">Chat Support</span>
                            <span>USD {{ subscriptionSummary.chatSupportTotal }}</span>
                        </div>
<!--                        <div class="flex justify-between">-->
<!--                            <span class="text-paragraph">{{ subscriptionSummary.chatSupport.name }}</span>-->
<!--                        </div>-->
                    </li>
                    <li v-if="subscriptionSummary.workspaceMember.name !== ''">
                        <div class="flex justify-between">
                            <span class="font-semibold">Workspace Member(s)</span>
                            <span>USD {{ subscriptionSummary.workspaceMemberTotal  }}</span>
                        </div>
                        <div class="flex justify-between text-paragraph">
                            <span>{{ workspaceMemberQuantity }} User(s)</span>
                            <span>USD {{ subscriptionSummary.workspaceMemberTotal  }}</span>
                        </div>
                    </li>
                    <li v-if="subscriptionSummary.otherItems.length">
                        <div class="flex justify-between">
                            <span class="font-semibold">Prorated Credit</span>
                            <span>USD {{ subscriptionSummary.othersTotal }}</span>
                        </div>
                        <div class="flex flex-row justify-between gap-x-2" v-for="(item, index) in subscriptionSummary.otherItems" :key="index">
                            <div>{{ item.description }}</div>
                            <div class="whitespace-nowrap">USD {{ item.price }}</div>
                        </div>
                    </li>
                    <li v-if="parseFloat(subscriptionSummary.availableCredit) !== parseFloat('0')">
                        <div class="flex justify-between">
                        <span class="font-semibold">
                            <span v-if="parseFloat(subscriptionSummary.availableCredit) < parseFloat('0')">Available Credit</span>
                            <span v-else>Past Due Amount</span>
                        </span>
                            <span>USD {{ subscriptionSummary.availableCredit }}</span>
                        </div>
                    </li>
                    <li v-if="parseFloat(subscriptionSummary.discountTotal) !== parseFloat('0')">
                        <div class="flex justify-between">
                            <span class="font-semibold">Discount</span>
                            <span>USD {{ subscriptionSummary.discountTotal }}</span>
                        </div>
                    </li>
                    <li>
                        <a role="button" :class="havePromoCode ? 'text-danger' : ''" @click="havePromoCode = !havePromoCode">{{ havePromoCode === false ? 'Add Promo Code' : 'Remove Promo Code'}}</a>
                        <div class="form-group" style="margin-bottom: unset" v-if="havePromoCode">
                            <div class="input-group">
                                <input type="text" v-model="promoCode" class="form-control" placeholder="Enter promo code"/>
                                <button class="flex-shrink-0 bg-blue-700 hover:bg-blue-800 border-4 text-white py-1 px-2 rounded" type="button" @click="checkPrice">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="flex justify-between">
                            <span class="font-semibold" style="font-size: 16px">Amount to Pay</span>
                            <span class="font-bold" style="font-size: 16px">USD {{ subscriptionSummary.amountDue }}</span>
                        </div>
                    </li>
                    <li>
                        <div class="form-group" style="margin-bottom: unset">
                            <div class="checkbox checkbox-primary ml-7 my-0">
                                <input type="checkbox" class="styled" id="nonRefundable" name="nonRefundable" required v-model="nonRefundable">
                                <label for="nonRefundable" v-html="labelNonRefundable" ></label>
                            </div>
                        </div>
                    </li>
                    <li>
                        <button class="btn btn-primary btn-block" :disabled="subscribing || !nonRefundable" @click="subscribe">
                            <button-loader text="Make Payment" :working="subscribing"></button-loader>
                        </button>
                    </li>
                </template>
                <template v-else>
                    <li>
                        <p>Please add a product to subscribe.</p>

                        <template v-if="subscription">
                            <p>Or, do you want to cancel your subscription?</p>
                        </template>
                    </li>
                    <template v-if="subscription">
                        <li>
                            <div class="form-group" style="margin-bottom: unset">
                                <div class="checkbox checkbox-primary ml-7 my-0">
                                    <input type="checkbox" class="styled" id="cancelSubscription" name="cancelSubscription" required v-model="cancelSubscription">
                                    <label for="cancelSubscription" v-html="labelCancelSubscription.replace('=cancelDate=', subscription.endDateFormatted)" ></label>
                                </div>
                            </div>
                        </li>
                        <li>
                            <button class="btn btn-danger btn-block" :disabled="canceling || !cancelSubscription" @click="cancelSubs">
                                Cancel Subscription
                            </button>
                        </li>
                    </template>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
    import StripeMixins from '~/js/mixins/StripeMixins'

    export default {
        props: {
            subscription: Object,
            items: Array,
            availablePlansUrl: String,
            updateUrl: String,
            subscribeUrl: String,
            checkPriceUrl: String,
            addPaymentMethodLink: String,
            fetchPaymentMethodLink: String,
            redirectUrl: String,
            countries: Object,
            sections: Array,
            subscriptionToggleUrl: String,
            canSubscribeChatSupport: { default: false, type: Boolean },
            canSubscribeWorkspaceMember: { default: false, type: Boolean },
            isWorkspace: { default: false, type: Boolean }
        },

        mixins: [StripeMixins],

        data () {
            return {
                showYearly: null,
                working: false,
                subscribing: false,
                canceling: false,
                checkingPrice: false,
                havePromoCode: false,
                promoCode: null,
                plans: {
                    server: {
                        monthly: [],
                        yearly: []
                    },
                    backup: {
                        monthly: [],
                        yearly: []
                    },
                    'backup-storage': {
                        monthly: [],
                        yearly: []
                    },
                    'chat-support': {
                        monthly: [],
                        yearly: []
                    },
                    'workspace-member': {
                        monthly: [],
                        yearly: []
                    }
                },
                displayedPlans: {
                    server: [],
                    backup: [],
                    'backup-storage': [],
                    'chat-support': [],
                    'workspace-member': []
                },
                selectedBillingCycle: null,
                selectedItems: [],
                selectedItemsPassData: [],
                priceData: null,
                stripe: Object,
                fetchingCard: false,
                backupProQuantity: 0,
                backupProPlanId: 0,
                backupStoragePlanId: 0,
                chatSupportPlanId: 0,
                workspaceMemberPlanId: 0,
                serverPlanId: 0,
                paymentMethods: [],
                nonRefundable: false,
                nonRefundableErrorLabel: false,
                cancelSubscription: false,
                labelNonRefundable: `<p for="nonRefundable">By clicking <strong>Make Payment</strong> button, you agree to our <a href="https://runcloud.io/legal/terms-of-service" alt="terms of service">Terms of Service</a> and <a href="https://runcloud.io/legal/refund-policy" alt="refund policy">Refund Policy</a>.</p>`,
                labelCancelSubscription: `<p for="cancelSubscription">By clicking <strong>Cancel Subscription</strong>, you will continue to enjoy your current subscription until the end of billing cycle (=cancelDate=).</p>`,
                workspaceMemberQuantity: 0
            }
        },

        computed: {
            isShowingFree () {
                return !(this.items !== undefined && this.items.every((item) => item.scope === 'server'))
            },

            serverDetails () {
                const server = {
                    description: '',
                    price: 0
                }
                const plan = this.getPlan(this.serverPlanId, 'server')

                if (plan !== undefined) {
                    server.price = parseInt(plan.price)
                    server.description = plan.description
                }

                return server
            },

            chatSupportDetails () {
                const chat = {
                    description: '',
                    price: 0
                }

                const plan = this.getPlan(this.chatSupportPlanId, 'chat-support')

                if (plan !== undefined) {
                    chat.price = parseInt(plan.price)
                    chat.description = plan.description
                }

                return chat
            },

            backupDetails () {
                const backup = {
                    description: '',
                    price: 0,
                    priceSite: 0,
                    priceStorage: 0
                }

                const backupProPlan = this.getBackupProPlan()

                if (backupProPlan !== undefined) {
                    backup.description = backupProPlan.description
                    backup.priceSite = (parseInt(backupProPlan.price) * this.backupProQuantity)
                    backup.price += backup.priceSite
                }

                const backupStoragePlan = this.getPlan(this.backupStoragePlanId, 'backup-storage')
                if (backupStoragePlan !== undefined) {
                    backup.priceStorage = parseInt(backupStoragePlan.price)
                    backup.price += backup.priceStorage
                }

                return backup
            },

            workspaceMemberDetails () {
                const workspaceMember = {
                    price: 0
                }

                const workspaceMemberPlan = this.getWorkspaceMemberPlan()
                if (workspaceMemberPlan !== undefined) {
                    workspaceMember.price += parseInt(workspaceMemberPlan.price) * this.workspaceMemberQuantity
                }

                return workspaceMember
            },

            subscriptionSummary () {
                const summary = {
                    server: {
                        name: '',
                        price: 0
                    },
                    backup: {
                        name: '',
                        price: 0
                    },
                    backupStorage: {
                        name: '',
                        price: 0
                    },
                    chatSupport: {
                        name: '',
                        price: 0
                    },
                    workspaceMember: {
                        name: '',
                        price: 0
                    },
                    otherItems: [],
                    serverTotal: 0,
                    backupTotal: 0,
                    workspaceMemberTotal: 0,
                    othersTotal: 0,
                    discountTotal: 0,
                    total: 0,
                    availableCredit: 0,
                    amountDue: 0
                }

                if (this.priceData !== null) {
                    const server = window._.find(this.priceData.items, ['scope', 'server'])
                    if (server !== undefined) {
                        summary.server = server
                    }

                    const backup = window._.find(this.priceData.items, ['scope', 'backup'])
                    if (backup !== undefined) {
                        summary.backup = backup
                        summary.backup.name = `${this.backupProQuantity} Sites`
                    }

                    const backupStorage = window._.find(this.priceData.items, ['scope', 'backup-storage'])
                    if (backupStorage !== undefined) {
                        const backupStorageObj = window._.find(this.displayedPlans['backup-storage'], {'id': this.backupStoragePlanId})
                        let backupStorageName = _.replace(backupStorageObj.publicName, 'Backup Storage - ', '')
                        summary.backupStorage = backupStorage
                        summary.backupStorage.name = `${backupStorageName} Storage`
                    }

                    const chatSupport = window._.find(this.priceData.items, ['scope', 'chat-support'])
                    if (chatSupport !== undefined) {
                        summary.chatSupport = chatSupport
                    }

                    const workspaceMember = window._.find(this.priceData.items, ['scope', 'workspace-member'])
                    if (workspaceMember !== undefined) {
                        summary.workspaceMember = workspaceMember
                        summary.workspaceMember.name = `Workspace Member`
                    }

                    if (this.priceData.otherItems.length) {
                        this.priceData.otherItems.map(item => {
                            summary.otherItems.push(item)
                            summary.othersTotal += item.price
                        })
                    }

                    summary.serverTotal = this.priceData.totalBreakdown.server
                    summary.backupTotal = this.priceData.totalBreakdown.backup
                    summary.chatSupportTotal = this.priceData.totalBreakdown.chatSupport
                    summary.workspaceMemberTotal = this.priceData.totalBreakdown.workspaceMember
                    summary.othersTotal = this.priceData.totalBreakdown.others
                    summary.discountTotal = this.priceData.totalBreakdown.discount
                    summary.availableCredit = this.priceData.totalBreakdown.availableCredit
                    summary.amountDue = this.priceData.totalBreakdown.amountDue
                }

                return summary
            }
        },

        watch: {
            showYearly (value) {
                let currentServerPlan = null
                if (this.serverPlanId !== 0) {
                    currentServerPlan = window._.find(this.displayedPlans.server, {'id': this.serverPlanId})
                }

                let currentBackupStoragePlan = null
                if (this.backupStoragePlanId !== 0) {
                    currentBackupStoragePlan = window._.find(this.displayedPlans['backup-storage'], {'id': this.backupStoragePlanId})
                }

                let currentChatSupportPlan = null
                if (this.chatSupportPlanId !== 0) {
                    currentChatSupportPlan = window._.find(this.displayedPlans['chat-support'], {'id': this.chatSupportPlanId})
                }

                if (value) {
                    this.displayedPlans.server = this.plans.server.yearly
                    this.displayedPlans.backup = this.plans.backup.yearly
                    this.displayedPlans['backup-storage'] = this.plans['backup-storage'].yearly
                    this.displayedPlans['chat-support'] = this.plans['chat-support'].yearly
                    this.displayedPlans['workspace-member'] = this.plans['workspace-member'].yearly
                } else {
                    this.displayedPlans.server = this.plans.server.monthly
                    this.displayedPlans.backup = this.plans.backup.monthly
                    this.displayedPlans['backup-storage'] = this.plans['backup-storage'].monthly
                    this.displayedPlans['chat-support'] = this.plans['chat-support'].monthly
                    this.displayedPlans['workspace-member'] = this.plans['workspace-member'].monthly
                }

                if (currentServerPlan !== null) {
                    this.serverPlanId = window._.find(this.displayedPlans.server, {'publicName': currentServerPlan.publicName}).id
                }

                if (currentBackupStoragePlan !== null) {
                    this.backupStoragePlanId = window._.find(this.displayedPlans['backup-storage'], {'publicName': currentBackupStoragePlan.publicName}).id
                }

                if (currentChatSupportPlan !== null) {
                    this.chatSupportPlanId = window._.find(this.displayedPlans['chat-support'], {'publicName': currentChatSupportPlan.publicName}).id
                }

                this.backupProPlanId = this.getBackupProPlan().id
                this.workspaceMemberPlanId = this.getWorkspaceMemberPlan().id
            },

            serverPlanId (value) {
                if (parseInt(value) === 0) {
                    this.removeItem('server')
                } else {
                    this.addItem(value, 'server')
                }
            },

            chatSupportPlanId (value) {
                if (parseInt(value) === 0) {
                    this.removeItem('chat-support')
                } else {
                    this.addItem(value, 'chat-support')
                }
            },

            workspaceMemberPlanId (value) {
                if (parseInt(this.workspaceMemberQuantity) === 0) {
                    this.removeItem('workspace-member')
                } else {
                    this.addItem(value, 'workspace-member', this.workspaceMemberQuantity)
                }
            },

            workspaceMemberQuantity (value) {
                if (parseInt(value) === 0) {
                    this.removeItem('workspace-member')
                } else {
                    this.addItem(this.workspaceMemberPlanId, 'workspace-member', value)
                }
            },

            backupStoragePlanId (value) {
                if (parseInt(value) === 0) {
                    this.removeItem('backup-storage')
                } else {
                    this.addItem(value, 'backup-storage')
                }
            },

            backupProPlanId (value) {
                if (this.backupProQuantity === 0) {
                    this.removeItem('backup')
                } else {
                    this.addItem(value, 'backup', this.backupProQuantity)
                }
            },

            backupProQuantity (value) {
                if (parseInt(value) === 0) {
                    this.removeItem('backup')
                } else {
                    this.addItem(this.backupProPlanId, 'backup', value)
                }
            },

            havePromoCode (value) {
                if (value === false) {
                    this.promoCode = null
                    this.checkPrice()
                }
            },

            selectedItems: {
                deep: true,
                handler (val) {
                    let selectedItemsPassData = window._.chain(val).filter(o => {
                        return o.plan_id !== null
                    }).map(o => {
                        return { 'plan_id': o.plan_id, 'quantity': o.quantity, 'scope': o.scope }
                    }).value()

                    let diff = window._.difference(selectedItemsPassData, this.selectedItemsPassData)
                    if (diff.length > 0) {
                        this.selectedItemsPassData = selectedItemsPassData
                    } else {
                        this.priceData = null
                    }
                }
            },

            selectedItemsPassData: window._.debounce(function(val) {
                this.checkPrice()
            }, 300, { leading: false, trailing: true }),

            nonRefundable(value) {
                if (value === true) {
                    this.nonRefundableErrorLabel = false
                }
            }
        },

        created () {
            if (this.subscription !== undefined) {
                this.selectedBillingCycle = this.subscription.billingCycle
            } else {
                this.selectedBillingCycle = 'monthly'
            }

            this.stripe = window.Stripe(window.RunCloud.stripeKey)
            this.fetchPaymentMethod()
            this.fetchAvailablePlans()

            let that = this

            window.bus.$on('refetch', data => {
                that.fetchPaymentMethod()
            })
        },

        methods: {
            onlyNumbers (event) {
                /**
                 * Allow only numbers. For browsers that have poor HTML5 support. Eg. Firefox
                 */
                let charCode = (event.which) ? event.which : event.keyCode
                if ((charCode >= 48 && charCode <= 57) || charCode === 46 || charCode === 8) {
                    return true
                }
                event.preventDefault()
            },
            fetchAvailablePlans () {
                this.working = true
                window.enterPage(this.availablePlansUrl, {}, { method: 'get' }).then((response) => {
                    const { data: { data } } = response

                    data.map(plan => {
                        if (this.plans.hasOwnProperty(plan.scope) && this.plans[plan.scope].hasOwnProperty(plan.billingCycle)) {
                            this.plans[plan.scope][plan.billingCycle].push(plan)
                        }
                    })

                    this.showYearly = this.selectedBillingCycle === 'yearly'

                    if (this.showYearly) {
                        this.displayedPlans.server = this.plans.server.yearly
                        this.displayedPlans.backup = this.plans.backup.yearly
                        this.displayedPlans['backup-storage'] = this.plans['backup-storage'].yearly
                        this.displayedPlans['chat-support'] = this.plans['chat-support'].yearly
                        this.displayedPlans['workspace-member'] = this.plans['workspace-member'].yearly
                    } else {
                        this.displayedPlans.server = this.plans.server.monthly
                        this.displayedPlans.backup = this.plans.backup.monthly
                        this.displayedPlans['backup-storage'] = this.plans['backup-storage'].monthly
                        this.displayedPlans['chat-support'] = this.plans['chat-support'].monthly
                        this.displayedPlans['workspace-member'] = this.plans['workspace-member'].monthly
                    }

                    if (this.items !== undefined) {
                        this.items.map(item => {
                            if (item.scope === 'server') {
                                this.serverPlanId = item.plan_id
                            } else if (item.scope === 'backup') {
                                this.backupProPlanId = item.plan_id
                                this.backupProQuantity = item.quantity
                            } else if (item.scope === 'backup-storage') {
                                this.backupStoragePlanId = item.plan_id
                            } else if (item.scope === 'chat-support') {
                                this.chatSupportPlanId = item.plan_id
                            } else if (item.scope === 'workspace-member') {
                                this.workspaceMemberPlanId = item.plan_id
                                this.workspaceMemberQuantity = item.quantity
                            }
                        })
                    }

                    this.working = false
                }).catch(() => {
                    this.working = false
                })
            },

            fetchPaymentMethod () {
                this.fetchingCard = true
                window.enterPage(this.fetchPaymentMethodLink).then(({ data }) => {
                    this.fetchingCard = false
                    this.paymentMethods = data.map((item) => {
                        return {
                            ...item,
                            image: require(`img/credit-card/${window._.lowerCase(item.type).replace(/\s/g, '')}.svg`)
                        }
                    })
                }).catch(e => { })
            },

            addItem (id, scope, quantity = 1) {
                let temp = this.selectedItems.filter((plan) => {
                    return plan.scope !== scope
                })

                temp.push({
                    meta: null,
                    plan_id: id,
                    quantity: quantity,
                    scope: scope
                })

                this.selectedItems = [...new Set(temp)]
            },

            modifyItem (val, item) {
                item.plan_id = parseInt(val.plan_id)
                item.quantity = parseInt(val.quantity)
            },

            removeItem (scope) {
                this.selectedItems = window._.filter(this.selectedItems, o => {
                    return o.scope !== scope
                })
            },

            changeBillingCycle (eventObject) {
                this.showYearly = eventObject.value
                this.selectedBillingCycle = eventObject.value ? 'yearly' : 'monthly'
                this.priceData = null
            },

            getPlan (id, scope) {
                return window._.find(this.plans[scope][this.selectedBillingCycle], ['id', parseInt(id)])
            },

            getBackupProPlan () {
                return window._.head(this.plans['backup'][this.selectedBillingCycle])
            },

            getWorkspaceMemberPlan () {
                return window._.head(this.plans['workspace-member'][this.selectedBillingCycle])
            },

            makePaymentCheckList () {
                let hasServerPlan = false
                let hasBackupPlan = false
                let hasBackupStoragePlan = false
                let hasChatSupportPlan = false
                let hasWorkspaceMember = false

                if (!this.nonRefundable) {
                    this.nonRefundableErrorLabel = true
                    return false
                }

                if (this.selectedItemsPassData.length === 0) {
                    return false
                }

                // if (this.paymentMethods.length === 0) {
                //     window.swal.fire({
                //         title: 'Error',
                //         customClass: {
                //             container: 'rc-swal'
                //         },
                //         text: 'Please add at least 1 payment method',
                //         width: 400,
                //         confirmButtonText: 'Close'
                //     })
                //
                //     return false
                // }

                this.selectedItemsPassData.map((item) => {
                    if (item.scope === 'server') {
                        hasServerPlan = true
                    } else if (item.scope === 'backup') {
                        hasBackupPlan = true
                    } else if (item.scope === 'backup-storage') {
                        hasBackupStoragePlan = true
                    } else if (item.scope === 'chat-support') {
                        hasChatSupportPlan = true
                    } else if (item.scope === 'workspace-member') {
                        hasWorkspaceMember = true
                    }
                })

                if (this.selectedItemsPassData.length === 1 && hasServerPlan) {
                    return true
                }

                if (hasBackupPlan && hasBackupStoragePlan) {
                    return true
                }

                if (hasChatSupportPlan) {
                    return true
                }

                if (hasWorkspaceMember) {
                    return true
                }

                window.swal.fire({
                    title: 'Error',
                    text: 'Number of sites and backup storage are required for the subscription. Please choose any.',
                    customClass: {
                        container: 'rc-swal',
                        confirmButton: 'swal2-delete'
                    }
                }).catch(window.swal.noop)

                return false
            },

            subscribe() {
                this.subscribing = true
                if (!this.makePaymentCheckList()) {
                    this.subscribing = false
                    return
                }

                const url = this.subscription !== undefined ? this.updateUrl : this.subscribeUrl

                // get intent
                const mixpanelMetadata = {
                    backupProQuantity: this.backupProQuantity,
                    backupProPlanId: this.backupProPlanId,
                    backupStoragePlanId: this.backupStoragePlanId,
                    serverPlanId: this.serverPlanId,
                    billingCycle: this.selectedBillingCycle,
                    promoCode: this.promoCode,
                    amount: this.subscriptionSummary.amountDue
                }
                this.analyticEvent('Subscription', this.subscription ? 'Edit' : 'Add', (this.subscription ? 'Edit' : 'Add') + ' Subscription Plan', null, mixpanelMetadata)

                window.enterPage(url, { plans: this.selectedItemsPassData, promoCode: this.promoCode }, { method: 'post' })
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
                        if (e.hasOwnProperty('isRedirect') && e.isRedirect) {
                            const url = this.redirectUrl.replace('is_success_payment=1', 'is_success_payment=0')
                            window.handleRedirect(`${url}&message=${e.error.message}`, false)
                        } else if (e.error && e.error.message !== undefined) {
                            window.swal.fire({
                                title: 'Error',
                                text: e.error.message,
                                customClass: {
                                    container: 'rc-swal',
                                    confirmButton: 'swal2-delete'
                                }
                            }).catch(window.swal.noop)
                        } else if (e.response && e.response.data) {
                            this.displayError(e)
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
            },

            checkPrice() {
                if (this.selectedItemsPassData.length > 0) {
                    this.checkingPrice = true
                    this.subscribing = true

                    let payload = {
                        plans: this.selectedItemsPassData,
                        promoCode: this.promoCode
                    }

                    if (this.subscription !== undefined) {
                        payload.subscription = this.subscription.id
                    }

                    window.enterPage(this.checkPriceUrl, payload, { method: 'post' }).then(({ data }) => {
                        this.checkingPrice = false
                        this.subscribing = false
                        this.priceData = data

                        // console.log(data)
                    }).catch(e => {
                        this.displayError(e)
                        this.checkingPrice = false
                        this.subscribing = false
                    })
                } else {
                    this.priceData = null
                }
            },

            changePaymentMethod (paymentMethod) {
                let self = this

                window.swal.fire({
                    title: 'Change Payment Method',
                    html: `
                        <div>
                            <div class="alert alert-primary"><p>Please be aware that any service charges will be billed to the <strong>default payment method</strong></p></div>
                            <p>Confirm that you wish to change your default payment method to: <strong>${paymentMethod.type} (${paymentMethod.identifier})</strong>?</p>
                        </div>
                        `,
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
            },

            cancelSubs() {
                this.canceling = true

                window.enterPage(this.subscriptionToggleUrl, {}, { method: 'post' }).then(response => {
                    this.canceling = false

                    if (response.data.redirect !== undefined) {
                        window.handleRedirect(response.data.redirect)
                    }
                }).catch(() => {
                    this.canceling = false
                })
            },

            displayError(e) {
                if (e.response.data && e.response.data.errors) {
                    const errResponses = e.response.data.errors

                    window._.forEach(errResponses, (itemError, itemKey) => {
                        const displayErrorMsg = window._.replace(itemError, itemKey, 'quantity')
                        window.toastr.options.escapeHtml = false
                        window.toastr['error'](displayErrorMsg)
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .payment-method {
        .card-checkbox::after {
            content: '';
        }

        .panel-add-card {
            @apply bg-blue-700 cursor-pointer transition-all ease-in duration-200;

            .panel-body {
                padding: 0;
            }

            .img-add-card {
                background-image: url('~img/add-card.svg');
                width: 70px;
                height: 70px;
                background-repeat: no-repeat;
                background-size: cover;
                margin: auto;
                display: inline-block;
                vertical-align: middle;
            }

            span {
                color: white;
                font-weight: 600;
                font-size: 15px;
                margin-left: 20px;
            }

            &:hover {
                @apply bg-blue-800;
                margin-top: -2px;
            }
        }

        .card-checkbox {
            img {
                width: 50px;
            }

            p {
                margin-bottom: 0;

                &:last-child {
                    color: rgba(black, 0.7);
                }
            }

            .default {
                align-self: start;
                @apply text-right;
            }

            &:hover,
            &:focus {
                color: #2ecc71;
            }

            &.active {
                background-color: white;
                border-color: #2ecc71;
                color: black;
            }
        }

        .btn + .btn {
            margin: unset
        }
    }

    .subscription-wrapper {
        position: relative;
        @apply md:grid lg:grid-cols-3;

        h4 {
            font-size: 24px;
            font-weight: 700;
        }

        h5 {
            margin-top: 0;
            font-size: 16px;
            margin-bottom: 4px;
        }

        .panel {
            padding: unset;

            .panel-body {
                padding: 24px;
            }
        }

        .number {
            height: 32px;
            width: 32px;
            display: inline-block;
            text-align: center;
            @apply bg-black-100;
            border-radius: 100%;
            padding: 4px;
            font-weight: 600;
            margin-right: 8px;
        }

        .column-1 {
            padding-top: 56px;
            @apply md:bg-misc-500 md:min-h-screen lg:col-span-2;
        }

        .column-2 {
            padding: 56px 40px;
            @apply bg-white;
            min-height: 100vh;
        }
    }

    .subscription-summary {
        table {
            p {
                margin-bottom: 0;
            }
        }

        .toggle {
            padding-top: 16px;
        }

        ul > li {
            padding: 16px 0;

            div {
                padding: 4px 0;
            }

            ~ li {
                border-top: 1px solid;
                @apply border-black-100;
            }
        }
    }
</style>
