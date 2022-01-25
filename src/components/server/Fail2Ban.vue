<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <panel-header>
                <template #filter>
                    <div class="form-group">
                        <input type="text" class="form-control" v-model="filter" placeholder="Search...">
                    </div>
                </template>

                <template #action>
                    <modal-base title="Ban IP Address" label="Ban IP Address" label-class="btn btn-primary">
                        <template #form="{ close }">
                            <add-ip-address-form
                                :url="banUrl"
                                title="Add IP address to SSH Login Notification"
                                button-text="Ban"
                                :close="close"
                                :analytics="{ page: 'fail2ban', action: 'manual IP ban' }">
                            </add-ip-address-form>
                        </template>
                    </modal-base>
                </template>
                <p slot="desc">These are the IP Addresses that have been banned for bruteforcing into your server. You need to remove them in order to restore their access to your server.</p>
            </panel-header>
        </div>
        <div class="panel-table table-responsive">
            <loader v-if="working"></loader>
            <table v-else class="table table-hover">
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th class="sr-only">Action</th>
                    </tr>
                </thead>
                <tbody v-if="getIPS">
                    <tr v-for="(ip, index) in getIPS" :key="index">
                        <td>
                            <div class="group">
                                <span :id="`ip-${index}`" >{{ ip }}</span><a class="btn-clipboard cursor-pointer text-sm ml-1 opacity-0 group-hover:opacity-100 transition-all duration-100" :data-clipboard-target="`#ip-${index}`" data-clipboard-action="copy">Copy</a>
                            </div>
                        </td>

                        <td>
                            <ajax-delete :url="deleteUrl" button-text="Delete" button-class="text-red-500" button-icon="" button-type="button" title="Unban IP Address" :text="`Do you want to unban IP Address ${ip}?`" analytic-category="Fail2Ban" :post-data="{ ip: ip }" analytic-action="delete ip address" @deleted="fetch"></ajax-delete>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else-if="!subscribe">
                    <tr>
                        <td colspan="2">Please subscribe to use this function</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="2">You have no blocked IP addresses yet.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <slot class="panel-footer"></slot>
        <v-tableinfo :items="ips" title="IP Addresses" @change-page="fetch"></v-tableinfo>
    </div>
</template>

<script>
export default {
    props: {
        url: String,
        banUrl: String,
        createUrl: String,
        deleteUrl: String
    },

    data () {
        return {
            cancelSource: null,
            working: true,
            subscribe: true,
            filter: '',
            ips: {}
        }
    },

    computed: {
        getIPS () {
            if (this.ips) {
                if (this.ips.data && this.filter) {
                    const result = []

                    for (let key in this.ips.data) {
                        if (window._.includes(this.ips.data[key], this.filter)) {
                            result.push(this.ips.data[key])
                        }
                    }

                    return result
                } else {
                    return Object.values(this.ips.data)
                }
            }

            return null
        },

        currentUrl () {
            return window.location.href
        }
    },

    created () {
        this.fetch()
    },

    beforeDestroy () {
        if (this.cancelSource !== null) {
            this.cancelSource.cancel()
        }
    },

    methods: {
        fetch (page = 1) {
            this.working = true

            window.enterPage(this.url + '?page=' + page, {}).then(({ data }) => {
                this.working = false
                this.ips = data.ips
            }).catch(e => {
                this.working = false
            })
        }
    }
}
</script>
