<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <panel-header title="Firewall">
                    <template #desc>
                       <p>
                            Enable and configure your web application firewall (WAF). Our WAF uses ModSecurity with <a href="https://owasp.org/www-project-modsecurity-core-rule-set/" target="_blank" rel="noreferrer">OWASP ModSecurity Core Rule Set.</a> This feature also
                            include GeoLite2 data developed by <a href="https://www.maxmind.com" target="_blank">MaxMind.</a> If you are using WordPress and want to use nG-Series firewall by
                            <a href="https://perishablepress.com/tag/ng/" target="_blank">PerishablePress</a>, it is available under <a :href="nginxConfigUrl">NGiNX Config menu</a> as an NGiNX drop in file.
                        </p>
                    </template>
                </panel-header>
            </div>
            <div class="panel-body">
                <web-app-firewall-form
                    :initial-url="updateUrl"
                    :initial-is-enabled="waf.is_enabled"
                    :initial-anomaly="waf.anomaly"
                    :initial-paranoia="waf.paranoia"
                    :initial-exclusion-rules="waf.rules_exclusion || []"
                    @isEnabled="toggleEnable"
                    ref="webAppFirewallForm">
                </web-app-firewall-form>
            </div>
        </div>

        <div v-if="isEnabled">
            <div class="panel panel-default" v-if="enableFirewallRule">
                <div class="panel-heading">
                    <panel-header title="Rules Modification">
                        <template #action>
                            <a :href="createUrl"
                                class="btn btn-primary">Add Firewall Rule</a>
                        </template>

                        <p slot="desc">Control incoming traffic to your zone by filtering requests based on location, IP address, user agent, URI, and more.</p>
                    </panel-header>
                </div>
                <div class="panel-table table-responsive">
                    <firewall-rule :server-id="serverId" :sort-url="sortUrl" :web-application-id="webApplicationId" :web-application-firewall-id="waf.id" :rules="waf.rules" :countries="countries" ref="firewallRule"></firewall-rule>
                </div>
            </div>
            <empty-state
                :image="bannerImage"
                title="Rules Modification"
                subtitle="Create and customize your own firewall rules. Control incoming traffic to your zone by filtering requests based on location, IP address, user agent, URI, and more. Upgrade to Business Plan to enjoy this feature."
                v-cloak
                v-else>
                <template #content>
                    <a :href="subscriptionUrl" role="button" class="btn btn-primary" @click="analyticEvent('Upgrade Plan', 'Click', 'Web App Firewall')">Upgrade to Business Plan</a>
                </template>
            </empty-state>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        serverId: { type: Number },
        updateUrl: { type: String },
        createUrl: { type: String },
        subscriptionUrl: { type: String },
        sortUrl: { type: String },
        nginxConfigUrl: { type: String },
        webApplicationId: { type: Number },
        waf: { type: Object, required: true },
        enableFirewallRule: { type: Boolean },
        countries: { type: Object },
        bannerImage: {},
        webserver: { type: String }
    },

    data() {
        return {
            isEnabled: this.waf.is_enabled ? 'true' : 'false'
        }
    },

    methods: {
        toggleEnable(val) {
            this.isEnabled = val
        }
    }
}
</script>
