<template>
    <div>
        <div class="panel panel-default" v-for="(groups, index) in groupedData" :key="index">
            <div class="flex justify-between panel-heading">
                <h4>Task: {{ groups[0].name }}</h4>
                <deployment-status :status="groupedStatus(index)" class="mt-0"></deployment-status>
            </div>

            <div class="panel-table table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th width="20%">Web Application</th>
                            <th width="20%">Server</th>
                            <th width="15%" class="text-center">Status</th>
                            <th class="text-right">Time Taken</th>
                            <th width="15%">Log</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="groups.length > 0">
                            <tr v-for="(deploymentData, index2) in groups" :key="index2">
                                <td>{{ deploymentData.web_application.name }}</td>
                                <td>{{ deploymentData.web_application.server.name }} ({{ deploymentData.web_application.server.ipAddress }})</td>
                                <td>
                                    <deployment-status :status="deploymentData.status"></deployment-status>
                                </td>
                                <td class="text-right">{{ deploymentData.elapsedSeconds }}</td>

                                <td class="text-center">
                                    <a v-if="deploymentData.haveOutput" :href="`/atomicdeployment/projects/${projectId}/deployments/${deploymentId}/deploymentdata/${deploymentData.id}/log`">
                                        View
                                    </a>
                                    <span v-else>-</span>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>There is no deployment for task {{ groups[0].name }}</tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            projectId: Number,
            deploymentId: Number,
            deploymentDatas: Array
        },

        computed: {
            groupedData: function () {
                return window._.groupBy(this.deploymentDatasModified, 'batch')
            },
            groupedStatus: function () {
                const groupedData = this.groupedData
                return function (batch) {
                    const deploymentData = groupedData[batch]

                    if (window._.every(deploymentData, {'status': 'COMPLETED'})) {
                        return 'completed'
                    } else if (window._.find(deploymentData, {'status': 'FAILED'})) {
                        return 'failed'
                    }

                    return 'deploying'
                }
            }
        },

        data () {
            return {
                deploymentDatasModified: []
            }
        },

        created () {
            this.deploymentDatasModified = this.deploymentDatas

            window.Echo.private('atomicproject.' + this.projectId).listen('.RefreshDeploymentData', data => {
                this.assignSingleDeploymentData(data)
            })
        },

        destroyed () {
            window.Echo.leave('atomicproject.' + this.projectId)
        },

        methods: {
            assignSingleDeploymentData (data) {
                let replaceKey = window._.findKey(this.deploymentDatasModified, obj => {
                    return obj.id === data.deploymentDataId
                })

                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        this.deploymentDatasModified[replaceKey][key] = data[key]
                    }
                }
            }
        }
    }
</script>
