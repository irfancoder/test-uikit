<template>
    <div v-if="!nodata" class="border rounded-md flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x bg-white">
        <div class="w-full md:w-4/12 py-4 px-7 relative" v-if="processed">
            <div class="flex space-x-3 items-center justify-between">
                <h6>Load</h6>
                <i class="rc rc-ln-cpu text-blue-500 text-2xl"></i>
            </div>
            <div class="flex flex-col space-y-4 items-center">
                <h2 class="text-3xl font-normal my-14">{{ load.average.toFixed(2) }}</h2>
            </div>
            <p class="absolute bottom-4"><i class="rc rc-ln-calendar rc-ln-semibold mr-2"></i> Last checked: <moment type="fromnow" :time="load.updated_at"></moment></p>
        </div>

        <div class="w-full md:w-4/12 py-4 px-7">
            <div class="flex space-x-3 items-center justify-between">
                <h6>Memory Usage</h6>
                <i class="rc rc-ln-ram text-blue-500 text-2xl"></i>
            </div>
            <canvas class="center-block mx-auto" id="latestMemoryChart" height="200" width="200"></canvas>
        </div>

        <div class="w-full md:w-4/12 py-4 px-7">
            <div class="flex space-x-3 items-center justify-between">
                <h6>Disk Usage</h6>
                <i class="rc rc-ln-disk text-blue-500 text-2xl"></i>
            </div>
            <canvas class="center-block mx-auto" id="latestDiskChart" height="200" width="200"></canvas>
        </div>
    </div>
</template>

<script>
    import Chart from 'chart.js'

    export default {
        props: {
            health: { required: true }
        },

        data () {
            return {
                nodata: false,
                processed: false
            }
        },

        computed: {
            memory() {
                return {
                    used: this.health.totalMemory - this.health.availableMemory,
                    available: this.health.availableMemory,
                    total: this.health.totalMemory
                }
            },
            diskSpace() {
                return {
                    used: this.health.totalDiskSpace - this.health.availableDiskSpace,
                    available: this.health.availableDiskSpace,
                    total: this.health.totalDiskSpace
                }
            },
            load() {
                return {
                    average: this.health.loadAverage,
                    updated_at: this.health.updated_at
                }
            }
        },

        mounted () {
            if (Object.keys(this.health).length === 0) {
                this.nodata = true
            } else {
                this.nodata = false

                // hack for momentjs
                this.processed = true

                this.buildChart('latestMemoryChart', this.memory)
                this.buildChart('latestDiskChart', this.diskSpace)
            }
        },

        methods: {
            chartOptions (options) {
                return {
                    type: 'doughnut',
                    data: {
                        labels: ['Used', 'Available'],
                        datasets: [{
                            backgroundColor: options.backgroundColor,
                            data: options.data
                        }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: true,
                        cutoutPercentage: 88,
                        scales: { yAxes: [], xAxes: [] },
                        elements: {
                            center: {
                                text: options.centerText,
                                color: '#202123',
                                sidePadding: 60
                            }
                        },
                        legend: {
                            position: 'bottom',
                            onClick: null,
                            labels: { usePointStyle: true }
                        },
                        tooltips: {
                            displayColors: false,
                            callbacks: { label: (tooltipItems, data) => data.labels[tooltipItems.index] + ': ' + data.datasets[0].data[tooltipItems.index].toFixed(2).toString() + 'MB' }
                        },
                        plugins: { crosshair: false }
                    }
                }
            },

            calculatePercentage: (total, value) => Math.round((parseFloat(value) / parseFloat(total)) * 100) + '%',

            buildChart(elementId, data) {
                new Chart(document.getElementById(elementId), this.chartOptions({
                    centerText: this.calculatePercentage(data.total, data.used),
                    data: [data.used, data.available],
                    backgroundColor: [this.getBackgroundColor(this.calculatePercentage(data.total, data.available).slice(0, -1)), '#ECF0F8']
                }))
            },

            getBackgroundColor: (percentage) => { // available percentage
                if (percentage <= 25) {
                    return '#E61D1D'
                } else if (percentage <= 50) {
                    return '#FFAB3B'
                } else if (percentage <= 75) {
                    return '#1654D1'
                } else if (percentage <= 100) {
                    return '#008060'
                }
            }
        }
    }
</script>
