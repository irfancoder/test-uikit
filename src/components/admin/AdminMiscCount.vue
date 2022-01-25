<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4>Total</h4>
        </div>
        <div class="panel-body">
            <loader v-if="working"></loader>
            <div v-else>
                <p>Domains: {{ misc.domains }}</p>
                <p>Database: {{ misc.databases }}</p>
                <p>Supervisor: {{ misc.supervisors }}</p>
                <p>Cron Jobs: {{ misc.cronjobs }}</p>
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
            misc: {}
        }
    },

    created () {
        this.fetch()
    },

    methods: {
        fetch () {
            window.enterPage(this.url).then(({data}) => {
                this.misc = data
                this.working = false
            })
        }
    }
}
</script>