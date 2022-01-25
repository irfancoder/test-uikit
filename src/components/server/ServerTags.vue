<template>
    <div class="flex w-full flex-wrap gap-1 items-center" :class="tagClass">
        <label class="tags badge badge-primary" v-for="(id, index) in _.slice(tags, 0, limit)" :key="index">
            <a @click.prevent.stop="goToTag(url.replace('=id=', taggables[id].name))">{{ taggables[id].name }}</a>
        </label>

        <div class="dropdown dropdown-hover ml-2" v-show="shouldExpandTags" @click.stop="">
            <span class="cursor-pointer">+ {{ tags.length - limit }}</span>
            <div class="dropdown-menu flex-wrap gap-2" role="menu">
                <label class="tags badge badge-primary" v-for="(id, index) in _.slice(tags, limit)" :key="index">
                    <a @click.prevent.stop="goToTag(url.replace('=id=', taggables[id].name))">{{ taggables[id].name }}</a>
                </label>
            </div>
        </div>

        <slot name="custom" :show="shouldDisplayAddTags"></slot>
    </div>
</template>

<script>
    export default {
        props: {
            url: { type: String, default: null },
            tags: { type: Array, default: null },
            taggables: { type: Object, default: null },
            limit: { type: Number, default: 3 },
            tagClass: { default: '' }
        },
        data() {
            return {}
        },
        computed: {
            shouldExpandTags () {
                return (this.tags.length > this.limit)
            },
            shouldDisplayAddTags () {
                return (this.tags.length <= this.limit)
            }
        },
        methods: {
            goToTag(url) {
                window.handleRedirect(url)
            }
        }
    }
</script>

<style lang="scss" scoped>

.tags {
    @apply rounded text-sm cursor-pointer font-normal;

    & > a {
        @apply font-normal;
    }
}
</style>
