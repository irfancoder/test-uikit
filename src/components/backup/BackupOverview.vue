<template>
    <div class="flex flex-col md:flex-row md:space-x-7">
        <div class="panel panel-default">
            <div class="panel-heading">
                <panel-header title="Storage">
                    <template slot="action">
                        <a :href="backupFilesUrl">Manage Files</a>
                    </template>
                </panel-header>
            </div>

            <div class="panel-body px-0 table-responsive">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <td>
                                <i class="rc-ln-copy rc-tb-icon"></i>
                                Total Usage
                            </td>
                            <td class="text-right">{{ site.storage.size.used }}</td>
                        </tr>
                        <tr>
                            <td>
                                <i class="rc-ln-bucket rc-tb-icon"></i>
                                Store In
                            </td>
                            <td class="text-right"><span style="text-transform: capitalize">{{ site.storage.type }}</span> storage</td>
                        </tr>
                        <tr>
                            <td>
                                <i class="rc-ln-file rc-tb-icon"></i>
                                Excluded Files
                            </td>
                            <td class="text-right">
                                <a v-if="site.storage.type === 'free'" href="/settings/subscription" class="font-semibold" @click="analyticEvent('Upgrade Plan', 'Click', 'Backup Pro')">Upgrade to Backup Pro</a>
                                <span v-else>{{ pluralize(site.storage.files, 'file') }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i class="rc-ln-table rc-tb-icon"></i>
                                Excluded Tables
                            </td>
                            <td class="text-right">
                                <a v-if="site.storage.type === 'free'" href="/settings/subscription" class="font-semibold" @click="analyticEvent('Upgrade Plan', 'Click', 'Backup Pro')">Upgrade to Backup Pro</a>
                                <span v-else>{{ pluralize(site.storage.tables, 'table')  }}</span>
                            </td>
                        </tr>
                        <tr v-if="site.data.server">
                            <td>
                                <i class="rc-ln-server rc-tb-icon"></i>
                                Server
                            </td>
                            <td class="text-right"><a :href="`/servers/${site.data.server.id}/summary`">{{ site.data.server.name }}</a></td>
                        </tr>
                        <tr v-if="site.data.webapp">
                            <td>
                                <i v-if="site.data.webapp.type === 'wordpress'" class="rc-ln-app rc-tb-icon"></i>
                                <i v-else class="rc-ln-app rc-tb-icon"></i>
                                Web Application
                            </td>
                            <td class="text-right"> <a :href="`/servers/${site.data.server.id}/webapplications/${site.data.webapp.id}/dashboard`"> {{ site.data.webapp.name }}</a></td>
                        </tr>
                        <tr v-if="site.data.database">
                            <td>
                                <i class="rc-ln-database rc-tb-icon"></i>
                                Database
                            </td>
                            <td class="text-right">{{ site.data.database.name }}</td>
                        </tr>
                        <tr v-if="!site.data.webapp && !site.data.database">
                            <td colspan="2">No webapp and database available. Paused.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <panel-header title="Schedule">
                    <template slot="action">
                        <a :href="settingUrl">Edit Settings</a>
                    </template>
                </panel-header>
            </div>

            <div class="panel-body px-0 table-responsive">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <td>
                                <i class="rc-ln-restore rc-tb-icon"></i>
                                Backup Frequency
                            </td>
                            <td class="text-right"> Every {{ site.schedule.backupFrequency }}</td>
                        </tr>
                        <tr>
                            <td>
                                <i class="rc-ln-corner-left-round rc-last-backup rc-tb-icon"></i>
                                Last Backup
                            </td>
                            <td class="text-right">
                                <moment type="date" format="Do MMMM YYYY (hh:mm:ss A Z)" :time="site.schedule.lastBackup"></moment>
                                <!-- <moment type="date" :time="site.schedule.last_backup" v-if="site.Schedule.last_backup"></moment>
                                <template v-else>-</template> -->
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i class="rc-ln-corner-right-round rc-tb-icon"></i>
                                Next Backup
                            </td>
                            <td class="text-right">
                                <moment type="date" format="Do MMMM YYYY (hh:mm:ss A Z)" :time="site.schedule.nextBackup"></moment>
                                <!-- <moment type="date" :time="site.schedule.next_backup" v-if="site.Schedule.next_backup"></moment>
                                <template v-else>-</template> -->
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i class="rc-ln-trash rc-tb-icon"></i>
                                Delete Backup
                            </td>
                            <td class="text-right">{{ site.schedule.deleteBackup }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            site: Object,
            settingUrl: String,
            backupFilesUrl: String
        },

        methods: {
            pluralize(count, noun, suffix = 's') {
                return `${count} ${noun}${count !== 1 && count !== 0 ? suffix : ''}`
            }
        }
    }
</script>

<style lang="scss" scoped>
    .panel {
        width: 100%;

        .panel-heading {
            h5 {
                margin: 0;
                font-weight: 600;
            }
        }

        .panel-body {
            padding-top: 8px;
            padding-bottom: 0;
            padding-right: 8px;
            padding-left: 8px;
        }

        table > tbody tr > td:first-child {
            font-weight: 400;
            opacity: 0.8;
        }
    }

     rc-tb-icon {
        padding-right: 15px
    }

    i {
        font-weight: bold;
    }
</style>
