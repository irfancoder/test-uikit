<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th width="40px"></th>
                <th>Rule ID</th>
                <th>Action</th>
                <th>Field</th>
                <th>Operator</th>
                <th>Value</th>
                <th class="text-right"></th>
            </tr>
        </thead>
        <draggable v-model="firewallRules" handle=".rc-icon-handle" tag="tbody" v-if="firewallRules.length > 0" @change="sortRule">
            <tr v-for="(rule, index) in firewallRules" :class="[ !rule.is_enabled ? 'opacity-60' : 'opacity-100' ]" :key="index" :id="rule.id">
                <td><i class="rc rc-icon-handle rc-ln-hamburger rc-tb-icon"></i></td>
                <td>{{ rule.ruleId ? rule.ruleId : '-' }}</td>
                <td>{{ rule.operation }}</td>
                <td>{{ rule.field ?  rule.field : '-' }}</td>
                <td>{{ rule.operator ?  getOperatorName(rule.operator) : '-' }}</td>
                <td>{{ rule.value ?  rule.value : '-' }}</td>
                <td class="flex items center justify-end">
                    <form-switch
                        height='32'
                        name="enableRule"
                        model="form"
                        v-model="rule.is_enabled"
                        @input="toggleStatus(rule.id)"
                        class="mr-4">
                    </form-switch>

                    <div class="dropdown">
                        <a role="button"
                            class="dropdown-toggle btn btn-default icon-only"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            v-tooltip.top="'Edit, Delete'">
                            <i class="rc rc-ln-more"></i>
                        </a>
                        <ul class="w-48 dropdown-menu dropdown-menu-right" role="menu">
                            <li>
                                <a :href="`/servers/${serverId}/webapplications/${webApplicationId}/waf/${webApplicationFirewallId}/rule/${rule.id}/edit`" class="btn btn-primary btn-act"><i class="rc rc-ln-billing"></i><span>Edit</span></a>
                            </li>
                            <li>
                                <ajax-delete
                                    :url="`/servers/${serverId}/webapplications/${webApplicationId}/waf/${webApplicationFirewallId}/rule/${rule.id}/delete`"
                                    button-class="btn btn-danger btn-act"
                                    button-text="Delete"
                                    title="Delete Rule"
                                    text="Are you sure you want to proceed?"
                                    :input-type="null"
                                    analytic-category="Firewall Rule"
                                    analytic-action="Delete Firewall Rule">
                                </ajax-delete>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        </draggable>
        <tbody v-else>
            <tr><td colspan="6">You don't have any firewall rule configured yet.</td></tr>
        </tbody>
    </table>
</template>

<script>
    import FirewallRuleSet from '~/js//mixins/FirewallRuleSetMixin'
    import draggable from 'vuedraggable'

    export default {
        props: {
            serverId: Number,
            webApplicationId: Number,
            webApplicationFirewallId: Number,
            rules: Object,
            countries: Object,
            sortUrl: String
        },

        mixins: [FirewallRuleSet],

        components: {
            draggable
        },

        data () {
            return {
                firewallRules: this.rules.map(rule => ({...rule, is_enabled: !!rule.is_enabled}))
            }
        },

        methods: {
            getOperatorName (operator) {
                return this.operators[operator]
            },

            toggleStatus (id) {
                const url = `/servers/${this.serverId}/webapplications/${this.webApplicationId}/waf/${this.webApplicationFirewallId}/rule/${id}/status`
                const rule = this.firewallRules.find(rule => rule.id === id)

                if (rule) {
                    window.enterPage(url, { is_enabled: rule.is_enabled }, { method: 'post' }).catch(e => { })
                    this.analyticEvent('Firewall Rule', 'Update', rule.is_enabled ? 'Enabled Firewall Rule' : 'Disabled Firewall Rule')
                }

                // document.getElementsByName('enableRule')[0].disabled = true
                // setTimeout(function() {
                //     document.getElementsByName('enableRule')[0].disabled = false
                // }, 30000)
            },

            sortRule () {
                let rulesOrdering = []

                this.firewallRules.forEach(item => rulesOrdering.push(item.id))
                let data = {
                    rulesOrdering
                }

                window.enterPage(this.sortUrl, data, { method: 'post' }).then(response => {
                }).catch(e => { })
            }
        }
    }
</script>
