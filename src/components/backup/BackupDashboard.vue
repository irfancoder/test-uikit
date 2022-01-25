<template>
    <div class="grid grid-cols-12 md:gap-7">
        <div class="panel panel-default col-span-12 md:col-span-6 2xl:col-span-4">
            <div class="panel-body">
                <div class="flex">
                    <i class="rc rc-ln-bucket mr-7 text-blue-500 text-3xl"></i>
                    <div v-if="isFree">
                        <h5 class="font-semibold">Free Storage</h5>
                        <p>Get 5GB FREE backup storage when you subscribe to any Server plan.</p>

                        <a :href="subscriptionUrl" class="block mt-4">Update Subscription</a>
                    </div>

                    <backup-storage
                        storage-label="Free Storage"
                        :stats="storage.basic"
                        :total-sites="`${storage.basic.site.used} / ∞ sites`"
                        v-else></backup-storage>
                </div>
            </div>
        </div>

        <div class="panel panel-default col-span-12 md:col-span-6 2xl:col-span-4">
            <div class="panel-body">
                <div class="flex">
                    <i class="rc rc-ln-bucket mr-7 text-blue-500 text-3xl"></i>
                    <div v-if="isBasic">
                        <h5 class="font-semibold">Pro Storage</h5>
                        <p>Get another backup storage with Backup Pro and it’s additional features such as custom file exclusion, on-demand backup, flexible backup retention and more.</p>

                        <a :href="subscriptionUrl" @click="analyticEvent('Upgrade Plan CTA', 'Upgrade Plan', 'Subscribe Backup Pro')" class="block mt-4">Subscribe Backup Pro</a>
                    </div>

                    <backup-storage
                        storage-label="Pro Storage"
                        :stats="storage.pro"
                        :total-sites="`${storage.pro.site.used} / ${storage.pro.site.max} sites`"
                        :total-download="`${storage.pro.download.count} / ${storage.pro.download.max} downloads`"
                        :trial-ended="trialEnded"
                        v-else></backup-storage>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            subscriptionUrl: String,
            storage: Object,
            backupPlan: String,
            role: String,
            trialEnded: Number
        },

        computed: {
            isBasic() {
                return this.backupPlan === 'basic'
            },

            isFree() {
                return this.role === 'Free'
            }
        }
    }
</script>
