<template>
    <div class="bg-white border rounded-t-md flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x justify-between">
        <div class="w-full md:w-3/12 py-4 px-7">
            <div class="flex space-x-3 items-center justify-between">
                <h6>Load</h6>
                <i class="rc rc-ln-cpu text-blue-500 text-2xl"></i>
            </div>

            <div v-if="isPro && !fetching">
                <h3 class="text-2xl">{{ summary.loadAvg }}</h3>
            </div>
            <loader v-else-if="fetching" class="my-4"></loader>
            <template v-else>
                <div class="flex space-x-2 py-2">
                    <i class="rc rc-gl-star text-yellow-500 text-lg" v-tooltip.right="'Require Pro subscription'"></i>
                    <p>This information is not available on your plan.</p>
                </div>
            </template>
        </div>

        <div class="w-full md:w-3/12 py-4 px-7">
            <div class="flex space-x-3 items-center justify-between">
                <h6>Memory</h6>
                <i class="rc rc-ln-ram text-blue-500 text-2xl"></i>
            </div>

            <div class="py-4" v-if="isPro && !fetching">
                <div class="progress mb-4">
                    <div class="progress-bar"
                        :class="progress.memory.color"
                        role="progressbar"
                        aria-valuenow="70"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :style="{ width: `${progress.memory.percentage}%` }">
                        {{ progress.memory.value }} GB
                    </div>
                </div>
                <p><span class="text-black-500">{{ progress.memory.value }} GB</span> used of <span class="text-black-500">{{ progress.memory.total }} GB</span></p>
            </div>
            <loader v-else-if="fetching" class="my-4"></loader>
            <template v-else>
                <div class="flex space-x-2 py-2">
                    <i class="rc rc-gl-star text-yellow-500 text-lg" v-tooltip.right="'Require Pro subscription'"></i>
                    <p>This information is not available on your plan.</p>
                </div>
            </template>
        </div>

        <div class="w-full md:w-3/12 py-4 px-7">
            <div class="flex space-x-3 items-center justify-between">
                <h6>Disk</h6>
                <i class="rc rc-ln-disk text-blue-500 text-2xl"></i>
            </div>

            <div class="py-4" v-if="isPro && !fetching">
                <div class="progress mb-4">
                    <div class="progress-bar"
                        :class="progress.disk.color"
                        role="progressbar"
                        aria-valuenow="70"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :style="{ width: `${progress.disk.percentage}%` }">
                        {{ progress.disk.value }} GB
                    </div>
                </div>
                <p><span class="text-black-500">{{ progress.disk.value }} GB</span> used of <span class="text-black-500">{{ progress.disk.total }} GB</span></p>
            </div>
            <loader v-else-if="fetching" class="my-4"></loader>
            <template v-else>
                <div class="flex space-x-2 py-2">
                    <i class="rc rc-gl-star text-yellow-500 text-lg" v-tooltip.right="'Require Pro subscription'"></i>
                    <p>This information is not available on your plan.</p>
                </div>
            </template>
        </div>

        <div class="w-full md:w-3/12 py-4 px-7">
            <div class="flex space-x-3 items-center justify-between">
                <h6>Uptime</h6>
                <i class="rc rc-ln-clock text-blue-500 text-2xl"></i>
            </div>

            <div v-if="isPro & !fetching">
                <h2 class="font-normal" v-show="!fetching">{{ summary.uptime }}</h2>
                <moment class="text-misc-700" type="date" :time="summary.created_at"></moment>
            </div>
            <loader v-else-if="fetching" class="my-4"></loader>
            <template v-else>
                <div class="flex space-x-2 py-2">
                    <i class="rc rc-gl-star text-yellow-500 text-lg" v-tooltip.right="'Require Pro subscription'"></i>
                    <p>This information is not available on your plan.</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            isPro: Boolean,
            server: Object
        },

        data () {
            return {
                fetching: true,
                summary: {
                    kernelVersion: null,
                    processorName: null,
                    totalCPUCore: null,
                    totalMemory: null,
                    freeMemory: null,
                    diskTotal: null,
                    diskFree: null,
                    loadAvg: null,
                    uptime: null
                },
                progress: {
                    memory: {
                        color: null,
                        value: null,
                        total: null,
                        percentage: null
                    },
                    disk: {
                        color: null,
                        value: null,
                        total: null,
                        percentage: null
                    }
                }
            }
        },

        filters: {
            truncate: function (text, length, clamp) {
                return (
                    text.slice(0, length) +
                    (length < text.length ? clamp || '...' : '')
                )
            }
        },

        created () {
            let that = this
            let summary = this.summary

            if (this.isPro) {
                window.enterPage(this.url, {}, { showAlert: false, showErrorAlert: false }).then(({ data }) => {
                    this.fetching = false
                    this.summary = data
                    this.calculateBar()
                }).catch(() => {
                    this.fetching = false
                    window.$.each(summary, function (key) {
                        that.summary[key] = 0
                    })
                })
            } else {
                this.fetching = false
            }
        },

        methods: {
            calculateBar () {
                // memory
                this.progress.memory = {
                    color: this.getBarColour(
                        this.summary.freeMemory,
                        this.summary.totalMemory
                    ),
                    value: (
                        this.summary.totalMemory - this.summary.freeMemory
                    ).toFixed(2),
                    total: this.summary.totalMemory.toFixed(2),
                    percentage: (
                        (this.summary.totalMemory - this.summary.freeMemory) /
                        this.summary.totalMemory *
                        100
                    ).toFixed(2)
                }

                // disk
                this.progress.disk = {
                    color: this.getBarColour(
                        this.summary.diskFree,
                        this.summary.diskTotal
                    ),
                    value: (this.summary.diskTotal - this.summary.diskFree).toFixed(
                        2
                    ),
                    total: this.summary.diskTotal.toFixed(2),
                    percentage: (
                        (this.summary.diskTotal - this.summary.diskFree) /
                        this.summary.diskTotal *
                        100
                    ).toFixed(2)
                }
            },

            getBarColour (free, max) {
                var percentage = ((max - free) / max * 100).toFixed(2)

                if (percentage <= 25) {
                    return 'progress-bar-success'
                } else if (percentage <= 50) {
                    return 'progress-bar-info'
                } else if (percentage <= 75) {
                    return 'progress-bar-warning'
                } else if (percentage <= 100) {
                    return 'progress-bar-danger'
                }
            }
        }
    }
</script>
