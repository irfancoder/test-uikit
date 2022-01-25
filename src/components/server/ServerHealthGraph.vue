<template>
    <div>
        <div class="panel panel-default" v-for="(tab, index) in tabs" :key="index">
            <div class="panel-heading">
                <panel-header :title="tab">
                    <template #action>
                        <div class="dropdown">
                            <button role="button"
                                class="dropdown-toggle btn btn-default"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                                <i class="rc rc-ln-calendar"></i><span class="hidden md:inline-block">{{ state.interval }}</span><i class="rc rc-gl-caret"></i>
                            </button>
                            <ul class="w-40 dropdown-menu dropdown-menu-right" role="menu">
                                <li v-for="(interval, index) in intervals" :key="index">
                                    <template v-if="viewDaily">
                                        <a role="button"
                                            :class="[ state.interval === interval ? 'text-blue-500 px-3 block py-1': 'btn btn-primary btn-act' ]"
                                            @click="state.interval=interval;reloadState()"><span>{{ interval }}</span>
                                        </a>
                                    </template>
                                    <template v-else>
                                        <a role="button" class="w-full flex py-1 px-3" :class="[{ 'text-black-500' : interval !== 'Hour' }]">
                                            <span class="opacity-80">{{ interval }}</span>
                                            <i class="rc rc-gl-star text-yellow-500 text-md ml-auto" v-if="interval !== 'Hour'" v-tooltip.right="'Require Business subscription'"></i>
                                        </a>
                                    </template>
                                </li>
                            </ul>
                        </div>
                    </template>
                </panel-header>
            </div>

            <div class="panel-body">
                <div>
                    <canvas :id="tab.toLowerCase()" width="100%" height="400" aria-label="memory usage chart" role="img"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Chart from 'chart.js'
    require('chartjs-plugin-crosshair')

    export default {
        props: {
            url: String,
            stats: Object,
            viewDaily: Boolean
        },

        data () {
            return {
                tabs: {
                    'memory': 'Memory',
                    'disk': 'Disk',
                    'load': 'Load'
                },
                dateRanges: [
                    'Previous day',
                    'Current day',
                    'Last 7 days',
                    'Last 30 days',
                    'Last 3 months',
                    'Last 6 months',
                    'Last 12 months'
                ],
                intervals: [
                    // 'Minute',
                    'Hour',
                    'Day',
                    'Week',
                    'Months'
                ],
                currentInterval: 'Day',
                currentDateRange: 'Current day',
                healthState: 'memory',
                state: {
                    health: 'memory',
                    interval: 'Hour'
                },
                charts: {
                    memory: null,
                    load: null,
                    disk: null
                }
            }
        },

        mounted () {
            // this.memoryUsageChart = new Chart(document.getElementById('memoryUsageChart'), this.chartOptions)
            this.reloadState()
        },

        methods: {
            reloadState() {
                if (this.state.interval === 'Hour') {
                    this.fetchData('hourly')
                } else {
                    this.fetchData('daily')

                    if (this.state.interval === 'Day') {
                        this.buildChartData(this.chartData.data, 'daily')
                    }

                    if (this.state.interval === 'Week') {
                        this.buildChartData(this.filterData(this.chartData.data, this.state.interval), 'daily')
                    }

                    if (this.state.interval === 'Months') {
                        this.buildChartData(this.filterData(this.chartData.data, this.state.interval), 'daily')
                    }
                }
                let charts = this.charts

                // should be improve.
                if (this.chartData) {
                    charts.memory ? this.updateChart('memory') : charts.memory = this.buildChart('memory')
                    charts.load ? this.updateChart('load') : charts.load = this.buildChart('load')
                    charts.disk ? this.updateChart('disk') : charts.disk = this.buildChart('disk')
                }

                this.charts = charts
            },

            calculatePercentage (obj) {
                return Math.round(parseFloat(obj[0]) / (parseFloat(obj[0]) + parseFloat(obj[1])) * 100) + '%'
            },

            fetchData (key) {
                if (this.chartData !== undefined && this.chartData?.type === key) {
                    return
                }

                window.enterPage(this.url + '?key=' + key).then(({data}) => {
                    this.chartData = { 'data': data }
                    this.buildChartData(data, key)
                    this.reloadState()
                })
            },

            buildChart(key) {
                return new Chart(document.getElementById(key), this.generateChartOptions({
                    'key': key,
                    'labels': this.chartData.labels,
                    'datasets': this.chartData[key]
                }))
            },

            updateChart(key) {
                if (key === 'memory') {
                    this.charts.memory.data.labels = this.chartData.labels
                    this.charts.memory.data.datasets[0].data = this.chartData[key]
                    this.charts.memory.update()
                } else if (key === 'load') {
                    this.charts.load.data.labels = this.chartData.labels
                    this.charts.load.data.datasets[0].data = this.chartData[key]
                    this.charts.load.update()
                } else if (key === 'disk') {
                    this.charts.disk.data.labels = this.chartData.labels
                    this.charts.disk.data.datasets[0].data = this.chartData[key]
                    this.charts.disk.update()
                }
            },

            buildChartData (data, key) {
                this.chartData = {
                    'data': this.chartData.data,
                    'type': key,
                    'labels': data.map(d => {
                        let date = new Date(d.meta.end)
                        if (key === 'hourly') {
                            let startLabel = window.moment.utc(d.meta.start).local().format('HH:mm')
                            let endLabel = window.moment.utc(d.meta.end).local().format('HH:mm')
                            return startLabel + '-' + endLabel
                        }

                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

                        if (typeof Date.prototype.toISOString === 'function') {
                            // ES5 ISO date parsing available
                            date = new Date((d.meta.end).replace(/\s/, 'T') + 'Z')
                        }

                        return monthNames[window.moment.utc(date).month()] + ' ' + window.moment.utc(date).date()
                    }),
                    'memory': data.map(d => ((d.item.totalMemory - d.item.availableMemory).toFixed(2))),
                    'disk': data.map(d => ((d.item.totalDiskSpace - d.item.availableDiskSpace).toFixed(2))),
                    'load': data.map(d => d.item.loadAverage)
                }
            },

            filterData (data, key) { // weekly
                let dates = data.map(d => d.meta.end)
                let groups = dates.reduce((acc, date) => {
                    if (key === 'Week') {
                        const yearWeek = `${window.moment(date).year()}-${window.moment(date).week()}`
                        if (!acc[yearWeek]) { acc[yearWeek] = [] }
                        acc[yearWeek].push(date)
                        return acc
                    } else if (key === 'Months') {
                        const yearMonth = `${window.moment(date).year()}-${window.moment(date).month()}`
                        if (!acc[yearMonth]) { acc[yearMonth] = [] }
                        acc[yearMonth].push(date)
                        return acc
                    } else if (key === 'Quarter') {
                        const quarter = `${window.moment(date).year()}-${window.moment(date).quarter()}`
                        if (!acc[quarter]) { acc[quarter] = [] }
                        acc[quarter].push(date)
                        return acc
                    }
                }, {})

                let temp = _.map(groups, group => group[group.length - 1])

                return _.filter(data, date => [...temp].includes(date.meta.end))
            },

            generateChartOptions (data) {
                const chartKey = data.key
                const self = this

                return {
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                data: data.datasets,
                                fill: true,
                                lineTension: 0,
                                borderWidth: 2,
                                borderColor: 'rgba(22, 106, 220, 1)',
                                backgroundColor: 'rgba(22, 106, 220, 0.05)',
                                pointBorderColor: 'rgba(0, 0, 0, 0)',
                                pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
                                pointHoverBorderWidth: 2,
                                pointHoverRadius: 6,
                                pointHoverBackgroundColor: 'rgba(22, 106, 220, 1)'
                                // pointRadius: 0
                            }
                        ]
                    },
                    options: {
                        animation: false,
                        responsive: true,
                        maintainAspectRatio: false,
                        events: ['mousemove'],
                        data: {
                            datasets: [
                                { interpolate: true }
                            ]
                        },
                        tooltips: {
                            mode: 'interpolate',
                            intersect: false,
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            titleFontColor: '#202123',
                            titleFontStyle: 'semibold',
                            titleMarginBottom: 8,
                            xPadding: 8,
                            yPadding: 8,
                            cornerRadius: 4,
                            bodyFontColor: '#727A8E',
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    let label = tooltipItem.value || ''

                                    if (label && chartKey !== 'load') {
                                        label += ' MB'
                                    }

                                    return label
                                }
                            }
                        },
                        legend: { display: false },
                        scales: {
                            xAxes: [
                                {
                                    gridLines: { display: false },
                                    ticks: { fontColor: '#646e78' }
                                }
                            ],

                            yAxes: [
                                {
                                    gridLines: {
                                        display: true,
                                        borderDash: [2, 2],
                                        zeroLineWidth: 1,
                                        drawBorder: false
                                    },
                                    ticks: {
                                        fontColor: '#646e78',
                                        padding: 24,
                                        maxTicksLimit: 8,
                                        beginAtZero: true,
                                        callback: function(tick, index, values) {
                                            let label = self.numberWithCommas(tick) || ''

                                            if (label && chartKey !== 'load') {
                                                label += ' MB'
                                            }

                                            return label
                                        }
                                    }
                                }
                            ]
                        },
                        plugins: {
                            crosshair: {
                                line: {
                                    color: '#CFD6E4',
                                    width: 1
                                }
                            }
                        }
                    }
                }
            },
            numberWithCommas (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
        }
    }
</script>
