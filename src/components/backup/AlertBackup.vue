<template>
    <div class="alert alert-default">
        <div class="flex flex-col md:flex-row justify-between w-full">
            <div class="mb-2 md:mb-0">
                <span class="font-semibold">{{ title }}</span>
                <p>{{ description }}</p>
            </div>

            <a :href="url" role="button" class="btn btn-success my-auto">{{ ctaTitle }}</a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: String,
            title: String,
            description: String,
            ctaTitle: {
                type: String,
                default: 'Subscribe to Backup Pro'
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~sass/mixins/toastr';
    
    .alert-default {
        @include alert-variant("gray", "\f27e");

        &::before {
            @apply text-yellow-500 text-2xl;
        }
    }
</style>
