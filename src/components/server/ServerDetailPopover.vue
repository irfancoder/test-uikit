<template>
    <div class="relative cursor-pointer" @mouseover="mouseEnter()" @mouseleave="mouseLeave()">
        <a class="with-image" :href="url">
            <vps-icon :provider="server.provider" class="mb-2"></vps-icon>
            <div class="inline-block">
                <a class="font-medium text-black-500 hover:text-blue-500">{{ server.name }}</a>
                <ul class="flex space-x-2 text-misc-700 font-normal">
                    <li>{{ server.ipAddress }}</li>
                    <li>-</li>
                    <li>{{ location }}</li>
                </ul>
            </div>
        </a>

<!--        <template v-if="showPopover && MediaQuery('up', 'md')">-->
<!--            <div class="absolute bottom-0 mb-16 left-0 -ml-12 w-100 rounded shadow border border-solid bg-white z-50 px-7 py-3 transition-all duration-75" :class="{ 'hidden': !showPopover }">-->
<!--                <div class="flex items-center space-x-4">-->
<!--                    <div class="rounded-full h-10 w-10 bg-gray-50"></div>-->
<!--                    <div>-->
<!--                        <h6 class="font-medium text-black-500">{{ server.name }}</h6>-->
<!--                        <p :id="`copy-ip-${server.id}`">-->
<!--                            {{ server.ipAddress }}-->
<!--                        </p>-->
<!--                    </div>-->
<!--                </div>-->

<!--                <hr class="my-4">-->

<!--                <div>-->
<!--                    <p class="text-black-500 mb-2">A little description about the server.</p>-->
<!--                    <ul class="space-y-1">-->
<!--                        <li><i class="rc rc-ln-disk text-lg text-misc-100 rc-ln-semibold"></i><span>50GB Disk</span></li>-->
<!--                        <li><i class="rc rc-ln-ram text-lg text-misc-100 rc-ln-semibold"></i><span>2 GB Memory</span></li>-->
<!--                        <li><i class="rc rc-gl-ubuntu text-lg text-misc-100"></i><span>Ubuntu 20.04 LTS (Focal Fossa)</span></li>-->
<!--                    </ul>-->
<!--                </div>-->

<!--                <hr class="my-4">-->

<!--                <div>-->
<!--                    <p class="text-black-500 mb-2">10 webapps / 20 databases</p>-->
<!--                </div>-->
<!--            </div>-->
<!--        </template>-->
    </div>
</template>

<script>
    export default {
        props: {
            server: Object,
            url: String,
            location: String
        },

        // inject: ['MediaQuery', '$breakpoint'],

        data: () => ({
            showPopover: false
        }),

        methods: {
            mouseEnter: function() {
                this.showPopover = true
            },

            mouseLeave: function() {
                setTimeout(() => {
                    this.showPopover = false
                }, 75)
            }
        }
    }
</script>
