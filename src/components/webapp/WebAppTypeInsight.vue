<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4>Web application</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="center-block">
                            <p class="text-center">Type of Web Application</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-md-6">
                        <div>
                            <loader v-if="fetching"></loader>
                            <canvas v-show="!fetching"
                                class="center-block"
                                id="webchart"
                                height="200"
                                width="200">
                            </canvas>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <div>
                            <loader v-if="fetching"></loader>
                            <table v-else class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(type, index) in data.type.labels" :key="index">
                                        <td>{{ type }}</td>
                                        <td>{{ data.type.datasets[0].data[index] }}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="center-block">
                            <p class="text-center">WordPress vs Custom</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-md-6">
                        <div>
                            <loader v-if="fetching"></loader>
                            <canvas v-show="!fetching"
                                class="center-block"
                                id="wpcustomchart"
                                height="200"
                                width="200">
                            </canvas>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <div>
                            <loader v-if="fetching"></loader>
                            <table v-else class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(type, index) in data.wpcustom.labels" :key="index">
                                        <td>{{ type }}</td>
                                        <td>{{ data.wpcustom.datasets[0].data[index] }}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="center-block">
                            <p class="text-center">Script Installer</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-md-6">
                        <div>
                            <loader v-if="fetching"></loader>
                            <canvas v-show="!fetching"
                                class="center-block"
                                id="scriptinstallerchart"
                                height="200"
                                width="200">
                            </canvas>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <div>
                            <loader v-if="fetching"></loader>
                            <table v-else class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(type, index) in data.scriptinstaller.labels" :key="index">
                                        <td>{{ type }}</td>
                                        <td>{{ data.scriptinstaller.datasets[0].data[index] }}%</td>
                                    </tr>
                                </tbody>
                            </table>
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
                    legend: {
                        display: true,
                        position: 'right'
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return `${data.datasets[0].data[tooltipItem.index]}% (Total: ${data.datasets[0].dataRaw[tooltipItem.index]})`
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            display: 'auto',
                            color: '#000000',
                            anchor: 'end',
                            align: 'left',
                            clip: true,
                            formatter: function (value, context) {
                                let total = context.chart.data.datasets[0].dataRaw[context.dataIndex]
                                return value + '% (Total: ' + total + ')'
                            },
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false
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
                this.chart = new Chart(document.getElementById('webchart'), {
                    type: 'pie',
                    data: this.data.type,
                    options: this.options,
                    plugins: [ChartDataLabels]
                })

                this.chart = new Chart(('wpcustomchart'), {
                    type: 'pie',
                    data: this.data.wpcustom,
                    options: this.options,
                    plugins: [ChartDataLabels]
                })

                this.chart = new Chart(document.getElementById('scriptinstallerchart'), {
                    type: 'pie',
                    data: this.data.scriptinstaller,
                    options: this.options,
                    plugins: [ChartDataLabels]
                })
            }
        }
    }
</script>
