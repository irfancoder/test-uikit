<template>
    <div class="panel panel-default">
        <div class="flex items-center justify-between panel-heading py-3 space-y-0">
            <h4>Traffic Stats</h4>
            <div class="dropdown" v-if="can">
                <button role="button"
                    class="dropdown-toggle btn btn-default"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <i class="rc rc-ln-calendar"></i><span class="hidden md:inline-block">{{ state.interval }}</span><i class="rc rc-gl-caret"></i>
                </button>
                <ul class="w-40 dropdown-menu dropdown-menu-right" role="menu">
                    <li v-for="(interval, index) in intervals" :key="index">
                        <template v-if="ableToViewMonthlyGraph">
                            <a role="button"
                                :class="[ state.interval === interval ? 'text-blue-500 px-3 block py-1': 'btn btn-primary btn-act' ]"
                                @click="state.interval=interval;reloadState()"><span>{{ interval }}</span>
                            </a>
                        </template>
                        <template v-else>
                            <a role="button" class="w-full flex py-1 px-3" :class="[{ 'text-black-500' : interval !== 'Day' }]">
                                <span class="opacity-80">{{ interval }}</span>
                                <i class="rc rc-gl-star text-yellow-500 text-md ml-auto" v-if="interval !== 'Day'" v-tooltip.right="'Require Business subscription'"></i>
                            </a>
                        </template>
                    </li>
                </ul>
            </div>
        </div>

        <div class="panel-body">
            <div class="alert alert-warning" v-if="!can">
                <div class="flex flex-col md:flex-row justify-between w-full">
                    <div class="mb-2 md:mb-0">
                        <p>You currently don't have access to traffic stats data. Please upgrade your plan to enjoy more benefits.</p>
                    </div>

                    <a href="/settings/subscription" role="button" class="btn btn-primary" @click="analyticEvent('Upgrade Plan', 'Click', 'Webapp Traffic Stats')">Upgrade plan</a>
                </div>
            </div>

            <div :class="can ? '' : 'blur'">
                <div class="flex justify-between mb-7 ">
                    <div>
                        <p>Current usage</p>
                        <h3 class="text-xl font-medium"> {{ dataTransfer.last }} </h3>
                    </div>

                    <div>
                        <p>Yesterday</p>
                        <h3 class="text-xl font-medium"> {{ dataTransfer.yesterday }} </h3>
                    </div>

                    <div>
                        <p>This month</p>
                        <h3 class="text-xl font-medium"> {{ dataTransfer.thisMonth }} </h3>
                    </div>
                </div>

                <div >
                    <canvas id="traficStatsChart" width="100%" height="400" aria-label="memory usage chart" role="img"></canvas>
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
            dataTransfer: Object,
            ableToViewMonthlyGraph: Boolean,
            can: Boolean
        },
        data () {
            return {
                intervals: [
                    // 'Minute',
                    // 'Hour',
                    'Day',
                    'Week',
                    'Months'
                    // 'Quarter'
                ],
                currentInterval: 'Day',
                currentDateRange: 'Current day',
                state: {
                    interval: 'Day'
                }
            }
        },

        computed: {
            chartOptions: function () {
                return {
                    type: 'line',
                    data: {
                        labels: ['Sept 7', 'Sept 8', 'Sept 9', 'Sept 10', 'Sept 11', 'Sept 12', 'Sept 13'],
                        datasets: [
                            {
                                data: [200, 150, 300, 50, 500, 400, 1000],
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
                        responsive: true,
                        maintainAspectRatio: false,
                        events: ['mousemove'],
                        data: {
                            datasets: [
                                {
                                    interpolate: true
                                }
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

                                    if (label) {
                                        label += ' B'
                                    }

                                    return label
                                }
                            }
                        },
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [
                                {
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        fontColor: '#646e78'
                                    }
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
                                        maxTicksLimit: 8
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
            }
        },

        mounted () {
            // this.traficStatsChart = new Chart(document.getElementById('traficStatsChart'), this.chartOptions)
            if (this.can) {
                this.reloadState()
            } else {
                // fake data here
            }
        },

        methods: {
            reloadState() {
                if (this.state.interval === 'Day') {
                    this.fetchData('daily')

                    if (this.chartData) {
                        this.buildChartData(this.chartData.data, 'daily')
                    }
                }

                if (this.state.interval === 'Months') {
                    this.fetchData('monthly')
                    if (this.chartData) {
                        this.buildChartData(this.chartData.data, 'monthly')
                    }
                }

                if (this.state.interval === 'Week') {
                    this.fetchData('daily')

                    if (this.chartData) {
                        this.buildChartData(this.filterData(this.chartData.data), 'daily')
                    }
                }

                if (this.chartData) {
                    if (!this.traficStatsChart) {
                        this.traficStatsChart = new Chart(document.getElementById('traficStatsChart'), this.generateChartOptions({
                            'labels': this.chartData.labels,
                            'datasets': this.chartData.transfer
                        }))
                    }

                    this.traficStatsChart.data.labels = this.chartData.labels
                    this.traficStatsChart.data.datasets[0].data = this.chartData.transfer
                    this.traficStatsChart.update()
                }
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
                    'transfer': data.map(d => d.item.transfer)
                }
            },

            filterData (data) { // weekly
                let dates = data.map(d => d.meta.end)
                let groups = dates.reduce((acc, date) => {
                    const yearWeek = `${window.moment(date).year()}-${window.moment(date).week()}`
                    if (!acc[yearWeek]) { acc[yearWeek] = [] }
                    acc[yearWeek].push(date)
                    return acc
                }, {})

                let temp = _.map(groups, group => group[group.length - 1])

                return _.filter(data, date => [...temp].includes(date.meta.end))
            },

            generateChartOptions (data) {
                return {
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                data: data.datasets,
                                fill: true,
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
                                {
                                    interpolate: true
                                }
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
                                    const ranges = [
                                        { divider: 1e12, suffix: ' TB' },
                                        { divider: 1e9, suffix: ' GB' },
                                        { divider: 1e6, suffix: ' MB' },
                                        { divider: 1e3, suffix: ' kB' }
                                    ]

                                    if (label) {
                                        const numValue = parseFloat(label)
                                        if (!isNaN(numValue)) {
                                            label += ' B'

                                            for (let i = 0; i < ranges.length; i++) {
                                                if (numValue >= ranges[i].divider) {
                                                    label = (numValue / ranges[i].divider).toFixed(2) + ranges[i].suffix
                                                    break
                                                }
                                            }
                                        }
                                    }

                                    return label
                                }
                            }
                        },
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [
                                {
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        fontColor: '#646e78'
                                    }
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
                                        callback: function(label, index, labels) {
                                            const ranges = [
                                                { divider: 1e12, suffix: ' TB' },
                                                { divider: 1e9, suffix: ' GB' },
                                                { divider: 1e6, suffix: ' MB' },
                                                { divider: 1e3, suffix: ' kB' }
                                            ]

                                            let formattedLabel = label + ' B'

                                            for (let i = 0; i < ranges.length; i++) {
                                                if (label >= ranges[i].divider) {
                                                    formattedLabel = (label / ranges[i].divider) + ranges[i].suffix
                                                    break
                                                }
                                            }
                                            return formattedLabel
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
            }
        }
    }
</script>

<style lang="scss" scoped>

.blur {
    -webkit-filter: blur(5px);
    -moz-filter: blur(5px);
    -o-filter: blur(5px);
    -ms-filter: blur(5px);
    filter: blur(5px);
}

</style>
