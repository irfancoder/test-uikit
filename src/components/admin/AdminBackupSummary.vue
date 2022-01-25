<template>
    <div>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="page-header">
                  <h1>Backup</h1>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4>Backup Summary</h4>
                    </div>
                    <div class="panel-body">
                        <loader v-if="working"></loader>
                        <div v-else class="grid grid-cols-2">
                            <div class="col-xs-6">
                                <h4><strong>Incremental</strong></h4>
                                <p>Total Site: {{ backupSummary.total }}</p>
                                <p>WebApp + DB Site: {{ backupSummary.both }}</p>
                                <p>WebApp Only Site: {{ backupSummary.webApp }}</p>
                                <p>Db Only Site: {{ backupSummary.database }}</p>
                            </div>
                            <div class="col-xs-6">
                                <h4><strong>Legacy</strong></h4>
                                <p>Total Instance: {{ backupSummary.legacy.total }}</p>
                                <p>Web App Instance: {{ backupSummary.legacy.webApp }}</p>
                                <p>Database Instance: {{ backupSummary.legacy.database }}</p>
                                <p>&nbsp;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4>Backup Data Summary</h4>
                    </div>
                    <div class="panel-body">
                        <loader v-if="working"></loader>
                        <div v-else class="grid grid-cols-2">
                            <div class="col-xs-6">
                                <h4><strong>Incremental</strong></h4>
                                <p>Total File: {{ backupDataSummary.totalFile }}</p>
                                <p>Deploying: {{ backupDataSummary.deploying }}</p>
                                <p>Uploading: {{ backupDataSummary.uploading }}</p>
                                <p>Completed: {{ backupDataSummary.completed }}</p>
                                <p>Failed: {{ backupDataSummary.failed }}</p>
                                <br><hr><br>
                                <p>Total Backup Size: {{ backupDataSummary.size }}</p>
                            </div>
                            <div class="col-xs-6">
                                <h4><strong>Legacy</strong></h4>
                                <p>Total File: {{ backupDataSummary.legacy.totalFile }}</p>
                                <p>Deploying: {{ backupDataSummary.legacy.deploying }}</p>
                                <p>Uploading: {{ backupDataSummary.legacy.uploading }}</p>
                                <p>Completed: {{ backupDataSummary.legacy.completed }}</p>
                                <p>Failed: {{ backupDataSummary.legacy.failed }}</p>
                                <br><hr><br>
                                <p>Total Backup Size: {{ backupDataSummary.legacy.size }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String
        },

        data () {
            return {
                working: true,
                backupSummary: {},
                backupDataSummary: {}
            }
        },

        created () {
            this.fetch()
        },

        methods: {
            fetch () {
                window.enterPage(this.url).then(({data}) => {
                    this.backupSummary = data.backupSummary
                    this.backupDataSummary = data.backupDataSummary
                    this.working = false
                })
            }
        }
    }
</script>
