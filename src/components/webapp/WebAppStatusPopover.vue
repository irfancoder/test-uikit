<template>
    <div class="relative cursor-pointer flex flex-row justify-center items-center" @mouseover="mouseEnter()" @mouseleave="mouseLeave()">
        <i class="rc rc-ln-window-dev rc-tb-icon" v-if="webapp.stackMode === 'development'"></i>
        <i class="rc rc-ln-copy rc-tb-icon" v-if="webapp.staging !== null"></i>
        <template v-if="webapp.extra !== null">
            <i class="rc rc-ln-padlock-lock rc-tb-icon" v-if="webapp.extra.httpAuth"></i>
        </template>
        <i class="rc rc-ln-conversion rc-tb-icon" v-if="webapp.setting.proxyProtocol"></i>
        <i class="rc rc-ln-at-sign rc-tb-icon" v-if="webapp.alias !== null"></i>
        <i :class="`rc ${getSslStatusPack.icon} rc-ssl-icon`" v-if="webapp.primaryDomain.ssl !== null || webapp.ssl !== null"></i>
        <i class="rc rc-ln-flag rc-tb-icon" v-if="webapp.defaultApp"></i>
        <template v-if="showPopover">
            <div class="w-80 absolute top-0 mt-8 left-0 right-0 rounded shadow border border-solid bg-white z-50 p-4 px-7 transition-all duration-75 text-left" :class="{ 'hidden': !showPopover }">
                <!-- <h4 class="font-semibold pb-4">Status</h4> -->
                <ul class="space-y-4">
                    <li class="flex" v-if="webapp.stackMode === 'development'">
                        <i class="rc rc-ln-window-dev rc-tb-icon" style="font-size:24px"></i>
                        <div>
                            <h6>Development</h6>
                            <p>Cache is disabled</p>
                        </div>
                    </li>
                    <li class="flex" v-if="webapp.staging !== null">
                        <i class="rc rc-ln-copy rc-tb-icon" style="font-size:24px"></i>
                        <div>
                            <h6>Staging</h6>
                            <p>Cache is disabled</p>
                        </div>
                    </li>
                    <template v-if="webapp.extra !== null">
                        <li class="flex" v-if="webapp.extra.httpAuth">
                            <i class="rc rc-ln-padlock-lock rc-tb-icon" style="font-size:24px"></i>
                            <div>
                                <h6>Password Protected</h6>
                                <p>Site is protected by HTTP Auth</p>
                            </div>
                        </li>
                    </template>
                    <li class="flex" v-if="webapp.setting.proxyProtocol">
                        <i class="rc rc-ln-conversion rc-tb-icon" style="font-size:24px"></i>
                        <div>
                            <h6>PROXY Protocol</h6>
                            <p>PROXY protocol is enabled</p>
                        </div>
                    </li>
                    <li class="flex" v-if="webapp.alias !== null">
                        <i class="rc rc-ln-at-sign rc-tb-icon" style="font-size:24px"></i>
                        <div>
                            <h6>Alias</h6>
                            <p>Alias to <strong>{{ webapp.alias_of.name }}</strong></p>
                        </div>
                    </li>
                    <li class="flex" v-if="webapp.primaryDomain.ssl !== null || webapp.ssl !== null">
                        <i :class="`rc rc-ssl-icon ${getSslStatusPack.icon}`" style="font-size:24px"></i>
                        <div>
                            <h6>SSL/TLS {{ webapp.setting.advancedSSL === 1 ? 'Advanced' : 'Basic' }}</h6>
                            <p>{{ getSslStatusPack.message }}</p>
                        </div>                        
                    </li>
                    <li class="flex" v-if="webapp.defaultApp">
                        <i class="rc rc-ln-flag rc-tb-icon" style="font-size:24px"></i>
                        <div>
                            <h6>Default Web Application</h6>
                            <p>Site available via server IP Address or any unassigned domains</p>
                        </div>
                    </li>
                </ul>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        props: {
            webapp: Object
        },

        data: () => ({
            showPopover: false
        }),
    
        computed: {
            getSslStatusPack() {
                let isAdvanced = this.webapp.setting.advancedSSL === 1
                let ssl = isAdvanced ? this.webapp.primaryDomain.ssl : this.webapp.ssl

                let sslPack = {
                    icon: '',
                    message: ''
                }

                if (ssl === null) return

                if (ssl.certificate !== null) {
                    switch (ssl.method) {
                    case 'letsencrypt':
                        let today = new Date()
                        let withinSixMonths = today.setMonth(today.getMonth() + 6) < new Date(ssl.validUntil)
                        if (withinSixMonths && isAdvanced) {
                            sslPack = {
                                icon: 'rc-ln-padlock-glow text-warning-500',
                                message: 'AutoSSL Let\'s Encrypt on primary domain is still in progress. Please update the DNS record within 24 hours. Self-signed certificate is provided as fallback during AutoSSL process.'
                            }
                        } else {
                            sslPack = {
                                icon: 'rc-ln-padlock-glow text-green-500',
                                message: `${isAdvanced ? 'Primary domain' : 'Connection'} is encrypted by Let's Encrypt`
                            }
                        }
                        break
                    case 'custom':
                        sslPack = {
                            icon: 'rc-ln-security text-green-500',
                            message: `${isAdvanced ? 'Primary domain' : 'Connection'} is encrypted by Custom Certificate Authority`
                        }
                        break
                    default:
                        sslPack = {
                            icon: 'rc-ln-security text-green-500',
                            message: `${isAdvanced ? 'Primary domain' : 'Connection'} is encrypted by Self Signed Certificate`
                        }
                        break
                    }
                } else {
                    if (ssl.method === 'letsencrypt') {
                        sslPack = {
                            icon: 'rc-ln-padlock-glow text-yellow-500',
                            message: `Let's Encrypt is issuing SSL certificate for ${isAdvanced ? 'the primary domain of' : ''} this web application. It should take less than 5 minutes.`
                        }
                    } else {
                        sslPack = {
                            icon: 'rc-ln-security text-red-500',
                            message: `SSL certificate ${isAdvanced ? 'for primary domain' : ''} is missing! Please remove SSL and deploy it again.`
                        }
                    }
                }
                return sslPack
            }
        },

        methods: {
            mouseEnter: function() {
                this.showPopover = true
            },

            mouseLeave: function() {
                setTimeout(() => {
                    this.showPopover = false
                }, 75)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .rc-ssl-icon {
        @apply text-lg mr-3;
        &::before {
            @apply font-semibold;
        }
    }
</style>