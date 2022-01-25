<template>
    <ul class="dropdown-menu dropdown-menu-right" role="menu">
        <li v-if="!service.running">
            <universal-ajax
                button-type="button"
                button-text="Start"
                button-icon="rc rc-ln-start"
                :url="triggerUrl"
                method="post"
                :title="`Start ${service.name} service`"
                :text="`Do you want to start the ${service.name} service?`"
                confirm-button-text="Start"
                confirm-button-class="btn btn-primary"
                type="info"
                @completed="waitingData(true)"
                analytic-category="Services"
                :analytic-action="`start-${service.name}`"
                :post-data="{ action: 'start', realName: service.realName, name: service.name }">
            </universal-ajax>
        </li>

        <li v-else-if="service.running">
            <universal-ajax
                button-type="button"
                button-text="Stop"
                button-icon="rc rc-ln-ban"
                action="delete"
                :url="triggerUrl"
                method="post"
                :title="`Stop ${service.name} service`"
                :text="`Do you want to stop the ${service.name} service?`"
                confirm-button-text="Stop"
                confirm-button-class="btn btn-danger"
                type="warning"
                @completed="waitingData(true)"
                analytic-category="Services"
                :analytic-action="`stop-${service.name}`"
                :post-data="{ action: 'stop', realName: service.realName, name: service.name }">
            </universal-ajax>
        </li>

        <li v-if="service.running && (service.realName !== 'mysql' && service.realName !== 'redis-server' && service.realName !== 'memcached' && service.realName !== 'beanstalkd')">
            <universal-ajax
                button-type="button"
                button-text="Reload"
                button-icon="rc rc-ln-loop"
                :url="triggerUrl"
                method="post"
                :title="`Reload ${service.name} service`"
                :text="`Do you want to reload the ${service.name} service?`"
                confirm-button-text="Reload"
                confirm-button-class="btn btn-primary"
                type="info"
                @completed="waitingData(true)"
                analytic-category="Services"
                :analytic-action="`reload-${service.name}`"
                :post-data="{ action: 'reload', realName: service.realName, name: service.name }">
            </universal-ajax>
        </li>

        <li v-if="service.running">
            <universal-ajax
                button-type="button"
                button-text="Restart"
                button-icon="rc rc-ln-loop"
                :url="triggerUrl"
                method="post"
                :title="`Restart ${service.name} service`"
                :text="`Do you want to restart the ${service.name} service?`"
                confirm-button-text="Restart"
                confirm-button-class="btn btn-primary"
                type="info"
                @completed="waitingData(true)"
                analytic-category="Services"
                :analytic-action="`restart-${service.name}`"
                :post-data="{ action: 'restart', realName: service.realName, name: service.name }">
            </universal-ajax>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            service: Object,
            triggerUrl: String
        },

        methods: {
            waitingData (bool) {
                this.$emit('waiting-data', bool)
            }
        }
    }
</script>
