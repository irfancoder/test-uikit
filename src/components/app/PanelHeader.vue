<template>
    <div>
        <div class="flex flex-wrap flex-col md:items-baseline justify-between flex-grow w-full space-y-4 md:space-y-0 md:flex-row md:flex-grow-0 mix-slot">
            <h4 v-if="title" :class="[{ 'block w-full border-b pb-4 md:mb-4': $slots.filter }]">{{ title }}</h4>
            <div class="flex-grow w-full filter-group filter md:w-auto md:flex-grow-0 filter-slot" v-if="$slots.filter">
                <slot name="filter"></slot>
            </div>

            <div v-if="$slots.action" class="flex items-center flex-shrink-0 w-full space-x-2 md:w-auto action-slot">
                <slot name="action"></slot>
            </div>
        </div>

        <div class="pt-4 mt-4 desc-slot" v-if="$slots.desc">
            <slot name="desc"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['desc', 'title']
    }
</script>

<style lang="scss" scoped>
    .mix-slot + .desc-slot {
        @apply border-t;
    }

    .action-slot {
        > .btn {
            @apply w-full flex items-center md:w-auto;
        }
    }

    .filter-slot {
        .form-group {
            @apply md:w-auto md:flex-wrap md:flex-none;
        }

    }
</style>
