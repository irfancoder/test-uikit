<template>
    <div :class="isListView || !propTags ? 'block' : 'hidden'" class="min-w-screen panel bg-white border rounded-b-md">
        <div class="panel-table table-responsive pt-0">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>Server</th>
                    <th width="15%">IP Address</th>
                    <th width="10%">Disk</th>
                    <th width="10%">RAM</th>
                    <th width="10%" class="text-center">Load</th>
                    <th v-if="!hideServerTags">Tags</th>
                    <th class="text-right"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="server in servers" :key="server.id" @click.prevent="goToUrl(server.url)" class="group cursor-pointer">
                    <td class="w-3/12">
                        <v-popover offset="4" trigger="hover" popoverClass="tooltip-bg-white" placement="top">
                            <div class="items-center no-scrollbar">
                                <div class="flex items-center">
                                    <div class="bg-red-500 pt-2 h-2 w-2 rounded-full"  v-tooltip.top="'Not connected'" v-if="!server.connected"></div>
                                    <div class="bg-blue-500 h-2 w-2 rounded-full"  v-tooltip.top="'Pending IP Change'" v-else-if="server.changeIp"></div>
                                    <div class="bg-yellow-500 h-2 w-2 rounded-full"  v-tooltip.top="'Offline'" v-else-if="!server.online"></div>
                                    <div class="bg-green-500 h-2 w-2 rounded-full" v-tooltip.top="'Connected'" v-else></div>
                                    <vps-icon :provider="server.provider" class="mx-4"></vps-icon>
                                    <a class="font-medium text-black-500 group-hover:text-blue-500" :href="server.url">
                                        {{ server.name }}
                                        <i class="rc rc-ln-info text-base" v-if="server.agentVersion && !server.isAgentLatestVersion" v-tooltip:top="'A new version of RC agent is available for your server and should be updated automatically within 48 hours. If you still see this warning in the next 48 hours, please contact support to fix this issue'"></i>
                                    </a>
                                </div>
                            </div>
                            <template slot="popover">
                                <div class="px-4 pt-4">
                                    <a class="font-medium text-lg text-black-500 py-2">{{ server.name }}</a>
                                </div>
                                <ul class="space-y-4 p-4">
                                    <li>
                                        <div class="inline-flex items-center">
                                            <svg-icon :icon="`br-${server.webServerType}`" height="16" width="16"></svg-icon>
                                            <p class="ml-4 text-black-500">{{ server.webServerType === 'ols' ? 'OpenLiteSpeed' : 'NGINX' }}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="inline-flex">
                                                <country-flag-icon :shortcode="serverGeoRecords[server.id]['country_iso_code']" flag-size="s"></country-flag-icon>
                                            <p class="ml-4 text-black-500">{{serverGeoRecords[server.id]['country']}}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="inline-flex">
                                            <i class="rc rc-gl-ubuntu text-misc-700 text-lg"></i>
                                            <p class="ml-4 text-black-500 capitalize">{{ server.agentOs }}</p>
                                        </div>
                                    </li>
                                    <li v-if="server.isOwner">
                                        <div class="inline-flex">
                                            <i class="rc rc-ln-user text-misc-700 text-lg"></i>
                                            <p class="ml-4 text-black-500 self-center">Owned by Me</p>
                                        </div>
                                    </li>
                                    <li v-else>
                                        <div class="inline-flex">
                                            <i class="rc rc-ln-teams text-misc-700 text-lg"></i>
                                            <p class="ml-4 text-black-500 self-center">Shared</p>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                        </v-popover>
                    </td>
                    <td>
                        <div class="items-center no-scrollbar">
                            <div class="flex flex-col">
                                <div class="relative">
                                    <span :id="`ipAddress-${server.id}`" class="text-misc-700">{{ server.ipAddress }}</span>
                                    <a class="absolute overflow-visible btn-clipboard cursor-pointer text-sm mt-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-100" @click.prevent.stop="toCopied(server.id)" :id="`ipAddress-${server.id}-copied`">Copy</a>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td colspan="3" v-if="!server.canViewServerHealth">Server information is not available on this plan. <br>Please <a :href="subscriptionUrl" @click="analyticEvent('Upgrade Plan', 'Click', 'Server Health')">upgrade</a> your plan.</td>
                    <td colspan="3" v-else-if="!server.connected || !server.online || _.isUndefined(server.latest_server_health)">Server information is not available.</td>
                    <td v-else>
                        <div class="items-center"><server-index-stats :used="server.latest_server_health.usedDiskSpace" :available="server.latest_server_health.availableDiskSpace" :total="server.latest_server_health.totalDiskSpace"></server-index-stats></div>
                    </td>
                    <td v-if="server.canViewServerHealth && server.connected && server.online && !_.isUndefined(server.latest_server_health)">
                        <div class="items-center"><server-index-stats :used="server.latest_server_health.usedMemory" :available="server.latest_server_health.availableMemory" :total="server.latest_server_health.totalMemory"></server-index-stats></div>
                    </td>
                    <td v-if="server.canViewServerHealth && server.connected && server.online && !_.isUndefined(server.latest_server_health)" :class="{ 'text-red-500': server.latest_server_health.loadAverage > 5 }" class="text-center">
                        <div class="items-center">{{ server.latest_server_health.loadAverage }}</div>
                    </td>
                    <td v-if="!hideServerTags">
                        <server-tags v-if="server.hasOwnProperty('tags')" :tags="server.tags" :taggables="tags" :url="serverTagUrl" :limit="2" :ref="`server_tags_${server.id}`">
                            <template #custom="{ show }">
                                <a v-if="show && !server.tags.length" class="text-blue-500 cursor-pointer font-normal block" @click.prevent.stop="$refs[`tagModal-${server.id}`][0].openModal()"><span class="text-sm">Add Tag</span></a>
                            </template>
                        </server-tags>
                    </td>
                    <td>
                        <div class="dropdown" :class="toggleList[server.id] === true ? 'show' : ''">
                            <a role="button"
                               :id="`dropdownMenu-${server.id}`"
                               @click.stop="toggleExpandMenu(server.id)"
                               class="dropdown-toggle btn btn-default icon-only"
                               data-toggle="dropdown"
                               aria-haspopup="true"
                               :aria-expanded="toggleList[server.id]"
                               v-tooltip.top="'Deploy, Settings'">
                                <i class="rc rc-ln-more"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right" :class="toggleList[server.id] ? 'show' : ''" role="menu">
                                <li><a @click.prevent.stop="goToUrl(server.url)" class="btn btn-primary btn-act"><i class="rc rc-ln-corner-right-round"></i><span>View</span></a></li>
                                <li v-if="server.hasOwnProperty('tags')"><a class="btn btn-primary btn-act" @click.prevent.stop="$refs[`tagModal-${server.id}`][0].openModal()"><i class="rc rc-ln-tag"></i><span>{{ server.tags.length ? 'Edit' : 'Add' }} Tags</span></a></li>
                                <li v-if="server.connected"><a @click.prevent.stop="goToUrl(webAppUrl.replace('=id=', server.id))" class="btn btn-primary btn-act"><i class="rc rc-ln-backup"></i><span>Deploy New Web App</span></a></li>
                                <li v-if="server.connected"><a @click.prevent.stop="goToUrl(settingsUrl.replace('=id=', server.id))" class="btn btn-primary btn-act"><i class="rc rc-ln-gear"></i><span>Settings</span></a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div v-if="propTags">
        <modal-base :title="server.tags.length ? 'Edit Tags' : 'Add Tags'" description="Use tags to help manage your servers" :ref="`tagModal-${server.id}`" v-for="server in servers" :key="server.id">
            <template #form="{ close }">
                <update-server-tags-form
                    :url="saveTagUrl"
                    :id="server.id"
                    :tags="propTags"
                    :taggables="server.tags"
                    :close="close">
                </update-server-tags-form>
            </template>
        </modal-base>
        </div>
        <slot name="pagination"></slot>
    </div>
