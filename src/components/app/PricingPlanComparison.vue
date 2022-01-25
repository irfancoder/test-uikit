<template>
   <div>
        <template v-if="type === 'server'">
            <div class="plan-wrapper plan-server">
                <div v-for="(plan, index) in serverPlans" :key="index">
                    <h4 class="font-weight-bold">{{ plan.name }}</h4>
                    <span class="price">USD {{ plan.price }}</span>
                    <span class="text-paragraph">/ month</span>

                    <ul class="list-unstyled">
                        <li v-for="(feat, featIndex) in plan.features" :key="featIndex">{{ feat }}</li>
                    </ul>
                </div>
            </div>

            <br>

            <div class="text-center pt-4">
                <h4 class="font-semibold">All paid server plan comes with free Backup Basic for unlimited sites and 5GB storage</h4>
                <br>
                <br>
                <br>
            </div>

            <div style="margin: 0 16px">
                <slot name="server-plan-comparison"></slot>
            </div>
        </template>

        <template v-if="type === 'backup'">
            <div class="plan-wrapper plan-backup">
                <div v-for="(plan, index) in backupPlans" class="col-span-2" :key="index">
                    <h4 class="font-weight-bold">{{ plan.name }}</h4>
                    <span class="price">USD {{ plan.price }}</span>
                    <span class="text-paragraph">/ month {{ plan.slug === 'pro' ? '/ site' : '' }}</span>

                    <ul class="list-unstyled">
                        <li v-for="(feat, featIndex) in plan.features" :key="featIndex">{{ feat }}</li>
                    </ul>
                </div>
            </div>
        </template>
   </div>
</template>

<script>
    export default {
        props: {
            type: String,
            isWorkspace: { type: Boolean, default: false }
        },
        created () {
            if (this.isWorkspace) {
                this.serverPlans[3].features.splice(1, 1)
            }
        },
        data: () => ({
            serverPlans: [
                {
                    name: 'Free',
                    slug: 'free',
                    price: 0,
                    features: [
                        '1 Connected Server',
                        'Unlimited Web Applications'
                    ]
                },
                {
                    name: 'Basic',
                    slug: 'basic',
                    price: 8,
                    features: [
                        '1 Connected Server',
                        'Unlimited Web Applications',
                        'One-click SSL',
                        'Git Deployment',
                        'WordPress Server-side Caching (RunCache)',
                        '1 WordPress Staging'
                    ]
                },
                {
                    name: 'Pro',
                    slug: 'pro',
                    price: 15,
                    features: [
                        'Everything in Basic',
                        'Unlimited Connected Servers',
                        'Clone Web Application',
                        'Custom NGINX Configuration',
                        '6G and 7G Firewall',
                        '10 WordPress Staging'
                    ]
                },
                {
                    name: 'Business',
                    slug: 'pro',
                    price: 45,
                    features: [
                        'Everything in Pro',
                        'Team Collaboration',
                        'Zero Downtime Deployment',
                        'Cloudflare DNS integration',
                        'Web Application Firewall (ModSecurity + OWASP CRS)',
                        'WordPress Canvas',
                        'WordPress Magic Link via RunCloud Hub',
                        'Unlimited WordPress Staging'
                    ]
                }
            ],
            backupPlans: [
                {
                    name: 'Basic',
                    slug: 'basic',
                    price: 0,
                    features: [
                        'Free 5GB Basic Storage',
                        'Unlimited Sites',
                        'Daily Backup Frequency',
                        '1 Week Backup Retention',
                        'Restore To Existing/New Site'
                    ]
                },
                {
                    name: 'Pro',
                    slug: 'pro',
                    price: 1,
                    features: [
                        'Free Up To 50GB Pro Storage',
                        'Pro Storage Plan Up To 3TB',
                        'Backup Frequency From Every 30 Minutes To 1 Week',
                        'Backup Retention Up To 1 Month',
                        'Folder/File Exclusion',
                        'Database Table Exclusion',
                        'On-demand Backup',
                        'Download Backup',
                        'Restore To Existing/New Site',
                        'Restore To RunCloud Test Domain'
                    ]
                }
            ]
        })
    }
</script>

<style lang="scss" scoped>
    .plan-wrapper {
        &.plan-backup {
            @apply flex flex-col md:flex-row justify-center;

            > div {
                @apply p-7 w-full my-4 mx-0 md:mx-4 md:w-1/2 xl:w-1/4 md:my-0 border border-gray-400 border-opacity-75;
            }
        }

        &.plan-server {
            @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 justify-center;

            > div {
                @apply p-7 border border-gray-400 border-opacity-75;
            }
        }

        > div {
            h4 {
                margin: unset;
            }

            .price {
                @apply text-2xl font-semibold text-blue-600;
            }

            ul {
                margin-bottom: unset;

                > li {
                    padding: 4px 4px 4px 24px;

                    &:before {
                        content: "\f239";
                        font-family: "runcloudnicon";
                        display: inline-block;
                        margin-left: -24px;
                        width: 24px;
                    }
                }
            }
        }
    }
</style>
