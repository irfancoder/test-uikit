<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <panel-header title="Net Sales">
                    <template #action>
                    <div class="btn-group filter pull-right">
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
                    </template>
                </panel-header>
                <div class="clearfix"></div>
                <!-- <h4 class="pull-left">Net Sales</h4> -->
            </div>
            <div class="panel-body">
                <loader v-if="fetching"></loader>
                <canvas
                    class="block h-110"
                    v-show="!fetching"
                    id="netSalesCTX"
                    role="img">
                    </canvas>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="pull-left">Overall Sales</h4>
                <div class="btn-group filter pull-right">
                    <a @click="changeView('daily')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'daily' ? 'active' : '' ]">Daily</a>
                    <a @click="changeView('monthly')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'monthly' ? 'active' : '' ]">Monthly</a>
                    <a @click="changeView('yearly')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'yearly' ? 'active' : '' ]">Yearly</a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="panel-body">
                <loader v-if="fetching"></loader>
                <canvas v-show="!fetching"
                    class="center-block"
                    id="overallSalesCTX"
                    height="300"
                    width="200"></canvas>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="pull-left">Refund</h4>
                <div class="btn-group filter pull-right">
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
                    id="refundCTX"
                    height="300"
                    width="200"></canvas>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="pull-left">Subscription Sales</h4>
                <div class="btn-group filter pull-right">
                    <a @click="changeView('daily')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'daily' ? 'active' : '' ]">Daily</a>
                    <a @click="changeView('monthly')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'monthly' ? 'active' : '' ]">Monthly</a>
                    <a @click="changeView('yearly')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'yearly' ? 'active' : '' ]">Yearly</a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="panel-body">
                <loader v-if="fetching"></loader>
                <canvas v-show="!fetching"
                    class="center-block"
                    id="subscriptionSalesCTX"
                    height="300"
                    width="200"></canvas>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="pull-left">Credit Sales</h4>
                <div class="btn-group filter pull-right">
                    <a @click="changeView('daily')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'daily' ? 'active' : '' ]">Daily</a>
                    <a @click="changeView('monthly')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'monthly' ? 'active' : '' ]">Monthly</a>
                    <a @click="changeView('yearly')"
                        type="button"
                        class="btn btn-primary"
                        :class="[ viewKey == 'yearly' ? 'active' : '' ]">Yearly</a>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="panel-body">
                <loader v-if="fetching"></loader>
                <canvas v-show="!fetching"
                    class="center-block"
                    id="onetimeSalesCTX"
                    height="300"
                    width="200"></canvas>
            </div>
        </div>
    </div>
</template>



