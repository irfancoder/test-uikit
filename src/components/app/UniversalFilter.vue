<template>
    <div class="md:flex md:items-center md:justify-between w-full">
        <div class="filter-group filter">
            <slot>
                <universal-search :url="url" left-icon="rc rc-ln-search"></universal-search>
            </slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'UniversalFilter',
        data: () => ({
            filter: ''
        }),
        props: ['url']
    }
</script>
