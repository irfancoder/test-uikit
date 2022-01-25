<template>
    <div class="flex-grow">
        <h5 class="font-semibold mb-4">
            {{ storageLabel }}
            <i class="rc rc-information" style="margin-left: 4px; color: #4e5a65; font-size: 14px" v-tooltip:top="'Stats may take up to 2 hours to be updated'"></i>
            <label v-if="trialEndedIn" class="badge badge-warning ml-1" style="margin-left: 4px" v-tooltip:top="`Trial ends ${trialEndedIn}`">Trial</label>
        </h5>
        <p><span class="text-black-500 font-semibold">{{ stats.usage.unused }}</span> available of {{ stats.usage.max }}</p>

        <div class="progress my-2">
            <div class="progress-bar progress-bar-primary" :style="{ 'width': `${ stats.usage.percentage}%` }"></div>
        </div>

        <div class="flex space-x-10 pt-3">
            <div class="flex items-center" v-if="totalSites"><i class="rc rc-ln-app rc-ln-semibold text-misc-100 mr-3 text-xl"></i><span v-html="totalSites"></span></div>
            <div class="flex items-center" v-if="totalDownload"><i class="rc rc-ln-import rc-ln-semibold text-misc-100 mr-3 text-xl"></i><span v-html="totalDownload"></span></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            storageLabel: String,
            stats: Object,
            totalSites: String,
            totalDownload: String,
            trialEnded: Number
        },
    
        data: () => ({
            trialEndedIn: null
        }),

        mounted () {
            if (this.trialEnded) {
                this.trialEndedIn = window.moment(parseInt(this.trialEnded) * 1000).fromNow()
            }
        }
    }
</script>
