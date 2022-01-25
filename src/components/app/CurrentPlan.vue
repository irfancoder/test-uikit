<template>
    <table class="table table-hover">
        <thead>
        <tr>
            <th>Products</th>
            <th class="text-center">Status</th>
            <th class="text-center">Renewal Date</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(plan, key) in currentPlan" :key="key" v-if="![canSubscribeWorkspaceMember ? '' : 'workspace-member', canSubscribeChatSupport ? '' : 'chat-support'].includes(key)">
            <td>
                <p v-if="key === 'server'">Server Management</p>
                <p v-else-if="key === 'backup'">Backup Pro</p>
                <p v-else-if="key === 'backupBasic'">Backup Basic
                    <i class="rc rc-ln-info" style="margin-left: 4px; color: #4e5a65" v-tooltip:top="'Included in the paid Server Management plan'"></i>
                </p>
                <p v-else-if="key === 'chat-support'">Chat Support</p>
                <p v-else-if="key === 'workspace-member'">Workspace Members</p>
                <p v-else>{{ key }}</p>
                <p>
                    <strong>
                        <span v-if="roleName && key == 'server'">{{ roleName }}</span>
                        <span v-else>{{ plan['name'] }}</span>
                    </strong>
                </p>
            </td>
            <td class="text-center">
                <span class="badge badge-success" v-if="plan['status'] === 'active'">Active</span>
                <span class="badge badge-default text-black" v-else-if="plan['status'] === 'inactive'">Inactive</span>
            </td>
            <td class="text-center">
                <template v-if="plan['renewalDate']">
                    <p>
                        <strong><moment type="date" :time="plan['renewalDate']"></moment></strong>
                        <i v-if="plan['cancelDate']" class="rc rc-ln-info" style="margin-left: 4px; color: #4e5a65" v-tooltip:top="'You have canceled this subscription. You can still enjoy this plan until the end of billing cycle.'"></i>
                    </p>
                    <p>
                        (<moment type="fromnow" :time="plan['renewalDate']"></moment>)
                    </p>
                </template>
            </td>
            <td class="text-right">
                <div v-if="key !== 'backupBasic'">
                    <template v-if="(plan['name'] === 'Free') || plan['name'] === 'Trial'|| plan['status'] === 'inactive'">
                        <div class="dropdown" v-if="activeSubscriptions">
                            <a role="button" class="btn btn-success btn-helper btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span v-if="key == 'server'">Upgrade</span>
                                <span v-else>Subscribe</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                <li>
                                    <a class="btn btn-primary btn-act" :href="`${createSubscriptionUrl.replace('=plan=', key)}`">Create New Subscription</a>
                                </li>
                                <li v-for="subs in activeSubscriptions" :key="subs.id">
                                    <a class="btn btn-primary btn-act" :href="getEditByPlanUrl(subs['id'], key)">Add to&nbsp;{{ subs['firstProduct'] }} subscription</a>
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            <a class="btn btn-success btn-sm btn-helper" :href="`${createSubscriptionUrl.replace('=plan=', key)}`">
                                <span v-if="key == 'server'">Upgrade</span>
                                <span v-else>Subscribe</span>
                            </a>
                        </div>
                    </template>

                    <template v-else-if="plan['cancelDate']">
                        <universal-ajax
                            :url="`${resumePlanUrl.replace('=id=', plan['id'])}`"
                            method="post"
                            button-type="button"
                            button-text="Resume"
                            button-class="btn btn-success"
                            title="Resume Subscription"
                            :text="resumeModalText(plan['resumeModalText'], plan)"
                            confirm-button-text="Yes, resume my subscription"
                            type="warning"
                            analytic-category="Subscription"
                            analytic-action="Resume subscription">
                        </universal-ajax>
                    </template>

                    <template v-else-if="plan['id'] && plan['status'] === 'active'">
                        <a class="btn btn-default btn-sm btn-helper" :href="`${editPlanUrl.replace('=id=', plan['id'])}`">
                            Change Plan
                        </a>
                    </template>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        propCurrentPlan: Object,
        roleName: String,
        propActiveSubscriptions: Object,
        editPlanUrl: String,
        editByPlanUrl: String,
        createSubscriptionUrl: String,
        resumePlanUrl: String,
        canSubscribeChatSupport: { default: false, type: Boolean },
        canSubscribeWorkspaceMember: { default: false, type: Boolean }
    },

    data() {
        return {
            currentPlan: {},
            activeSubscriptions: null
        }
    },

    created () {
        this.currentPlan = JSON.parse(this.propCurrentPlan)
        this.activeSubscriptions = JSON.parse(this.propActiveSubscriptions)

        if (_.isArray(this.activeSubscriptions) && !this.activeSubscriptions.length) {
            this.activeSubscriptions = null
        }

        window.Echo.private(`users.${window.RunCloud.user}`)
            .listen('.CurrentServerPlan', data => {
                this.currentPlan.server.cancelDate = data.cancelDate
                this.currentPlan.server.id = data.id
                this.currentPlan.server.name = data.name
                this.currentPlan.server.renewalDate = data.renewalDate
                this.currentPlan.server.status = data.status

                if (data.name !== 'Free') {
                    this.currentPlan.backupBasic.cancelDate = data.cancelDate
                    this.currentPlan.backupBasic.status = data.status

                    if (this.currentPlan.backup.status === 'active') {
                        this.currentPlan.backupBasic.renewalDate = data.renewalDate
                    }
                } else {
                    this.currentPlan.backupBasic.cancelDate = null
                    this.currentPlan.backupBasic.renewalDate = null
                    this.currentPlan.backupBasic.status = 'inactive'
                }
            })
            .listen('.CurrentBackupPlan', data => {
                this.currentPlan.backup.id = data.id
                this.currentPlan.backup.cancelDate = data.cancelDate
                this.currentPlan.backup.name = data.name
                this.currentPlan.backup.renewalDate = data.renewalDate
                this.currentPlan.backup.status = data.status

                if (this.currentPlan.server.name !== 'Free') {
                    this.currentPlan.backupBasic.renewalDate = this.currentPlan.server.renewalDate
                }
            })
    },

    methods: {
        resumeModalText(modalText, plan) {
            let moment = window.moment.utc(plan['endDate']).local()

            let resumeModalStr = modalText.replace('=endDate=', moment.fromNow())
            return resumeModalStr
        },

        getEditByPlanUrl(id, key) {
            let url = this.editByPlanUrl.replace('=id=', id)
            url = url.replace('=plan=', key)

            return url
        }
    }
}
</script>

<style scoped>

</style>
