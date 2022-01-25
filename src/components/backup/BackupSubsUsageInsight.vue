<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4>Backup</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="text-center">Backup user over user plan. Total Usage: {{ totalUser }}. Total Data: {{ totalUsage }}</div>
                    <div>
                        <loader v-if="fetching"></loader>
                        <canvas v-show="!fetching"
                            class="center-block"
                            id="backupchart"
                            height="200"
                            width="200">
                        </canvas>
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
                totalUser: null,
                totalUsage: null,
                chart: null,
                options: {
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
                data: []
            }
        },

        mounted () {
            this.fetching = true
            this.data = []

            window.enterPage(this.url).then(response => {
                this.totalUser = response.data.totalUser
                this.totalUsage = response.data.totalUsage
                this.generateChart(response)
                this.fetching = false
            }).catch(() => { })
        },

        methods: {
            generateChart (resp) {
                this.data = resp.data.graph
                this.chart = new Chart(document.getElementById('backupchart'), {
                    type: 'horizontalBar',
                    data: this.data,
                    options: this.options,
                    plugins: [ChartDataLabels]
                })
            }
        }
    }
</script>
