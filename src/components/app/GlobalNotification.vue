<template>
    <div>
        <div class="overlay" @click="toggleNotification()" v-if="toggle"></div>
        <transition name="slide-fade">
            <template v-if="toggle">
                <div class="fixed bg-white p-4 shadow rounded-md border mx-auto left-0 right-0 w-11/12 md:mx-0 md:w-165 md:left- md:right-4 z-2050 top-4 overflow-hidden text-black-500 global-notification no-scrollbar" style="height: calc(100vh - 32px)">
                    <div class="header border-b pb-2 flex justify-between">
                        <h4 class="font-semibold text-black-500">Notifications</h4>
                        <div class="flex space-x-2">
                            <a role="button" @click.prevent="markAllAsRead()" class="block ml-2" v-if="notificationList.length">Mark all as read</a>
                            <button class="close" @click="toggleNotification()">
                                <span aria-hidden="true">
                                    <i class="rc rc-ln-cross"></i>
                                </span>
                            </button>
                        </div>
                    </div>

                    <loader v-if="fetching" class="my-4"></loader>
                    <div v-else-if="notificationList.length && !fetching" class="body h-full pb-4">
                        <global-notification-progress-status v-if="installationStatuses.length > 0" :statuses="installationStatuses" icon="server"></global-notification-progress-status>
                        <div class="h-full overflow-auto">
                        <ul class="divide-y ">
                            <li class="flex py-3 md:px-2" :class="[ item.read_at ? 'read' : 'unread' ]" v-for="(item, index) in notificationList" :key="index" @click="markAsRead(index)">
                                <div class="relative flex mr-7">
                                    <i class="rc text-xl rounded-full flex flex-shrink-0 justify-center items-center bg-blue-50 h-10 w-10 " 
                                        :class="[`rc-ln-${getIcon(item.notification_type)}`, item.read_at ? 'text-misc-200 bg-gray-50' : 'text-blue-500 bg-blue-50']"></i>
                                    <div class="bg-red-500 h-2 w-2 absolute top-1/5 right-1/4 md:-mb-1 md:-mr-2 rounded-full" v-if="!item.read_at"></div>
                                </div>
                                <div class="w-full">
                                    <div class="flex justify-between text-misc-700">
                                        <span>{{ item.notification_type }}</span>
                                        <moment type="fromnow" :time="item.created_at" :live="true"></moment>
                                    </div>
                                    <h6 class="font-semibold my-1">{{ item.title }}</h6>
                                    <p v-html="item.description" class="text-black-500 whitespace-normal"></p>

                                    <a :href="item.action_url" v-if="item.action_url" class="pt-4 block">{{ item.action_text }}</a>
                                </div>
                            </li>
                        </ul>
                        </div>
                        <loader v-if="loadingOnScroll"></loader>
                    </div>
                    <p class="py-4 text-center text-black-500" v-else>You don't have any notifications yet. Come back here later. We'll notify you when there is a new notification.</p>
                </div>
            </template>
        </transition>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            markUrl: String,
            installationStatusUrl: { type: String, required: true }
        },
    
        inject: ['MediaQuery', '$breakpoint'],
    
        data: () => ({
            toggle: false,
            notificationList: [],
            paginationInfo: Object,
            fetching: false,
            loadingOnScroll: false,
            totalUnRead: 0,
            originalTitle: null,
            installationStatuses: []
        }),

        mounted () {
            document.addEventListener('keydown', this.closeOnEsc)

            let that = this

            window.bus.$on('toggleNotification', () => {
                that.toggleNotification()
            })

            window.Echo.private(`global-notifications.${window.RunCloud.user}`).listen('.ReadNewNotification', data => {
                if (data.id === null) {
                    window._.forEach(that.notificationList, (o, key) => {
                        if (o.read_at === undefined) {
                            o.read_at = String(window.moment().format())
                        } else if (o.read_at === null) {
                            o.read_at = String(window.moment().format())
                        }
                    })
                } else {
                    let noti = window._.find(that.notificationList, o => o.id === data.id)
                    noti.read_at = String(window.moment().format())
                }

                that.setDocumentTitle()
            })

            window.Echo.private(`global-notifications.${window.RunCloud.user}`).listen('.NewNotification', data => {
                let existed = window._.find(this.notificationList, o => {
                    return o.id === data.id
                })

                if (existed === undefined) {
                    this.fetching = true
                    this.notificationList.unshift(data)
                    this.fetching = false
                    this.setDocumentTitle()
                }
            })

            window.enterPage(this.installationStatusUrl).then(response => {
                if (response.data.status) {
                    this.installationStatuses = response.data.status
                    this.bindInstallingServersListeners()
                }
            }).catch(() => { })
        },

        watch: {
            installationStatuses: function (val) {
                if (val.length === 0) window.bus.$emit('serverInstalling', false)
            }
        },

        created () {
            this.originalTitle = document.title
            this.fetch()
        },

        computed: {
            totalUnreadNotification: {
                set (notificationList) {
                    this.totalUnRead = this.notificationList.filter(item => !item.read_at).length
                    return this.totalUnRead
                },

                get () {
                    return this.notificationList.filter(item => !item.read_at).length
                }
            }
        },

        methods: {
            toggleNotification () {
                this.toggle = !this.toggle
            },

            closeOnEsc (e) {
                if (e.keyCode === 27) this.toggle = false
            },

            fetch (page = 1) {
                if (page === 1) this.fetching = true

                window
                    .enterPage(this.url, { page: page })
                    .then(response => {
                        this.notificationList = [
                            ...this.notificationList,
                            ...response.data.data
                        ]
                        this.paginationInfo = {
                            current_page: response.data.current_page,
                            last_page: response.data.last_page
                        }
                        this.fetching = false
                        this.loadingOnScroll = false
                        this.totalUnreadNotification = this.notificationList
                        this.setDocumentTitle()
                    })
                    .catch(() => { })
            },

            onScroll: function ({
                target: { scrollTop, clientHeight, scrollHeight }
            }) {
                let self = this

                if (
                    scrollTop + clientHeight >= scrollHeight &&
                    self.paginationInfo.current_page < self.paginationInfo.last_page
                ) {
                    self.loadingOnScroll = true
                    let page = self.paginationInfo.current_page + 1
                    this.fetch(page)
                }
            },

            markAsRead (index) {
                if (!this.notificationList[index].read_at) {
                    this.$set(
                        this.notificationList[index],
                        'read_at',
                        String(window.moment().format())
                    )
                    this.setDocumentTitle()

                    window.axios
                        .post(this.markUrl, { id: this.notificationList[index].id })
                        .then(response => { })
                        .catch(e => { })
                }
            },

            markAllAsRead () {
                this.notificationList.forEach((item, index) => {
                    this.$set(this.notificationList[index], 'read_at', String(window.moment().format()))
                })

                this.setDocumentTitle()

                window.axios
                    .post(this.markUrl, { id: null })
                    .then(response => { })
                    .catch(e => { })
            },

            getIcon (type) {
                type = type.toLowerCase()
                if (type === 'server') {
                    return 'server'
                } else if (type === 'account' || type === 'user') {
                    return 'user'
                } else if (type === 'general') {
                    return 'bell'
                } else if (type === 'web application') {
                    return 'app'
                } else if (type === 'support') {
                    return 'support'
                } else if (type === 'backup') {
                    return 'backup'
                }
            },

            setDocumentTitle () {
                let unread = this.totalUnreadNotification

                document.title = unread > 0 ? `(${unread}) ${this.originalTitle}` : this.originalTitle
                window.bus.$emit('unreadNotification', unread)
            },
            bindInstallingServersListeners() {
                window.bus.$emit('serverInstalling', true)
                this.installationStatuses.forEach(previousStatus => {
                    // mount listener & update status
                    window.Echo.private('servers.' + previousStatus.server_id).listen('.ServerIsInstalling', status => {
                        let index = this.installationStatuses.findIndex(item => item.server_id === status.server_id)
                        let statusToShow = _.merge(status, { server: previousStatus.server })
                        this.$set(this.installationStatuses, index, statusToShow)
                    })
                    // remove progress status
                    window.Echo.private('servers.' + previousStatus.server_id).listen('.ServerSetToOnline', finished => {
                        let index = this.installationStatuses.findIndex(item => item.server_id === finished.server_id)
                        this.installationStatuses.splice(index, 1)
                    })
                })
            },
            unbindInstallingServersListeners() {
                // unmount listener
                this.installationStatuses.forEach(status => {
                    window.Echo.leave(`servers.${status.server_id}`)
                })
            }
        },

        beforeDestroy () {
            window.Echo.leave(`global-notifications.${window.RunCloud.user}`)
            document.removeEventListener('keydown', this.closeOnEsc)
            if (this.installationStatuses.length > 0) this.unbindInstallingServersListeners()
        }
    }
</script>

<style lang="scss" scoped>
    @import '~sass/var';

    .global-notification {
        @screen md {
            left: unset
        }
    }

    .overlay {
        @apply #{$default-overlay};
    }
    
    .close {
        @apply -mt-2 text-gray-700 text-base h-10 w-10 transition delay-75 outline-none rounded-full;

        i::before {
            @apply font-bold;
        }

        &:hover {
            @apply bg-misc-400;
        }
    }

    .slide-fade-enter-active {
        transition: all 0.2s ease-in;
    }

    .slide-fade-leave-active {
        transition: all 0.2s ease-out;
        opacity: 0.5;
    }

    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>

<style lang="scss">
    .global-notification {
        strong {
            @apply font-medium text-blue-500 py-0.5 px-1 bg-gray-300 rounded;
        }
    }
</style>
