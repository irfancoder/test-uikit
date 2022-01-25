<template>
    
        <div class="rounded bg-gray-100">
            <div class="border rounded rounded-br-none rounded-bl-none px-7 h-10 flex items-center justify-between" @click="toggle">
                <h6>View {{ roleName }} permissions</h6>
                <i :class="`rc ${show ? 'rc-ln-chevron-up' : 'rc-ln-chevron-down' } text-misc-100 rc-ln-semibold`"></i>
            </div>
            <!-- Previous accordion component uses Bootstrap to trigger. Need to replace all accordions with Vue-based components. Below is just a hotfix  -->
            <transition name="accordion" >
            <div v-if="show" class="max-h-60 md:max-h-52 2xl:max-h-80 overflow-y-auto rounded border border-t-0 rounded-tr-none rounded-tl-none">
                <ul class="p-4 space-y-4">
                    <li v-for="(permission, index) in permissions" :key="index" class="flex items-center px-2">
                        <i v-if="has(permission.allow)" class="rc rc-ln-tick-circle text-green-500 rc-ln-semibold text-xl mr-2"></i>
                        <i v-else-if="has(permission.readOnly)" class="rc rc-ln-eye text-misc-200 rc-ln-semibold text-xl mr-2" v-tooltip.top="'View only'"></i>
                        <i v-else class="rc rc-ln-cross-circle text-misc-200 rc-ln-semibold text-xl mr-2"></i>
                        <span :class="`${has(permission.allow) || has(permission.readOnly) ? 'text-black font-medium' :'text-misc-700'}`">{{ permission.name }}</span>
                    </li>
                </ul>
            </div>
            </transition>
        </div>
    
</template>

<script>
    export default {
        props: {
            roleName: { type: String, required: true },
            roleId: { type: Number, required: true }
        },
        data() {
            return {
                show: false,
                permissions: [
                    {
                        name: 'Invite / Revoke Team Member',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'Access to Support Ticket',
                        allow: [1, 2, 3, 4],
                        readOnly: [6]
                    },
                    {
                        name: 'Manage Workspace Profile',
                        allow: [1, 2],
                        readOnly: [6]
                    },
                    {
                        name: 'Access to API Key',
                        allow: [1, 2],
                        readOnly: [6]
                    },
                    {
                        name: 'Access to SSH Key Vault',
                        allow: [1, 2, 3, 4],
                        readOnly: [6]
                    },
                    {
                        name: 'Manage API Key',
                        allow: [1, 2, 3, 4],
                        readOnly: [6]
                    },
                    {
                        name: 'Manage Integration APIs',
                        allow: [1, 2],
                        readOnly: [6]
                    },
                    {
                        name: 'Notification Channel',
                        allow: [1, 2, 3],
                        readOnly: [4, 6]
                    },
                    {
                        name: 'Server Transfer',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'WordPress Canvas',
                        allow: [1, 2, 3, 4],
                        readOnly: [6]
                    },
                    {
                        name: 'Billing',
                        allow: [1, 2, 5],
                        readOnly: [6]
                    },
                    {
                        name: 'Account/Audit Log',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'Delete Account / Workspace',
                        allow: [1],
                        readOnly: [6]
                    },
                    {
                        name: 'Manage DNS',
                        allow: [1, 2, 3, 4],
                        readOnly: [6]
                    },
                    {
                        name: 'Manage Atomic Deployment',
                        allow: [1, 2, 3, 4],
                        readOnly: [6]
                    },
                    {
                        name: 'Manage Backup',
                        allow: [1, 2, 3, 4],
                        readOnly: [6]
                    },
                    {
                        name: 'Add / Remove Server',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'Add / Remove System User',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'Install SSH Login Notification',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'Kick SSH Login',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'SSH Config',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'Manage Firewall',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'Manage Server Settings',
                        allow: [1, 2, 3],
                        readOnly: [6]
                    },
                    {
                        name: 'Other Server Resources',
                        allow: [1, 2, 3, 4],
                        readOnly: [6]
                    }
                ]
            }
        },
        methods: {
            has (allowedRoles) {
                return allowedRoles.some(id => id === this.roleId)
            },
            toggle () {
                this.show = !this.show
            }
        }
    }
</script>

<style lang="scss" scoped>
    ul  {
        @screen md {
            columns: 2
        }
    }
    .accordion-enter-active, .accordion-leave-active {
        @apply transition-all ease-in;
    }

    .accordion-enter, .accordion-leave-to {
        @apply max-h-0;
    }
    .accordion-enter-to, .accordion-leave {
        @apply max-h-60 md:max-h-52 2xl:max-h-80
    }

</style>

ROLE LEGEND
1 -- Owner
2 -- Super Admin
3 -- System Admin
4 -- Developer
5 -- Finance
6 -- Observer