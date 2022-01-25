<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4>Server</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="text-center">Server Provider</div>
                    <div>
                        <loader v-if="fetching"></loader>
                        <canvas v-show="!fetching"
                            class="center-block"
                            id="serverproviderchart"
                            height="200"
                            width="200">
                        </canvas>
                    </div>
                </div>
                <br><br>
                <div class="row">
                    <div class="col-xs-4">
                        <div class="text-center">Web Server</div>
                        <div>
                            <loader v-if="fetching"></loader>
                            <canvas v-show="!fetching"
                                class="center-block"
                                id="webserverchart"
                                height="200"
                                width="200">
                            </canvas>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="text-center">Server Status</div>
                        <div>
                            <loader v-if="fetching"></loader>
                            <canvas v-show="!fetching"
                                class="center-block"
                                id="serveronlinechart"
                                height="200"
                                width="200">
                            </canvas>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="text-center">Git Usage</div>
                        <div>
                            <loader v-if="fetching"></loader>
                            <canvas v-show="!fetching"
                                class="center-block"
                                id="gitusagechart"
                                height="200"
                                width="200">
                            </canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import Chart from 'chart.js'
    import ChartDataLabels from 'chartjs-plugin-datalabels'

    export default {
        props: {
            url: { required: true }
        },

        data () {
            return {
                fetching: true,
                chart: null,
                optionsBar: {
                    legend: { display: false },
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return `${data.datasets[0].data[tooltipItem.index]}% (Total: ${data.datasets[0].dataRaw[tooltipItem.index]})`
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            formatter: function (value, context) {
                                let total = context.chart.data.datasets[0].dataRaw[context.dataIndex]
                                return value + '% (Total: ' + total + ')'
                            },
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                optionPie: {
                    legend: { display: true },
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return `${data.datasets[0].data[tooltipItem.index]}% (Total: ${data.datasets[0].dataRaw[tooltipItem.index]})`
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            color: '#ffffff',
                            formatter: function (value, context) {
                                let total = context.chart.data.datasets[0].dataRaw[context.dataIndex]
                                return value + '% (Total: ' + total + ')'
                            },
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                data: []
            }
        },

        mounted () {
            this.fetching = true
            this.data = []

            window.enterPage(this.url).then(response => {
                this.generateChart(response)
                this.fetching = false
            }).catch(() => { })
        },

        methods: {
            generateChart (resp) {
                this.data = resp.data

                this.chart = new Chart(document.getElementById('serverproviderchart'), {
                    type: 'horizontalBar',
                    data: this.data.provider,
                    options: this.optionsBar,
                    plugins: [ChartDataLabels]
                })

                this.chart = new Chart(document.getElementById('webserverchart'), {
                    type: 'pie',
                    data: this.data.webServer,
                    options: this.optionPie,
                    plugins: [ChartDataLabels]
                })

                this.chart = new Chart(document.getElementById('serveronlinechart'), {
                    type: 'pie',
                    data: this.data.server,
                    options: this.optionPie,
                    plugins: [ChartDataLabels]
                })

                this.chart = new Chart(document.getElementById('gitusagechart'), {
                    type: 'pie',
                    data: this.data.git,
                    options: this.optionPie,
                    plugins: [ChartDataLabels]
                })
            }
        }
    }
</script>
