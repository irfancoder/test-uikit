<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4>Atomic deployment</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-xs-6">
                        <div class="text-center">Usage on business plan</div>
                        <div>
                            <loader v-if="fetching"></loader>
                            <canvas v-show="!fetching"
                                class="center-block"
                                id="atomicusagechart"
                                height="200"
                                width="200">
                            </canvas>
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="text-center">Number of active atomic project</div>
                        <div>
                            <loader v-if="fetching"></loader>
                            <canvas v-show="!fetching"
                                class="center-block"
                                id="atomicactivechart"
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
                options: {
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
                this.chart = new Chart(document.getElementById('atomicusagechart'), {
                    type: 'pie',
                    data: this.data.usage,
                    options: this.options,
                    plugins: [ChartDataLabels]
                })
                this.chart = new Chart(document.getElementById('atomicactivechart'), {
                    type: 'pie',
                    data: this.data.active,
                    options: this.options,
                    plugins: [ChartDataLabels]
                })
            }
        }
    }
</script>
