<template>
    <div class="md:relative dropdown">
        <a href="#" class="dropdown-toggle d-none d-md-block" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="image-holder relative left-0 top-0" :class="isWorkspace ? 'pr-5' : ''">
                <avatar
                    size="40"
                    :model="user"
                    :type="isWorkspace ? 'initials' : user.avatarType">
                </avatar>

                <div class="avatarCircle" v-if="isWorkspace && personal">
                    <avatar
                        size="24"
                        :model="_.pick(personal, ['avatarType', 'email', 'gravatar', 'name'])"
                        :type="personal.avatarType">
                    </avatar>
                </div>
            </div>
        </a>

        <!-- Header -->
        <ul class="dropdown-menu">
            <li class="border-b bg-misc-500 py-4 relative">
                <div class="flex flex-col gap-y-2">
                    <p class="text-sm font-medium"> {{ isWorkspace ? 'Workspace Account' : 'Personal Account' }}</p>
                    <div class="flex gap-x-3">
                        <avatar
                            class="pt-0.5"
                            size="40"
                            :model="user"
                            :type="isWorkspace ? 'initials' : user.avatarType">
                        </avatar>
                        <div class="align-start">
                            <span class="truncate box-content pb-0.5 max-w-2xs no-scrollbar text-black-800 font-semibold">{{ isWorkspace ? user.name : personal.name }}</span>
                            <p class="truncate box-content pt-0.5 pb-2 max-w-2xs no-scrollbar text-misc-700"> {{ isWorkspace ? workspaceRole: personal.email }}</p>
                            <label class="badge badge-default capitalize">{{ roleName }}</label>
                        </div>
                    </div>

                    <a v-if="isWorkspace" role="button" :href="returnUrl" class="absolute h-8 w-8 flex items-center shadow-lg justify-center rounded-full bg-white top-4 right-4 text-misc-700" v-tooltip.left="'Switch to Personal Account'"><i class="rc rc-ln-reply text-xl font-semibold"></i></a>
                </div>
            </li>
            <li role="separator" class="pt-2"></li>
            <!-- Workspaces -->
            <template v-if="canCreateWorkspace">
                <template v-if="recentWorkspaces.length > 0">
                    <li class="text-misc-200 text-sm font-medium pt-2 pb-1">Recent Workspaces</li>
                    <li v-for="workspace in recentWorkspaces" :key="workspace.id" class="recents">
                        <a :class="`group flex items-center rounded px-2 py-1 ${ user.id === workspace.id ? 'workspace-active' : '' }`" :href="switchTo(workspace.id)">
                            <avatar
                                class="mr-3"
                                size="32"
                                :model="_.pick(workspace, ['name'] )"
                                type="initials"
                                >
                            </avatar>
                            <span class="truncate box-content py-0.5 max-w-2xs no-scrollbar text-black-500 group-hover:text-blue-500" :title="workspace.name"> {{ workspace.name }}</span>
                            <i class="rc rc-ln-tick flex-grow text-right pl-2" v-if="user.id === workspace.id"></i>
                            <span v-else class="opacity-0 group-hover:opacity-100 transition-opacity flex-grow text-right pl-2">Switch</span>
                        </a>
                    </li>
                </template>

                <li role="separator" class="pt-2"></li>

                <li class="nav-item" v-if="isWorkspace || workspacesCount > 5">
                    <a :href="listUrl"><i class="rc rc-ln-arrow-right"></i><span>View All Workspaces</span></a>
                </li>

                <li class="nav-item">
                    <a v-if="!freeWorkspace" :href="workspacesCount === 0 ? listUrl : createUrl"><i class="rc rc-ln-plus-circle"></i> <span>Create New Workspace</span> <label v-if="workspacesCount === 0" class="badge badge-primary">New</label></a>
                    <a v-else @click.prevent="$refs.unsub_workspace.openModal()" class="cursor-pointer"><i class="rc rc-ln-plus-circle"></i> <span>Create New Workspace</span></a>
                </li>

                <li class="nav-item" v-if="isWorkspace && _.includes(settingsCan, _.toLower(workspaceRole))">
                    <a :href="settingsUrl"> <i class="rc rc-ln-gear"></i><span>Workspace Settings</span></a>
                </li>
                <li class="nav-item" v-if="(isWorkspace && _.includes(billingCan, _.toLower(workspaceRole)))">
                    <a href="/settings/subscription"> <i class="rc rc-ln-billing"></i><span>Workspace Billing</span></a>
                </li>

                <li role="separator" class="divider"></li>
            </template>

            <!-- Settings -->
            <template v-if="!isWorkspace">
                <li class="nav-item">
                    <a href="/settings" class="flex">Settings</a>
                </li>
                <li class="nav-item" v-if="roleName !== 'Education'">
                    <a href="/settings/subscription" class="flex">Billing</a>
                </li>
            </template>
            <li class="nav-item">
                <a href="https://runcloud.io/legal/tos" target="_blank" rel="noreferrer" @click="analyticEvent('Terms of Service', 'View', 'View Terms of Service')">Terms &amp; Policies</a>
            </li>
            <li class="nav-item">
                <form action="/auth/logout" method="POST">
                    <input type="hidden" name="_token" :value="token">
                    <button class="a-danger font-medium" type="submit" @click="analyticEvent('Authentication', 'Logout', 'Logout from Dashboard')">Sign Out</button>
                </form>
            </li>
        </ul>
        
        <modal-base v-if="freeWorkspace" title="You have an unsubscribed workspace!" ref="unsub_workspace">
            <template #content>
                <div class="alert alert-warning">
                    <span class="text-black-500">Please upgrade the workspace to a paid plan before proceeding to create a new workspace.</span>
                </div>
                <p>Switch to the following workspace &amp; head to <strong>Billing > Subscription</strong> to subscribe.</p>
                <div class="flex justify-between items-center py-7">
                    <div class="flex items-center">
                        <avatar
                            class="mr-3"
                            size="40"
                            :model="_.pick(freeWorkspace, ['name'] )"
                            type="initials">
                        </avatar>
                        <span class="text-black-500 truncate box-content py-0.5 max-w-2xs no-scrollbar" :title="freeWorkspace.name"> {{ freeWorkspace.name }}</span>
                    </div>
                    <a class="btn btn-default" :href="switchTo(freeWorkspace.id)">Switch</a>
                </div>    
            </template>
        </modal-base>
    </div>
