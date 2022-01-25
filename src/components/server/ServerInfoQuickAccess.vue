<template>
    <div class="rounded-md border shadow-sm bg-white p-4 mb-2 -ml-2 -mr-3 group" @mouseleave="mouseLeave" @mouseover="mouseEnter">
        <div class="flex">
            <vps-icon :provider="server.provider" class="self-start"></vps-icon>
            <div class="ml-3">
                <h6 class="font-medium">{{ server.name }}</h6>
                <div>
                    <copy-text id="ipAddress">
                        <template #content>
                            <span id="ipAddress" class="text-misc-700">{{ server.ipAddress }}</span>
                        </template>
                    </copy-text>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            server: Object,
            url: String,
            os: { type: String, default: 'N/A' }
        },

        data: () => ({
            collapse: false,
            timeout: ''
        }),

        methods: {
            mouseEnter () {
                clearTimeout(this.timeout)
            },

            mouseLeave () {
                this.timeout = setTimeout(() => {
                    this.collapse = false
                }, 500)
            },
            roundOff(value, decimal = 0) {
                return value.toFixed(decimal)
            }

        }
    }
</script>
