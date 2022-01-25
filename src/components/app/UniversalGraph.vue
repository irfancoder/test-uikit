<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="pull-left">{{ title }}</h4>
            <div class="btn-group filter pull-right">
                <a @click="changeView('hourly')"
                    type="button"
                    class="btn btn-success"
                    :class="[ viewKey == 'hourly' ? 'active' : '' ]">Hourly</a>
                <a @click="changeView('daily')"
                    type="button"
                    class="btn btn-success"
                    :class="[ viewKey == 'daily' ? 'active' : '' ]">Daily</a>
                <a @click="changeView('monthly')"
                    type="button"
                    class="btn btn-success"
                    :class="[ viewKey == 'monthly' ? 'active' : '' ]">Monthly</a>
                <a @click="changeView('yearly')"
                    type="button"
                    class="btn btn-success"
                    :class="[ viewKey == 'yearly' ? 'active' : '' ]">Yearly</a>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="panel-body">
            <loader v-if="fetching"></loader>
            <canvas v-show="!fetching"
                class="center-block"
                ref="mychart"
                height="300"
                width="800">
            </canvas>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js'

export default {
    props: {
        title: { default: 'Title needed' },
        urls: []
    },

    data () {
        return {
            done: 0,
            viewKey: 'hourly',
            chart: null,
            chartOptions: {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: this.displayLegend()
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        }
    },

    watch: {
        fetching (val) {
            if (val === false) {
                if (this.chart === null) {
                    this.chart = new Chart(this.$refs.mychart, this.chartOptions)
                } else {
                    this.chart.update()
                }
            }
        }
    },

    computed: {
        fetching () {
            if (this.done !== this.urls.length) {
                return true
            }

            return false
        }
    },

    created () {
        this.evalURLS()
    },

    methods: {
        changeView (key) {
            if (this.viewKey !== key) {
                this.done = 0
                this.viewKey = key
                this.chartOptions.data.labels = []
                this.chartOptions.data.datasets = []
                this.evalURLS()
            }
        },

        evalURLS () {
            this.urls.forEach((endpoint, index) => {
                endpoint.index = index
                this.parse(endpoint)
            })
        },

        parse (endpoint) {
            if (endpoint.query === undefined) {
                endpoint.query = {
                    key: this.viewKey
                }
            } else {
                endpoint.query.key = this.viewKey
            }

            window.enterPage(endpoint.url + '?' + this.arrayToParams(endpoint.query)).then(({data}) => {
                this.generateChart(endpoint, data)
            })
        },

        generateChart(endpoint, data) {
            let chartData = []

            for (let i = 0; i < data.length; i++) {
                // if index tak populate lagi, baru masuk dalam label
                if (this.chartOptions.data.labels[i] === undefined) {
                    this.chartOptions.data.labels.push(data[i]['meta']['label'])
                }
                chartData.push(data[i]['items']['total'])
            }

            let color = this.random_rgb()

            let dataset = {
                label: endpoint.label,
                borderColor: color,
                backgroundColor: color,
                data: chartData,
                fill: false,
                lineTension: 0.1
            }

            this.chartOptions.data.datasets[endpoint.index] = dataset

            // chartOptions.options.tooltips = this.tooltips

            this.done++
        },

        arrayToParams(arr) {
            var parameters = []
            for (var property in arr) {
                if (arr.hasOwnProperty(property)) {
                    parameters.push(encodeURI(property + '=' + arr[property]))
                }
            }

            return parameters.join('&')
        },

        random_rgb() {
            var o = Math.round; var r = Math.random; var s = 255
            return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')'
        },

        displayLegend () {
            return this.urls.length > 1
        }
    }
}
</script>