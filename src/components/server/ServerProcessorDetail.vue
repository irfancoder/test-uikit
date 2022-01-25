<template>
    <li>
        <i class="rc rc-ln-cpu"></i>
        <span class="border-b border-dashed border-misc-100 pb-1 cursor-pointer" v-tooltip.right="data.processorName" v-if="isPro && !fetching">{{ data.totalCPUCore }} core</span>
        <loader v-else-if="fetching"></loader>
        <span v-else>N/A</span>
    </li>
</template>

<script>
    export default {
        props: {
            url: String,
            isPro: Boolean
        },

        data: () => ({
            fetching: true,
            data: {
                processorName: false,
                totalCPUCore: false
            }
        }),

        created () {
            let that = this

            if (this.isPro) {
                window.enterPage(this.url, {}, { showAlert: false, showErrorAlert: false }).then(({ data }) => {
                    this.fetching = false
                    this.data = data
                }).catch(() => {
                    this.fetching = false
                    window.$.each(this.data, function (key, value) {
                        that.data[key] = 0
                    })
                })
            } else {
                this.fetching = false
            }
        }
    }
</script>
