<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Committer</th>
                <th class="text-right">Branch</th>
                <th>Commit</th>
                <th>Message</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(log, index) in logs" :key="index">
                <td>{{ log.committer }}</td>
                <td class="text-right"><i class="rc rc-ln-branch rc-tb-icon"></i>{{ log.branch }}</td>
                <td><a :href="log.url" target="_blank" rel="noreferrer">{{ log.hashShort }}</a></td>
                <td>{{ log.message }}</td>
                <td><moment type="datetime" :time="log.created_at"></moment></td>
            </tr>
            <tr v-if="logs.length === 0">
                <td colspan="5">You don't have any webhook history here yet.</td>
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

            window.Echo.private(`servers.${window.RunCloud.server}`).listen('.GitWebhookLog', log => {
                if (log.version_control_id === window.RunCloud.git) {
                    this.logs.unshift(log)
                }
            })
        }
    }
</script>
