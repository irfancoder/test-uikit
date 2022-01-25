<template>
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4>Admin Tool Results</h4>
                </div>
                <div class="panel-body">
                    <p v-if="scriptName == null">Listening...</p>
                    <div v-else>
                        <p class="text-center">Script: {{ scriptName }}</p>
                        <div class="progress">
                            <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100" :style="`width: ${percentage}%`">
                                {{ percentage }}%
                            </div>
                        </div>

                        <br><br><br><br>

                        <p>Failed:</p>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Name</th>
                                    <th>IP Address</th>
                                    <th>Exception</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(fail, index) in failed" :key="index">
                                    <td>{{ fail.id }}</td>
                                    <td>{{ fail.name }}</td>
                                    <td>{{ fail.ipAddress }}</td>
                                    <td>{{ fail.exception }}</td>
                                </tr>
                            </tbody>
                        </table>

                        {{ failedId }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                scriptName: null,
                completed: {
                    scriptName: null,
                    index: 0,
                    total: 0
                },
                percentage: 0,
                failed: [],
                failedId: []
            }
        },

        created () {
            window.Echo.private('admin').listen('.admin-script-succeed', data => {
                this.parse(data)
            })

            window.Echo.private('admin').listen('.admin-script-failed', data => {
                this.parse(data)
                this.failed.push({
                    id: data.id,
                    name: data.name,
                    ipAddress: data.ipAddress,
                    exception: data.exception
                })
                this.failedId.push(data.id)
            })
        },

        methods: {
            parse (data) {
                this.scriptName = data.scriptName
                this.completed.index = data.index
                this.completed.total = data.total

                this.percentage = data.index / data.total * 100
            }
        }
    }
</script>
