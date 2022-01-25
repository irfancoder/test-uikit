<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Branch</th>
                <th>Stdout</th>
                <th>Stderr</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(log, index) in logs" :key="index">
                <td><i class="rc rc-ln-branch rc-tb-icon"></i>{{ log.branch }}</td>
                <td>
                    <git-error
                        title="Stdout"
                        :excerpt="log.stdoutExcerpt"
                        :log="log.stdout">
                    </git-error>
                </td>
                <td>
                    <git-error
                        title="Stderr"
                        :excerpt="log.stderrExcerpt"
                        :log="log.stderr">
                    </git-error>
                </td>
                <td><moment type="datetime" :time="log.created_at"></moment></td>
            </tr>
            <tr v-if="logs.length === 0">
                <td colspan="4">You don't have any deployment error here yet.</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        props: {
            originalLogs: Array
        },

        data: () => ({
            logs: []
        }),

        created () {
            this.logs = this.originalLogs

            window.Echo.private(`servers.${window.RunCloud.server}`).listen('.GitDeploymentError', log => {
                if (log.version_control_id === window.RunCloud.git) {
                    this.logs.unshift(log)
                }
            })
        }
    }
</script>
