<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Process Name</th>
                <th class="text-right">Status</th>
                <th>Pid</th>
                <th>Uptime</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(stats, index) in getStats(job)" :key="index">
                <td>{{ stats.process }}</td>
                <td class="text-right">
                    <span v-if="stats.status === 'RUNNING'" class="capitalize badge badge-success">{{ stats.status }}</span>
                    <span v-else class="capitalize badge badge-danger">{{ stats.status }}</span>
                </td>
                <td>{{ stats.pid }}</td>
                <td>{{ stats.uptime }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        props: {
            serverId: Number,
            job: Object,
            statusUrl: String
        },

        data () {
            return {
                fetchingStatus: true,
                jobStatus: {}
            }
        },

        created () {
            window.enterPage(this.statusUrl).then(({ data }) => {
                this.fetchingStatus = false
                this.jobStatus = data
            }).catch(() => { })
        },

        methods: {
            getStats (job) {
                if (window._.has(this.jobStatus, job.label)) {
                    return this.jobStatus[job.label]
                } else {
                    return [{
                        'process': 'Not found in the server',
                        'status': 'Unknown',
                        'pid': 'Inapplicable',
                        'uptime': 'Inapplicable'
                    }]
                }
            }
        }
    }
</script>
