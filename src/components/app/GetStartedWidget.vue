<template>
    <li>
        <a :href="url" :class="childSidebar ? '' : 'flex items-start flex-auto'">
            <i class="rc rc-ln-star"></i>
            <div :class="childSidebar ? 'hidden' : 'w-full'">
                <span class="font-medium">Get Started</span>
                <p>{{ taskCompleted }} remaining tasks</p>

                <div class="mt-3 progress">
                    <div class="progress-bar progress-bar-primary active" role="progressbar" aria-valuemin="0" aria-valuemax="100" :style="{ width: `${percentageCompletion}%` }"></div>
                </div>
            </div>
        </a>
    </li>
</template>

<script>
    export default {
        props: {
            url: String,
            taskCompleted: Number,
            childSidebar: Boolean
        },

        data () {
            return {
                totalTask: 12
            }
        },

        computed: {
            percentageCompletion: function () {
                return (this.taskCompleted / this.totalTask * 100).toFixed(2)
            }
        }
    }
</script>

<style lang="scss" scoped>
    i {
        &::after {
            content: '';
            @apply bg-red-500 rounded-full absolute h-2 w-2;
        }
    }
</style>
