<template>
    <div v-if="status.percentage != 0"  class="panel panel-default py-7">
        <div class="alert alert-danger">
            <p><strong>Do not move from this page</strong> or you will lose track of the installation progress.</p>
        </div>
        <div class="flex justify-between">
            <p>{{ status.status }}...</p>
            <p>{{ status.percentage }}%</p>
        </div>
        <div class="progress my-2">
            <div class="progress-bar progress-bar-primary active" role="progressbar" aria-valuemin="0" aria-valuemax="100" :style="{ width: `${status.percentage}%` }"></div>
        </div>
        <div v-if="failure.length > 0" class="pt-4">
            <hr>
            <div class="pt-4 space-y-2">
                <span>Error found while installing. Please resolve the following issue(s) before retrying:</span>

                <div>
                    <ul>
                        <li v-for="(item, index) in failure" :key="index"><p>{{ index+1 }}. {{ item }}</p></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            event: String,
            initialPercentage: Number
        },
        data () {
            return {
                status: {
                    status: 'Preparing to install...',
                    percentage: this.initialPercentage
                },
                failure: []
            }
        },
        created () {
            let self = this
            window.Echo.private('webapp.' + window.RunCloud.webApp).listen(this.event, data => {
                self.status = data.status

                if (data.status.severity === 3) {
                    this.failure.push(data.status.status)
                }
                // if status percentage 100 5 second then null status
                if (self.status.percentage >= 100) {
                    setTimeout(function () {
                        self.status.percentage = 0
                    }, 3000)
                }
            })
        }
    }
</script>