<template>
    <div class="relative">
        <i class="rc rc-ln-bell rc-icon-navbar hidden md:flex" role="button" @click="passToggle()"></i>
        <!-- <a class="btn btn-primary btn-act justify-start md:hidden" @click="passToggle()">
            <i class="rc rc-ln-bell"></i>
            <span>Notification</span>
        </a> -->
        <div class="bg-red-500 h-2 w-2 absolute top-0 right-0 md:-mt-2 md:-mr-1 rounded-full" v-if="unread"></div>
        <progress-bar v-if="isInstalling" class="absolute -bottom-3 w-full" :percentage="100" animate></progress-bar>
    </div>
</template>

<script>
    export default {
        inject: ['MediaQuery', '$breakpoint'],

        data: () => ({
            unread: 0,
            isInstalling: false
        }),

        mounted () {
            window.bus.$on('unreadNotification', data => {
                this.unread = data
            })

            window.bus.$on('serverInstalling', status => {
                this.isInstalling = status
            })
        },

        methods: {
            passToggle () {
                window.bus.$emit('toggleNotification')
            }
        }
    }
</script>
