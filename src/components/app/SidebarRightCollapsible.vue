<template>
    <div class="fixed right-0 h-full border-l sidebar-right top-16 text-black-500 transition-all duration-300" :class="[ collapsible ? 'w-full md:w-72 xl:w-84' : 'w-0' ]" id="sidebar-right" ref="sidebarRight">
        <button @click="toggleCollapseSidebar()" class="bg-white border w-10 h-10 rounded-l absolute z-20 top-0 right-0 mt-4">
            <i :class="['rc rc-ln-semibold', collapsible ? 'rc-ln-move-right' : 'rc-ln-move-layer-left' ]"></i>
        </button>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            title: { type: String }
        },

        data: () => ({
            collapsible: true
        }),
    
        inject: ['MediaQuery', '$breakpoint'],

        watch: {
            breakpoint: {
                immediate: true,
                handler () {
                    if (this.MediaQuery('between', ['xs', 'lg'])) {
                        window.$cookies.set(`${this.title}_collapsible`, 'hide', '4m')
                        this.collapsible = false
                    } else {
                        this.collapsible = window.$cookies.get(`${this.title}_collapsible`) !== 'hide'
                    }
                }
            }
        },

        computed: {
            breakpoint () {
                return this.$breakpoint()
            }
        },
    
        methods: {
            toggleCollapseSidebar () {
                this.collapsible ? window.$cookies.set(`${this.title}_collapsible`, 'hide', '4m') : window.$cookies.remove(`${this.title}_collapsible`)
                this.collapsible = !this.collapsible
                window.bus.$emit('reRenderWrapperWidth', { collapsible: this.collapsible })
            }
        }
    }
</script>
