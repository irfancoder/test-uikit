<template>
    <div>
        <form-radio
            v-if="disableSelection && domainType != 'redirect'"
            label="Domain Name"
            name="domainSelection"
            :model="model"
            v-model="model.domainSelection"
            radio-style="radio-inline"
            class="mb-4"
            :selection="{ 'runcloudDomain': 'Use test domain', 'customDomain': 'Use my own domain / subdomain' }">
        </form-radio>

        <form-input
            v-if="model.domainSelection === 'customDomain'"
            :label="(disableSelection && domainType != 'redirect') ? null : 'Domain Name'"
            :name="name"
            v-model="model[name]"
            :model="model"
            :placeholder="`e.g: ${domainExample}.com / subdomain.${domainExample}.com `"></form-input>

        <form-input-group
            v-else
            :name="name"
            :model="model"
            v-model="model.customName"
            placeholder=""
            :disabled="model.domainSelection !== 'runcloudDomain'"
            type="text"
            :append-value="appendDomain"
            v-tooltip.top="'This is a free domain name assigned to your server'">
        </form-input-group>

        <template v-if="canManageDomain">
            <template v-if="model.domainSelection != 'runcloudDomain'">
                <form-checkbox
                    label-alternative="Enable www for this domain / subdomain"
                    name="www"
                    :model="model"
                    v-model="model.www">
                </form-checkbox>

                <template v-if="model.www">
                    <form-select
                        label="Preferred Domain Version"
                        name="redirection"
                        :model="model"
                        v-model="model.redirection"
                        :selection="routeList">
                    </form-select>
                </template>

                <form-select
                    label="DNS Integration"
                    name="dnsProvider"
                    :model="model"
                    v-model="model.dnsProvider"
                    :selection="dnsIntegrationList">
                </form-select>

                <div class="alert alert-primary" v-if="model.dnsProvider === 'none' && model[name]">
                    <div class="flex flex-col">
                        <div>
                            <p> Please add the following DNS records to your DNS provider to enable this domain / subdomain.</p>
                        </div>
                        <div class="table-responsive">
                            <table v-if="model.dnsProvider === 'none' && model[name]" class="table table-hover">
                                <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Hostname</th>
                                    <th>Content</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>A</td>
                                    <td>{{ model[name] }}</td>
                                    <td>{{ ipAddress }}</td>
                                </tr>
                                <tr v-if="model.www && model[name]">
                                    <td>CNAME</td>
                                    <td>www.{{ model[name] }}</td>
                                    <td>{{ model[name] }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <template v-if="model.dnsProvider === 'cloudflare'">
                    <div class="alert alert-warning" v-show="!showDomainSelection">
                        <p>Native Cloudflare DNS integration is only available for Business plan user. <a href="/settings/subscription" class="font-weight-semibold ml-2" @click="analyticEvent('Upgrade Plan', 'Click', 'Add Domains')"> Upgrade now.</a></p>
                    </div>

                    <template v-if="showDomainSelection">
                        <form-select
                            label="Cloudflare API Key"
                            name="cfApiKeyId"
                            :model="model"
                            v-model="model.cfApiKeyId"
                            :selection="cloudflareApiKeys"
                            class="g1"
                            v-show="!_.isEmpty(cloudflareApiKeys)">
                        </form-select>

                        <div class="alert alert-warning" v-show="_.isEmpty(cloudflareApiKeys)">
                            <p>No Cloudflare API Key is available. <a href="/dns" class="font-weight-semibold">Add Cloudflare API Key.</a></p>
                        </div>

                    <template v-if="!_.isEmpty(cloudflareApiKeys)">
                            <template v-if="model.domainCf && model.cfApiKeyId && model[name]">
                                <div class="alert alert-success">
                                    <p>Yay! Found <strong>{{ model[name] }}</strong> under <strong>{{ cfAccount }}</strong>'s Cloudflare account.
                                    <br> The DNS record will be added/updated in this account automatically.</p>
                                </div>

                                <form-checkbox
                                    label="Allow DNS Integration"
                                    label-alternative="Yes, please add/update DNS Record of this domain to Cloudflare"
                                    name="updateCloudflare"
                                    :model="model"
                                    v-model="model.updateCloudflare">
                                </form-checkbox>
                            </template>

                            <template v-if="!model.domainCf && model[name] && model.cfApiKeyId && !loading">
                                <div class="alert alert-warning">
                                    <p>
                                        <strong>{{ model[name] }} </strong> is not found under this Cloudflare API key. <br><br>
                                        Please select Cloudflare account to add this domain to your Cloudflare. <br>
                                        You also need to setup the Cloudflare nameserver of this domain to make your domain active on Cloudflare.
                                    </p>
                                </div>

                                <form-select
                                    v-show="model.cfApiKeyId"
                                    label="Cloudflare Account Name"
                                    name="apiKey"
                                    :model="model"
                                    v-model="model.apiKey"
                                    :selection="cloudflareAccList"
                                    class="g1">
                                </form-select>

                                <form-checkbox
                                    label="Allow DNS Integration"
                                    label-alternative="Yes, please add this domain/subdomain to my Cloudflare account. I will setup the Cloudflare nameserver of this domain to my domain provider."
                                    name="updateCloudflare"
                                    :model="model"
                                    v-model="model.updateCloudflare">
                                </form-checkbox>
                            </template>
                        </template>
                    </template>
                </template>
            </template>
        </template>
        <template v-else>
            <div class="alert alert-default">
                <p>Upgrade to a paid plan to enable the www version and choose the preferred domain variation (non-www/www) automatically in your domain. <a href="/settings/subscription" @click="analyticEvent('Upgrade Plan', 'Click', 'Add Domains')">Upgrade now.</a></p>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        props: {
            disableSelection: Boolean,
            name: String,
            model: { required: true },
            domainSelection: { required: true },
            appendDomain: { type: String, required: true },
            accounts: Array,
            ipAddress: { required: true },
            showDomainSelection: { type: Boolean, required: true },
            canManageDomain: { required: true, type: Boolean },
            cfApiKeys: Array,
            dnsZoneCheckerUrl: String,
            domainType: { type: String, default: 'alias' }
        },

        computed: {
            domainExample() {
                return _.get(this.model, 'name') || 'example'
            },

            domainModelName() {
                return this.model[this.name]
            }
        },

        data() {
            return {
                RunCloud: {},
                isWildcard: false,
                isWww: false,
                routeList: {
                    'www': 'www (enable non-www → www redirection)',
                    'non-www': 'non-www (enable www → non-www redirection)',
                    'none': 'Do not set a preferred domain version'
                },
                dnsIntegrationList: {
                    'none': 'None - I will setup DNS records manually',
                    'cloudflare': 'Cloudflare'
                },
                cloudflareAccList: {},
                cloudflareApiKeys: {},
                roleName: '',
                loading: false
            }
        },

        mounted() {
            if (this.cfApiKeys.length !== 0) {
                _.forEach(this.cfApiKeys, (apiKey) => {
                    this.cloudflareApiKeys[apiKey.id] = apiKey.label
                })
            }
        },

        watch: {
            'model.www': function (val) {
                if (!val) {
                    this.model.redirection = 'none'
                } else {
                    this.model.redirection = 'non-www'
                }
            },
            'model.dnsProvider': function (val) {
                // this.hideSubmitBtn = false
                if (val === 'cloudflare') {
                    this.model.updateCloudflare = false
                    // if (!this.permission || this.emptyApiKey) {
                    //     this.hideSubmitBtn = true
                    // }
                } else {
                    this.model.updateCloudflare = true
                    this.model.cfApiKeyId = null
                    this.model.apiKey = null
                }
            },

            domainModelName: function (val) {
                if (val) {
                    if (val.match(/^w{3}\./)) {
                        this.isWildcard = false
                        this.isWww = true
                    } else if (val.match(/^\*\./)) {
                        this.isWildcard = true
                        this.isWww = false
                    } else {
                        this.isWildcard = false
                        this.isWww = false
                    }

                    this.loading = true
                    this.getDnsZone()
                }
            },

            'model.cfApiKeyId': function (val) {
                this.loading = true
                this.getDnsZone()
            }
        },

        methods: {
            getDnsZone: window._.debounce(function () {
                this.model.domainCf = false
                this.cfAccount = ''
                this.model.apiKey = null
                this.cloudflareAccList = {}
                if (this.model.dnsProvider === 'cloudflare' && this.model.cfApiKeyId && this.model[this.name]) {
                    window.enterPage(this.dnsZoneCheckerUrl, { name: this.model[this.name], apiKey: this.model.cfApiKeyId }).then((data) => {
                        this.loading = false

                        if (data) {
                            const res = data.data
                            if (res.zone) {
                                this.model.domainCf = true
                                this.cfAccount = res.zone.account.name
                                this.model.apiKey = this.model.cfApiKeyId + ':' + res.zone.account.id
                            } else if (res.accounts) {
                                this.cloudflareAccList = res.accounts
                            }
                        }
                    }).catch(e => {
                        if (e.response.status === 422) {

                        }
                        this.loading = false
                    })
                } else {
                    this.loading = false
                }
            }, 500)
        }
    }
</script>
