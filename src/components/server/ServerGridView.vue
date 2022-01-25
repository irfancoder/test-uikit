<template>
    <div class="min-w-screen mt-7" :class="isListView ? 'hidden' : 'block'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6.5 pb-7">
            <div class="group bg-white border rounded-md cursor-pointer" v-for="server in servers" :key="server.id" @click.prevent="goToUrl(server.url)">
                    <div class="px-4 pt-4">
                        <div class="flex items-center pb-4 border-b border-gray-300 -mx-4 px-4">
                            <div class="bg-red-500 pt-2 h-2 w-2 rounded-full"  v-tooltip.top="'Not connected'" v-if="!server.connected"></div>
                            <div class="bg-blue-500 h-2 w-2 rounded-full"  v-tooltip.top="'Pending IP Change'" v-else-if="server.changeIp"></div>
                            <div class="bg-yellow-500 h-2 w-2 rounded-full"  v-tooltip.top="'Offline'" v-else-if="!server.online"></div>
                            <div class="bg-green-500 h-2 w-2 rounded-full" v-tooltip.top="'Connected'" v-else></div>
                            <vps-icon :provider="server.provider" class="ml-2 mr-4 flex-initial"></vps-icon>
                            <div class="flex-1">
                                <div class="flex flex-col">
                                    <a class="font-medium text-black-500 group-hover:text-blue-500" :href="server.url">
                                        {{ server.name }}&nbsp;
                                        <i class="rc rc-ln-info text-base" v-if="server.agentVersion && !server.isAgentLatestVersion" v-tooltip:top="'A new version of RC agent is available for your server and should be updated automatically within 48 hours. If you still see this warning in the next 48 hours, please contact support to fix this issue'"></i>
                                    </a>
                                    <div class="relative">
                                        <span :id="`ipAddressGrid-${server.id}`" class="text-misc-700">{{ server.ipAddress }}</span>
                                        <a class="absolute overflow-visible btn-clipboard cursor-pointer text-sm mt-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-100" @click.prevent.stop="toCopied(server.id)" :id="`ipAddressGrid-${server.id}-copied`">Copy</a>
                                    </div>
                                </div>
                            </div>

                            <div class="justify-self-end flex-initial opacity-0 group-hover:opacity-100">
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
                            </div>
                        </div>
                    </div>

                <div class="p-4">
                    <ul class="space-y-1">
                         <li>
                            <div class="inline-flex items-center">
                                <svg-icon :icon="`br-${server.webServerType}`" height="18" width="18"></svg-icon>
                                <p class="ml-3 text-black-500 self-center">{{ server.webServerType === 'ols' ? 'OpenLiteSpeed' : 'NGINX' }}</p>
                            </div>
                        <li>
                            <div class="inline-flex">
                                <country-flag-icon :shortcode="serverGeoRecords[server.id]['country_iso_code']" class="mt-1 text-xl"></country-flag-icon>
                                <p class="ml-3 text-black-500 self-center">{{serverGeoRecords[server.id]['country']}}</p>
                            </div>
                        </li>
                        <li v-if="server.isOwner">
                            <div class="inline-flex">
                                <i class="rc rc-ln-user text-xl text-misc-700"></i>
                                <p class="ml-3 text-black-500 self-center">Owned by Me</p>
                            </div>
                        </li>
                        <li v-else>
                            <div class="inline-flex">
                                <i class="rc rc-ln-teams text-xl text-misc-700"></i>
                                <p class="ml-3 text-black-500 self-center">Shared</p>
                            </div>
                        </li>
                        <li>
                            <div class="flex flex-row">
                                <i class="rc rc-ln-tag text-xl text-misc-700 pt-1"></i>
                                <span class="ml-3 text-black-500 self-center">Tags</span>
                                <server-tags :tags="server.tags" :taggables="tags" :url="serverTagUrl" :limit="2" :ref="`server_tags_${server.id}`" tag-class="justify-end">
                                    <template #custom="{ show }">
                                        <a v-if="show && !server.tags.length" class="text-blue-500 cursor-pointer font-normal" @click.prevent.stop="$refs[`tagModal-${server.id}`][0].openModal()">Add Tag</a>
                                    </template>
                                </server-tags>
                            </div>
                        </li>
                    </ul>

                    <div class="mt-4 py-4 text-center bg-gray-100 h-auto" v-if="!server.canViewServerHealth">
                        <i class="rc rc-ln-info text-misc-700"></i>
                        <p>Server information is not available on this plan. <br>Please <a :href="subscriptionUrl" @click="analyticEvent('Upgrade Plan', 'Click', 'Server Health')">upgrade</a> your plan.</p>
                    </div>
                    <div class="mt-4 py-4 text-center bg-gray-100 h-auto" v-else-if="!server.connected || !server.online || _.isUndefined(server.latest_server_health)">
                        <i class="rc rc-ln-info text-misc-700"></i>
                        <p>Server information is not available.</p>
                    </div>
                    <ul class="mt-4 space-y-1" v-else>
                        <li>
                            <div class="flex flex-row">
                                <p class="w-10/12 text-black-500">Disk</p>
                                <server-index-stats :used="server.latest_server_health.usedDiskSpace" :available="server.latest_server_health.availableDiskSpace" :total="server.latest_server_health.totalDiskSpace"></server-index-stats>
                            </div>
                        </li>
                        <li>
                            <div class="flex flex-row">
                                <p class="w-10/12 text-black-500">RAM</p>
                                <server-index-stats :used="server.latest_server_health.usedMemory" :available="server.latest_server_health.availableMemory" :total="server.latest_server_health.totalMemory"></server-index-stats>
                            </div>
                        </li>
                        <li>
                            <div class="flex flex-row">
                                <p class="w-10/12 text-black-500">Load</p>
                                <div class="flex-1 text-right">{{ server.latest_server_health.loadAverage }}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

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

        <div class="min-w-screen mb-0 -mt-7 -mx-7">
            <slot name="pagination"></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        propServers: Object,
        serverGeoRecords: Object,
        propTags: Object,
        saveTagUrl: String,
        subscriptionUrl: String,
        serverTagUrl: String,
        latestAgentVersions: Object,
        webAppUrl: String,
        settingsUrl: String
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
        this.tags = _.keyBy(this.propTags, 'id')

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
            const copyText = document.getElementById(`ipAddressGrid-${id}`).innerText
            navigator.clipboard.writeText(copyText)

            document.getElementById(`ipAddressGrid-${id}-copied`).innerHTML = 'Copied!'

            setTimeout(function() {
                document.getElementById(`ipAddressGrid-${id}-copied`).innerHTML = 'Copy'
            }, 1500)
        },

        toggleExpandMenu(id) {
            this.toggleList[id] = !this.toggleList[id]
        }
    }
}
</script>
