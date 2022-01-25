<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>Past Due</h4>
        </div>
        <div class="panel-table">
            <loader v-if="working"></loader>
            <table v-else class="table table-hover">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Billing Cycle</th>
                            <th>Subscription ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="subscription in subscriptions">
                            <td>{{ subscription.user.name }}</td>
                            <td><a href="">{{ subscription.user.email }}</a></td>
                            <td>{{ subscription.billingCycle }}</td>
                            <td>{{ subscription.subscription_id }}</td>
                        </tr>
                    </tbody>
                </table>
            </table>
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
            subscriptions: {}
        }
    },

    created () {
        this.fetch()
    },

    methods: {
        fetch () {
            window.enterPage(this.url).then(({data}) => {
                this.subscriptions = data
                this.working = false
            })
        }
    }
}
</script>
