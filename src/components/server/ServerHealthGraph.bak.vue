<template>
    <div>
        <div class="panel panel-default healthGraph">
            <div class="panel-heading">
                <h4 class="pull-left">Server Load</h4>
                <div v-if="viewDaily" class="btn-group filter pull-right">
                    <a @click="changeView('hourly')" type="button" class="btn btn-primary" :class="[ viewKey == 'hourly' ? 'active' : '' ]">Hourly</a>
                    <a @click="changeView('daily')" type="button" class="btn btn-primary" :class="[ viewKey == 'daily' ? 'active' : '' ]">Daily</a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="panel-body">
                <loader v-if="working"></loader>
                <canvas v-show="!working" id="serverLoadChart" height="300" width="800"></canvas>
            </div>
        </div>

        <div class="panel panel-default healthGraph">
            <div class="panel-heading">
                <h4 class="pull-left">Memory Usage</h4>
                <div v-if="viewDaily" class="btn-group filter pull-right">
                    <a @click="changeView('hourly')" type="button" class="btn btn-primary" :class="[ viewKey == 'hourly' ? 'active' : '' ]">Hourly</a>
                    <a @click="changeView('daily')" type="button" class="btn btn-primary" :class="[ viewKey == 'daily' ? 'active' : '' ]">Daily</a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="panel-body">
                <loader v-if="working"></loader>
                <canvas v-show="!working" id="memoryUsageChart" height="300" width="800"></canvas>
            </div>
        </div>

        <div class="panel panel-default healthGraph">
            <div class="panel-heading">
                <h4 class="pull-left">Disk Space Usage</h4>
                <div v-if="viewDaily" class="btn-group filter pull-right">
                    <a @click="changeView('hourly')" type="button" class="btn btn-primary" :class="[ viewKey == 'hourly' ? 'active' : '' ]">Hourly</a>
                    <a @click="changeView('daily')" type="button" class="btn btn-primary" :class="[ viewKey == 'daily' ? 'active' : '' ]">Daily</a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="panel-body">
                <loader v-if="working"></loader>
                <canvas v-show="!working" id="diskSpaceUsageChart" height="300" width="800"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
    import Chart from 'chart.js'

    export default {
        props: {
            url: String,
            viewDaily: Boolean
        },

        data () {
            return {
                working: true,
                viewKey: 'hourly',
                serverLoadChart: null,
                memoryUsageChart: null,
                diskSpaceUsageChart: null,
                chartLabel: [],
                serverLoadData: [],
                memoryUsageData: [],
                totalMemoryData: [],
                diskSpaceUsageData: [],
                totalDiskSpaceData: []
            }
        },

        computed: {
            chartOptions () {
                return {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'Used',
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.5)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 0,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: []
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    autoSkip: false
                                }
                            }]
                        }
                    }
                }
            },

            tooltipMB () {
                return {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            if (data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] === 0) {
                                return data.datasets[tooltipItems.datasetIndex].label + ': Data not available'
                            }
                            return data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel.toString() + 'MB'
                        }
                    }
                }
            },

            dataSet2 () {
                return {
                    label: 'Total',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(255,99,132,1)',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                }
            }
        },

        created () {
            this.fetchData()
        },

        methods: {
            changeView (key) {
                if (this.viewKey !== key) {
                    this.viewKey = key
                    this.analyticEvent('Health', 'Click', 'View ' + key)

                    this.serverLoadChart.destroy()
                    this.memoryUsageChart.destroy()
                    this.diskSpaceUsageChart.destroy()
                    this.fetchData()
                }
            },

            fetchData () {
                this.working = true

                this.chartLabel = []
                this.serverLoadData = []
                this.memoryUsageData = []
                this.diskSpaceUsageData = []
                this.totalMemoryData = []
                this.totalDiskSpaceData = []

                window.enterPage(this.url + '?key=' + this.viewKey).then(({data}) => {
                    if (this.viewKey === 'hourly') {
                        this.generateHourlyChart(data)
                    } else if (this.viewKey === 'daily') {
                        this.generateDailyChart(data)
                    }

                    this.working = false
                })
            },

            generateHourlyChart (data) {
                for (let i = 0; i < data.length; i++) {
                    let startLabel = window.moment.utc(data[i].meta.start).local().format('HH:mm')
                    let endLabel = window.moment.utc(data[i].meta.end).local().format('HH:mm')
                    this.chartLabel.push(startLabel + '-' + endLabel)
                    this.pushData(data, i)
                }

                this.generateChart()
            },

            generateDailyChart (data) {
                for (let i = 0; i < data.length; i++) {
                    let label = window.moment.utc(data[i].meta.end).local().format('DD MMM')
                    this.chartLabel.push(label)
                    this.pushData(data, i)
                }

                this.generateChart()
            },

            pushData (data, i) {
                this.serverLoadData.push(data[i].item.loadAverage)
                this.memoryUsageData.push((data[i].item.totalMemory - data[i].item.availableMemory).toFixed(2))
                this.diskSpaceUsageData.push((data[i].item.totalDiskSpace - data[i].item.availableDiskSpace).toFixed(2))
                this.totalMemoryData.push(data[i].item.totalMemory)
                this.totalDiskSpaceData.push(data[i].item.totalDiskSpace)
            },

            generateChart () {
                let serverLoadChartOption = JSON.parse(JSON.stringify(this.chartOptions))
                serverLoadChartOption.data.datasets[0].data = this.serverLoadData
                serverLoadChartOption.data.datasets[0].label = 'Load'
                serverLoadChartOption.options.tooltips = {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            if (data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] === 0) {
                                return data.datasets[tooltipItems.datasetIndex].label + ': Data not available'
                            }
                            return data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel
                        }
                    }
                }
                serverLoadChartOption.data.labels = this.chartLabel
                this.serverLoadChart = new Chart(window.$('#serverLoadChart'), serverLoadChartOption)

                let memoryUsageChartOption = JSON.parse(JSON.stringify(this.chartOptions))
                memoryUsageChartOption = this.generateChartRepeat(memoryUsageChartOption, this.memoryUsageData, this.totalMemoryData)
                this.memoryUsageChart = new Chart(window.$('#memoryUsageChart'), memoryUsageChartOption)

                let diskspaceUsageChartOption = JSON.parse(JSON.stringify(this.chartOptions))
                diskspaceUsageChartOption = this.generateChartRepeat(diskspaceUsageChartOption, this.diskSpaceUsageData, this.totalDiskSpaceData)
                this.diskSpaceUsageChart = new Chart(window.$('#diskSpaceUsageChart'), diskspaceUsageChartOption)
            },

            generateChartRepeat (options, usage, total) {
                options.data.datasets[0].data = usage
                options.data.labels = this.chartLabel
                options.options.tooltips = this.tooltipMB
                this.dataSet2.data = total
                options.data.datasets[1] = JSON.parse(JSON.stringify(this.dataSet2))

                return options
            }
        }
    }
</script>
