<template>
    <div :class="`fixed bottom-0 right-0 h-16 z-10 px-4 flex items-center justify-end transition-all duration-300 ease-out ${offsetLeft} bg-white border-t md:px-8 3xl:w-full 3xl:left-0 3xl:mx-auto 3xl:max-w-screen-2xl 3xl:border-r 3xl:border-l`">
        <!-- <p class="hidden md:inline">{{ title }}</p> -->
        <div class="flex gap-2 md:block w-full action-slot md:w-auto md:space-x-2">
            <a href="javascript:history.back()" class="hidden btn btn-default md:inline-block" v-if="showCancelButton">{{ cancelButtonTitle }}</a>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            // title: { type: String, default: 'Unsave title, can change title here' },
            cancelButtonTitle: { type: String, default: 'Cancel' },
            cancelButtonUrl: { type: String, default: 'Unsave title' },
            showCancelButton: { type: Boolean, default: true },
            noOffsetLeft: { type: Boolean, default: false }
        },

        data () {
            return {
                offsetLeft: 'md:left-48 lg:left-64'
            }
        },

        mounted () {
            if (this.noOffsetLeft) {
                this.offsetLeft = 'left-0'
            } else {
                this.setSize()
                // window.addEventListener('resize', this.setSize)
                window.bus.$on('sidebarCollapsed', (isCollapsed) => {
                    if (isCollapsed) this.offsetLeft = 'left-16'
                    else this.offsetLeft = 'left-0 md:left-48 lg:left-64'
                })
            }
        },

        methods: {
            setSize () {
                let main = document.getElementById('content-wrapper')
                if (main.offsetLeft < 256) this.offsetLeft = 'left-0 sm:left-16'
                else if (main.offsetLeft < 320) this.offsetLeft = 'left-0 md:left-48 lg:left-64'
                else this.offsetLeft = 'left-0 md:left-80'
                // let obj = {
                //     left: `${main.offsetLeft}px`,
                //     right: '0'
                //     // width: `calc(100% - ${main.offsetLeft}px)`
                // }
                // this.style.left = `${main.offsetLeft}px`
                // this.style.right = '0'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .btn-primary {
        @apply block w-full md:inline md:w-auto;
    }
</style>