<script>
    import Chart from 'chart.js'

    export default {
        props: {
            url: { required: true }
        },

        data () {
            return {
                fetching: true,
                viewKey: 'daily',
                netSalesChartLabel: [],
                netSalesChart: null,
                netSalesData: [],
                overallSalesChartLabel: [],
                overallSalesChart: null,
                overallSalesData: [],
                refundChartLabel: [],
                refundChart: null,
                refundData: [],
                subscriptionSalesChartLabel: [],
                subscriptionSalesChart: null,
                subscriptionSalesData: [],
                onetimeSalesChartLabel: [],
                onetimeSalesChart: null,
                onetimeSalesData: []
            }
        },

        computed: {
            chartOptions () {
                return {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'Payment',
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(27,163,156,0.5)',
                            borderColor: 'rgba(27,163,156,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(27,163,156,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 0,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(27,163,156,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: []
                        }]
                    },
                    options: {
                        animation: false,
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        }
                    }
                }
            },

            tooltips () {
                return {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            if (data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] === 0) {
                                return data.datasets[tooltipItems.datasetIndex].label + ': Data not available'
                            }
                            return data.datasets[tooltipItems.datasetIndex].label + ': ' + '$' + tooltipItems.yLabel.toString()
                        }
                    }
                }
            }
        },

        mounted () {
            this.fetchData()
        },

        methods: {
            changeView (key) {
                if (this.viewKey !== key) {
                    this.viewKey = key
                    this.netSalesChart.destroy()
                    this.overallSalesChart.destroy()
                    this.refundChart.destroy()
                    this.subscriptionSalesChart.destroy()
                    this.onetimeSalesChart.destroy()
                    this.fetchData()
                }
            },

            fetchData () {
                this.fetching = true

                this.netSalesChartLabel = []
                this.netSalesData = []
                this.overallSalesChartLabel = []
                this.overallSalesData = []
                this.refundChartLabel = []
                this.refundData = []
                this.subscriptionSalesChartLabel = []
                this.subscriptionSalesData = []
                this.onetimeSalesChartLabel = []
                this.onetimeSalesData = []

                window.enterPage(this.url + '?key=' + this.viewKey).then(response => {
                    this.generateChart(response)
                    this.fetching = false
                }).catch(() => { })
            },

            generateChart (response) {
                let data = response.data

                for (let i = 0; i < data.length; i++) {
                    this.netSalesChartLabel.push(data[i]['meta']['label'])
                    this.netSalesData.push(data[i]['items']['net'])

                    this.overallSalesChartLabel.push(data[i]['meta']['label'])
                    this.overallSalesData.push(data[i]['items']['all'])

                    this.refundChartLabel.push(data[i]['meta']['label'])
                    this.refundData.push(data[i]['items']['refund'])

                    this.subscriptionSalesChartLabel.push(data[i]['meta']['label'])
                    this.subscriptionSalesData.push(data[i]['items']['subscription'])

                    this.onetimeSalesChartLabel.push(data[i]['meta']['label'])
                    this.onetimeSalesData.push(data[i]['items']['onetime'])
                }

                // net
                let netChartOptions = JSON.parse(JSON.stringify(this.chartOptions))
                netChartOptions.data.datasets[0].data = this.netSalesData
                netChartOptions.data.labels = this.netSalesChartLabel
                netChartOptions.options.tooltips = this.tooltips
                this.netSalesChart = new Chart(document.getElementById('netSalesCTX'), netChartOptions)

                // overall
                let overallChartOptions = JSON.parse(JSON.stringify(this.chartOptions))
                overallChartOptions.data.datasets[0].data = this.overallSalesData
                overallChartOptions.data.labels = this.overallSalesChartLabel
                overallChartOptions.options.tooltips = this.tooltips
                this.overallSalesChart = new Chart(document.getElementById('overallSalesCTX'), overallChartOptions)

                // refund
                let refundChartOptions = JSON.parse(JSON.stringify(this.chartOptions))
                refundChartOptions.data.datasets[0].data = this.refundData
                refundChartOptions.data.labels = this.refundChartLabel
                refundChartOptions.options.tooltips = this.tooltips
                this.refundChart = new Chart(document.getElementById('refundCTX'), refundChartOptions)

                // subscription
                let subscriptionChartOptions = JSON.parse(JSON.stringify(this.chartOptions))
                subscriptionChartOptions.data.datasets[0].data = this.subscriptionSalesData
                subscriptionChartOptions.data.labels = this.subscriptionSalesChartLabel
                subscriptionChartOptions.options.tooltips = this.tooltips
                this.subscriptionSalesChart = new Chart(document.getElementById('subscriptionSalesCTX'), subscriptionChartOptions)

                // onetime
                let onetimeChartOptions = JSON.parse(JSON.stringify(this.chartOptions))
                onetimeChartOptions.data.datasets[0].data = this.onetimeSalesData
                onetimeChartOptions.data.labels = this.onetimeSalesChartLabel
                onetimeChartOptions.options.tooltips = this.tooltips
                this.onetimeSalesChart = new Chart(document.getElementById('onetimeSalesCTX'), onetimeChartOptions)
            }
        }
    }
</script>
