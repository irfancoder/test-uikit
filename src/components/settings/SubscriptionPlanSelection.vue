<template>
    <div class="rc-plan-section">
        <div class="item" v-for="(plan, planIndex) in plans" :class="{ 'most-popular': plan.publicName.indexOf('Pro') !== -1 }" :key="planIndex">
            <span v-if="plan.price !== plan.originalPrice" class="badge badge-danger label-off">{{ promotion.discount }}% off</span>
            <img class="pull-left" v-if="plan.publicName.indexOf('Free') !== -1" src="~img/plan/free.svg" loading="lazy" alt="plan icon"/>
            <img class="pull-left" v-if="plan.publicName.indexOf('Basic') !== -1" src="~img/plan/basic.svg" loading="lazy" alt="plan icon"/>
            <img class="pull-left" v-if="plan.publicName.indexOf('Pro') !== -1" src="~img/plan/pro.svg" loading="lazy" alt="plan icon"/>
            <img class="pull-left" v-if="plan.publicName.indexOf('Business') !== -1" src="~img/plan/business.svg" loading="lazy" alt="plan icon"/>

            <div class="pull-right">
                <h1 class="price"><span class="dollar-sign">$</span>{{ plan.price }}</h1>
                <p class="per">
                    <span v-if="plan.price !== plan.originalPrice" class="price-before-discount">${{ plan.originalPrice }}</span>
                    <span v-if="!showYearly">monthly</span>
                    <span v-else-if="showYearly">yearly</span>
                </p>
            </div>
            <div class="clearfix"></div>
            <h4 class="name">{{ plan.publicName }}</h4>
            <p class="description">{{ plan.description }}</p>
            <a v-if="currentPlan === plan.id" class="btn btn-primary btn-block" disabled>Current Plan</a>
            <a v-else @click="selectPlan(plan)" class="btn btn-primary btn-block">Choose Plan</a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            plans: Array,
            currentPlan: Number,
            promotion: Object,
            showYearly: Boolean
        },

        methods: {
            selectPlan (plan) {
                this.$emit('plan-selected', plan)
            }
        }
    }
</script>
