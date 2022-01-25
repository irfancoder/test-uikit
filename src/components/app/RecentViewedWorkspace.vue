<template>
   <div class="w-full xl:w-1/3">
        <div class="panel panel-default">
            <div class="panel-heading flex justify-between items-baseline">
                <h4>Recent Servers</h4>
                <a :href="serversUrl">View all <i class="rc rc-ln-arrow-right"></i></a>
            </div>
            <div class="panel-body pt-0 pb-2">
                <ul class="divide-y">
                    <template v-if="working">
                        <li v-for="i in 3" :key="i">
                        <skeleton-base :height="42" class="py-3">
                            <template #default>                                    
                                <circle cx="12" cy="18" r="12" />
                                <rect x="40" y="2" rx="2" ry="2" width="80" height="14" />
                                <rect x="40" y="22" rx="2" ry="2" width="100" height="14" />
                            </template>
                        </skeleton-base>
                        </li>
                    </template>
                    <template v-else-if="servers && !working">
                        <li v-for="server in servers" :key="server.id" class="py-3"> 
                            <div class="flex items-center">
                                <vps-icon :provider="server.provider" class="mr-4"></vps-icon>
                                <div class="inline-block">
                                    <a class="font-medium text-black-500 hover:text-blue-500" :href="server.url">{{ server.name }}</a>
                                    <copy-text :id="`ipAddress_${ server.id }`">
                                        <template #content>
                                            <span :id="`ipAddress_${ server.id }`" class="text-misc-700">{{ server.ipAddress }}</span>
                                        </template>
                                    </copy-text>
                                </div>
                            </div>
                        </li>
                    </template>
                    <li v-else class="py-4"><p>You don't have any recently viewed servers yet</p></li>
                </ul>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading flex justify-between items-baseline">
                <h4>Recent Web Applications</h4>
                <a :href="webAppsUrl">View all <i class="rc rc-ln-arrow-right"></i></a>
            </div>
            <div class="panel-body pt-0 pb-2">
                <ul class="divide-y">
                    <template v-if="working">
                        <li v-for="i in 3" :key="i">
                        <skeleton-base :height="42" class="py-3">
                            <template #default>                                    
                                <circle cx="12" cy="18" r="12" />
                                <rect x="40" y="2" rx="2" ry="2" width="80" height="14" />
                                <rect x="40" y="22" rx="2" ry="2" width="100" height="14" />
                            </template>
                        </skeleton-base>
                        </li>
                    </template>
                     <template v-if="webApps">
                    <li v-for="webApp in webApps" :key="webApp.id" class="flex py-3">
                        <div v-if="webApp.screenshot">
                            <a :href="webApp.url" v-if="webApp.server.online">
                                <img :src="webApp.screenshot" loading="lazy" class="w-14 h-10 mr-4 rounded border">
                            </a>
                            <img v-else :src="webApp.screenshot" loading="lazy" class="w-14 h-10 mr-4 rounded border">
                        </div>
                        <div v-else>
                            <a v-if="webApp.server.online" :href="webApp.url">
                                <div class="bg-misc-500 w-14 h-10 border rounded mr-4 flex justify-center items-center" v-tooltip.top="'The image for this web application is not available yet.'">
                                    <i class="rc rc-ln-image text-lg text-misc-700"></i>
                                </div>
                            </a>
                            <div v-else class="bg-misc-500 w-14 h-10 border rounded mr-4 flex justify-center items-center" v-tooltip.top="'The image for this web application is not available yet.'">
                                <i class="rc rc-ln-ban text-lg text-misc-700"></i>
                            </div>
                        </div>

                        <div>
                            <span v-if="webApp.server.online"><a :href="webApp.url" class="font-medium text-black-500 hover:text-blue-500">{{ webApp.name }}</a> </span>
                            <span v-else class="font-medium text-gray-700 cursor-not-allowed">{{ webApp.name }}</span>

                            <div class="flex w-full">
                                <a v-if="webApp.server.online" :href="`http://${webApp.primaryDomain.name}`" target="_blank" class="scrollable-text">{{  webApp.primaryDomain.display_name }}</a>
                                <label v-else class="badge badge-default mt-1">Offline</label>                                
                                <a v-if="webApp.domains.length > 1" :href="`/servers/${webApp.server.id}/webapplications/${webApp.id}/domains`" rel="noreferrer"><span class="badge badge-default ml-2 text-misc-200 hover:text-blue-500">+{{ count(webApp.domains) - 1 }}</span></a>
                            </div>
                        </div>
                    </li>
                     </template>
                    <li v-else class="py-4"><p>You don't have any recently viewed web apps yet</p></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            serversUrl: { type: String, required: true },
            webAppsUrl: { type: String, required: true },
            url: { type: String, required: true }
        },
        data() {
            return {
                working: false,
                servers: [],
                webApps: []
            }
        },
        created() {
            this.fetch()
        },
        methods: {
            fetch() {
                this.working = true
                window.enterPage(this.url).then(response => {
                    this.working = false
                    this.servers = response.data.servers
                    this.webApps = response.data.webApps
                })
            }
        }
    }
</script>