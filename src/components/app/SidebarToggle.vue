<template>
    <div>
        <li class="hidden md:block"><a class="flex items-center cursor-pointer" v-on:click.prevent="show ? collapseSidebar() : expandSidebar()"><i :class="`rc rc-ln-${show ? 'move-layer-left' : 'move-right'}`" v-tooltip.right="!show ? 'Expand Menu' : null"></i> <span>{{ show ? 'Collapse Menu' : 'Expand Menu' }}</span></a></li>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                show: this.checkCookie()
            }
        },
        mounted() {
            this.prep()
        },
        inject: ['MediaQuery', '$breakpoint'],
        watch: {
            breakpoint: function () {
                this.prep()
            }
        },
        computed: {
            breakpoint () {
                return this.$breakpoint()
            }
        },
        methods: {
            checkCookie() {
                if (this.$cookies.get('rc_sidebar_show') === null) return true
                return this.$cookies.get('rc_sidebar_show') === 'true'
            },
            prep () {
                if (this.show) this.expandSidebar()
                else this.collapseSidebar()
            },
            collapseSidebar() {
                this.show = false
                window.bus.$emit('sidebarCollapsed', true)
                if (this.MediaQuery('down', 'md')) {
                    this.expandSidebar()
                } else {
                    document.getElementById('sidebar-main').classList.add('icon-only')
                    document.getElementById('content-wrapper').classList.replace('content-shrink', 'content-expand')
                }
                window.$cookies.set('rc_sidebar_show', false, '-1') // possible values for cookie expiry duration/date --> 60s, 7d, new Date(2021, 03, 12), -1 (never expires)
            },
            expandSidebar() {
                this.show = true
                window.bus.$emit('sidebarCollapsed', false)
                document.getElementById('sidebar-main').classList.remove('icon-only')
                document.getElementById('content-wrapper').classList.replace('content-expand', 'content-shrink')
                window.$cookies.set('rc_sidebar_show', true, '-1')
            }
        }
    }
</script>