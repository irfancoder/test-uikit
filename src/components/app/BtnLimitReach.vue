<template>
    <div class="relative ml-auto" @mouseleave="mouseLeave">
        <div @mouseover="mouseEnter">
            <slot name="toggle"></slot>
        </div>

        <div v-if="notice" class="absolute bg-white rounded-6 shadow mt-3 z-10 md:w-110 right-0 text-left" @mouseover="mouseEnter">
            <div class="flex md:items-center">
                <img src="~img/illustration/no-access.svg" loading="lazy" class="w-16 h-16 flex-shrink-0 m-2" alt="no access"/>
                <div class="p-3">
                    <h5 class="font-semibold" v-html="title"></h5>
                    <p v-html="description"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: { default: 'This feature is not available on your plan' },
            description: { default: '<p>Please <a href="/settings/subscription" v-on:click.native="analyticEvent(\'Upgrade Plan\', \'Click\', \'Connect More Server\')">upgrade</a> your plan to enjoy more benefits.' }
        },

        data: () => ({
            notice: false,
            timeout: ''
        }),

        methods: {
            toggleNotice () {
                this.notice = !this.notice
            },

            mouseEnter () {
                clearTimeout(this.timeout)
                this.notice = true
            },

            mouseLeave () {
                this.timeout = setTimeout(() => {
                    this.notice = false
                }, 300)
            }
        }
    }
</script>
