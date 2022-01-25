<template>
    <div>
        <div class="flex justify-between">
            <p class="text-black-500">Backup Space</p>
            <p class="text-black-500">Using <strong>{{ summary.usage.current }}</strong> of <strong>{{ summary.usage.max }}</strong></p>
        </div>

        <div class="progress my-4">
            <div class="progress-bar progress-bar-primary" :style="{ 'width': `${summary.details.webApp.usagePercentage}%` }" v-tooltip:top="'Web application'"></div>
            <div class="progress-bar progress-bar-success" :style="{ 'width': `${summary.details.database.usagePercentage}%` }" v-if="summary.details.database.usagePercentage > 0"></div>
        </div>

        <ul class="flex space-y-2 md:space-y-0 flex-col md:flex-row md:justify-between">
            <li>
                <i class="w-4 h-4 inline-block mr-2 rounded align-text-top progress-bar-primary"></i>
                <span>Web application (<strong>{{ summary.details.webApp.diskUsage +  ' - ' + summary.details.webApp.usagePercentage }}%</strong>)</span>
            </li>
            <li>
                <i class="w-4 h-4 inline-block mr-2 rounded align-text-top progress-bar-success"></i>
                <span>Database (<strong>{{ summary.details.database.diskUsage + ' - ' + summary.details.database.usagePercentage }}%</strong>)</span>
            </li>
            <li>
                <i class="w-4 h-4 inline-block mr-2 rounded align-text-top bg-gray-500"></i>
                <span>Unused space (<strong>{{ summary.usage.unused + ' - ' + _.round((100 - summary.usage.percentage), 2).toFixed(2) }}%</strong>)</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            summary: Object
        }
    }
</script>
