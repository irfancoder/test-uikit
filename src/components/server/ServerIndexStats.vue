<template>
    <div v-tooltip.top="`Used: ${mbToGb(used)}GB<br> Available: ${mbToGb(available)}GB<br> Total: ${mbToGb(total)}GB`" data-html="true" class="block w-full">
        <div v-if="title">
            <p class="key">{{ title }}</p>
            <div class="value">{{ percentage }}%</div>
            <div class="progress w-full" :style="[ title ? styleProgress.card : styleProgress.table ]">
                <div :class="`progress-bar ${progressBarColor}`" role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100" :style="{ width: `${percentage}%` }"></div>
            </div>
        </div>

        <div class="flex items-center" v-else>
            <div class="progress" :style="[ title ? styleProgress.card : styleProgress.table ]">
                <div :class="`progress-bar ${progressBarColor}`" role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100" :style="{ width: `${percentage}%` }"></div>
            </div>
            <div class="value">{{ percentage }}%</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: '',
            used: '',
            available: '',
            total: ''
        },

        data () {
            return {
                styleProgress: {
                    card: {
                        width: '100%',
                        height: '4px'
                    },
                    table: {
                        width: '100%',
                        height: '4px',
                        margin: '0 8px'
                    }
                }
            }
        },

        methods: {
            mbToGb: value => (value / 1024).toFixed(2)
        },

        computed: {
            percentage () {
                return ((this.used / this.total) * 100).toFixed(0)
            },

            color () {
                if (this.total) {
                    if (this.percentage >= 80) {
                        return 'text-danger'
                    }
                } else {
                    if (this.percentage * 100 >= 80) {
                        return 'text-danger'
                    }
                }
            },

            progressBarColor () {
                let val = this.used / this.total * 100
                if (val <= 25) {
                    return 'progress-bar-success'
                } else if (val <= 50) {
                    return 'progress-bar-info'
                } else if (val <= 75) {
                    return 'progress-bar-warning'
                } else if (val <= 100) {
                    return 'progress-bar-danger'
                }
            }
        }
    }
</script>