</template>

<script>
    export default {
        props: {
            canCreateWorkspace: Boolean,
            gravatar: String,
            name: String,
            email: String,
            user: Object,
            workspaceRole: { type: String, required: false },
            showSwitch: Boolean,
            originalRoleName: String,
            isWorkspace: String,
            listUrl: String,
            settingsUrl: String,
            returnUrl: String,
            createUrl: String,
            searchUrl: String
        },

        data: () => ({
            roleName: null,
            avatarType: '',
            token: document.head.querySelector("meta[name='csrf-token']").content,
            working: true,
            personal: {},
            workspaces: [],
            recentWorkspaces: [],
            workspacesCount: 0,
            freeWorkspace: false,
            switchUrl: '/workspaces/switch/to-workspace/',
            settingsCan: ['owner', 'super admin', 'observer', 'system admin'],
            billingCan: ['owner', 'super admin', 'observer', 'finance']
        }),

        mounted () {
            window.bus.$on('switchAvatarType', data => {
                this.avatarType = data
            })
        },

        created () {
            this.fetch()

            this.roleName = this.getRole(this.originalRoleName)

            window.Echo.private('users.' + window.RunCloud.user).listen('.SubscriptionWasMadeOrRenewed', (res) => {
                this.roleName = res.roleName
            })

            if (window.mixpanel) {
                window.mixpanel.identify(this.user.email)
                window.mixpanel.people.set({ role: this.roleName })

                window.mixpanel.register({
                    name: this.user.name,
                    email: this.user.email,
                    role: this.roleName
                })
            }
        },
        methods: {
            getRole(role) {
                let cycle = role.match(/\(([^)]+)\)/)
                let plan = role.split(' ')[0]
                return ((cycle ? cycle[1] : '') + ' ' + plan)
            },

            fetch: window._.debounce(function () {
                this.working = true
                window.axios.get(this.searchUrl).then(response => {
                    this.working = false
                    this.personal = this._.merge(response.data.personal, { gravatar: response.data.personalGravatar })
                    this.workspacesCount = response.data.workspaceCount
                    this.freeWorkspace = response.data.freeWorkspace
                    this.recentWorkspaces = response.data.recently_viewed_workspaces
                })
            }, 500),

            switchTo(workspaceId) {
                return this.switchUrl.concat(workspaceId)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dropdown {
        position: unset;
        @apply md:relative;
    }

    .dropdown-menu {
        @apply overflow-auto max-h-90-screen 2xl:max-h-screen min-w-80 pt-0 pb-5 px-0 mr-2 md:mr-0;

        @screen md {
            left: unset;
        }
        
        & > li {
            @apply px-7;
        }

        .recents {
            @apply px-4 w-full font-medium text-base leading-none cursor-pointer h-10 mb-1;
        }

        & .recents:last-child {
                @apply mb-3;
            }

        > .nav-item {
            ~ .nav-item {
                @apply mt-3;
            }

            a {
                @apply text-black-800 space-x-3 flex items-center;

                > i {
                    @apply text-misc-100 text-lg;
                }
            }

            &.active,
            &:hover,
            &:focus {
                a,
                i {
                    @apply text-blue-500;
                }
            }
            
            .a-danger {
                @apply text-red-500;
            }
        }
    }

    .divider {
        @apply border-t my-4;
    }

    .btn-act:hover {
        @apply bg-transparent;
    }

    .workspace-active {
        @apply bg-blue-100 text-blue-500;

        > span {
            @apply text-blue-500;
        }
        > i {
            @apply text-blue-500 font-semibold;
        }
    }

    .avatarCircle {
        @apply bg-blue-900 absolute top-5 z-20;
        left: 28px;
        padding: 3px;
        border-radius: 50%;
    }
</style>
