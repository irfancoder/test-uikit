<template>
<div>
    <div class="panel-table table-responsive">
        <skeleton-table :rows="6" v-if="fetching">
            <template #header>
                <tr>
                    <th>Service</th>
                    <th>Processor Usage</th>
                    <th>Memory Usage</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </template>
        </skeleton-table>

        <table class="table table-hover" v-else>
            <thead>
                <tr>
                <th>Service</th>
                <th>Processor Usage</th>
                <th>Memory Usage</th>
                <th>Status</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(service, index) in services.data" :key="index">
                    <td class="with-image">
                        <svg-icon height="24" width="24" :icon="`br-${_.kebabCase(_.toLower(service.name))}`"></svg-icon>
                        <span>
                            <h6 class="font-medium">{{ service.name }}</h6>
                            <p>{{ service.version }}</p>
                        </span>
                    </td>
                    <td>
                        <span v-show="service.running">{{ service.cpu }}</span>
                        <span class="text-center" v-show="!service.running">-</span>
                    </td>
                    <td>
                        <span v-show="service.running">{{ service.memory }}</span>
                        <span class="text-center" v-show="!service.running">-</span>
                    </td>
                    <td>
                        <label class="badge badge-success" v-if="!waitingData && service.running">Running</label>
                        <label class="badge badge-default" v-else-if="!waitingData && !service.running">Stopped</label>
                        <label class="badge badge-warning" v-else-if="waitingData">Waiting</label>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="dropdown-toggle btn btn-default icon-only" role="button" data-toggle="dropdown">
                                <i class="rc rc-ln-more"></i>
                            </button>
                            <services-menu
                                :service="service"
                                :trigger-url="triggerUrl"
                                @waiting-data="adjustWaitingData"
                            ></services-menu>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <v-tableinfo :items="services" title="services" @change-page="fetch"></v-tableinfo>
</div>
</template>

<script>
import SkeletonTable from '../app/SkeletonTable.vue'
export default {
    components: { SkeletonTable },
    props: {
        dataUrl: String,
        triggerUrl: String,
        view: String
    },

    data() {
        return {
            fetching: true,
            services: {}
        }
    },

    created() {
        this.fetch(true)

        window.Echo.private('servers.' + window.RunCloud.server).listen(
            '.ServerServiceActionWasCompleted',
            data => {
                if (data.server_id === window.RunCloud.server) {
                    this.fetching = false
                    this.fetch(this.services.current_page)
                }
            }
        )
    },

    methods: {
        fetch(page) {
            window.enterPage(this.dataUrl + '?page=' + page, {}).then(({ data }) => {
                this.fetching = false
                this.services = data
            }).catch(() => {
                this.fetching = false
            })
        }
    }
}
</script>