</template>
<script>
export default {
    props: {
        propServers: Object,
        serverGeoRecords: Object,
        propTags: { type: Object, required: false, default: null },
        saveTagUrl: String,
        subscriptionUrl: String,
        serverTagUrl: String,
        webAppUrl: String,
        settingsUrl: String,
        hideServerTags: { type: Boolean, required: false, default: false }
    },

    data () {
        return {
            servers: [],
            tags: [],
            isListView: true,
            toggleList: {}
        }
    },

    mounted () {
        window.bus.$on('toggleServerView', data => {
            this.isListView = data
        })

        this.isListView = window.$cookies.get('rc_server_view') !== 'grid'
    },

    created() {
        this.servers = this.propServers.data
        if (this.propTags) this.tags = _.keyBy(this.propTags, 'id')

        let initToggleItems = {}
        _.forEach(this.servers, (item) => {
            initToggleItems[item.id] = false
        })

        this.toggleList = initToggleItems
    },

    methods: {
        goToUrl(url) {
            window.handleRedirect(url)
        },

        toCopied(id) {
            const copyText = document.getElementById(`ipAddress-${id}`).innerText
            navigator.clipboard.writeText(copyText)

            document.getElementById(`ipAddress-${id}-copied`).innerHTML = 'Copied!'

            setTimeout(function() {
                document.getElementById(`ipAddress-${id}-copied`).innerHTML = 'Copy'
            }, 1500)
        },

        toggleExpandMenu(id) {
            this.toggleList[id] = !this.toggleList[id]
        }
    }
}
</script>
