<template>
    <ul class="list-unstyled list-theme-plugin">
        <li v-for="(item, index) in items" :key="index">
            <div v-if="item.description !== null" class="flex item">
                <div class="flex-none">
                    <img :src="item.imageURL" :alt="item.name" class="block w-10 h-10 border rounded bg-misc-500 py-1 mr-4">
                </div>
                <div class="flex-auto">
                    <div class="flex justify-between">
                        <div>
                            <span class="font-semibold">{{ stripHTMLTags(item.name) }} <span class="font-normal">by {{ stripHTMLTags(item.author) }}</span></span>
                            <p class="max-w-sm">{{ trimLongText(stripHTMLTags(item.description), 180) }}</p>
                        </div>
                        <div v-if="actionAdd">
                            <button type="button" class="btn btn-grey btn-sm btn-helper" @click="addItem(item, index)" v-if="!item.alreadyAdded">Add</button>
                            <button type="button" disabled class="btn btn-primary cursor-not-allowed" v-else>Added</button>
                        </div>

                        <div v-if="!actionAdd && type === 'theme'">
                            <button v-if="item.activate && activeTheme === item.slug" type="button" class="btn btn-success btn-sm btn-helper" @click="inactivateTheme(item, index)">Activated</button>
                            <button v-else type="button" class="btn btn-grey btn-sm btn-helper" @click="activateTheme(item, index)">Activate</button>
                        </div>
                        <div v-if="!actionAdd && type === 'plugin'">
                            <button v-if="item.activate" type="button" class="btn btn-success btn-sm btn-helper" @click="inactivatePlugin(item, index)">Activated</button>
                            <button v-else type="button" class="btn btn-grey btn-sm btn-helper" @click="activatePlugin(item, index)">Activate</button>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <ul v-if="type === 'plugin' || item.requires">
                            <!-- <li class="inline" v-if="type === 'plugin'">Ratings: {{ kFormat(item.num_ratings) }}</li> -->
                            <li v-if="item.requires"><p>WordPress v{{ item.requires }} or higher</p></li>
                        </ul>
                        <div>
                            <ul class="space-x-4">
                                <li v-if="item.preview_url" class="inline"><a role="button" :href="item.preview_url" :alt="item.name" target="_blank" v-if="type === 'theme'" rel="noreferrer">Preview</a></li>

                                <li v-if="type === 'theme'" class="inline"><a role="button" :href="'https://wordpress.org/themes/' + item.slug" :alt="item.name" target="_blank" rel="noreferrer">More Detail</a></li>
                                <li v-else class="inline"><a role="button" :href="'https://wordpress.org/plugins/' + item.slug" :alt="item.name" target="_blank">More Detail</a></li>

                                <li v-if="type === 'theme'" class="inline"><a role="button" @click="removeTheme(item, index)" class="text-red-500" v-if="actionRemove && !item.activate">Remove</a></li>
                                <li v-else><a role="button" @click="removePlugin(item, index)" class="text-red-500 inline" v-if="actionRemove">Remove</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex item none">
                <div class="flex-fill">
                    <div class="flex justify-between">
                        <spinner loading-text="Fetching item.." :working="true"></spinner>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        defaultItems: { default: () => [], type: Array },
        type: String,
        actionAdd: { default: true, type: Boolean },
        actionRemove: { default: true, type: Boolean },
        selected: { default: () => [], type: Array }
    },

    data () {
        return {
            items: this.defaultItems,
            selectedItems: this.selected,
            activeTheme: ''
        }
    },

    watch: {
        defaultItems: {
            immediate: true,
            deep: false,
            handler (newValue, oldValue) {
                this.merge()
            }
        },

        items: function () {
            this.activeTheme = this.getActiveTheme()
        }
    },

    methods: {
        addItem: function (item, index) {
            this.$set(this.items[index], 'alreadyAdded', true)
            this.$emit('select-item', item, `${this.capitalize(this.type)}s`)
        },

        removeTheme: function (item, index) {
            this.$set(this.items[index], 'alreadyAdded', false)
            if (item.activate) {
                this.$set(this.items[index], 'activate', false)
                this.activeTheme = ''
            }
            this.$emit('remove-item', item, `${this.capitalize(this.type)}s`)
        },

        activateTheme: function (item, index) {
            if (this.activeTheme === '') {
                this.$set(this.items[index], 'activate', true)
            } else {
                this.$set(this.items[index], 'activate', true)
                let itemIndex = this.defaultItems.findIndex(obj => obj.slug === this.activeTheme)
                this.$set(this.items[itemIndex], 'activate', false)
            }

            this.activeTheme = item.slug
        },

        inactivateTheme: function (item, index) {
            this.$set(this.items[index], 'activate', false)
            this.activeTheme = ''
        },

        getActiveTheme: function () {
            if (this.selected) {
                let item = this.defaultItems.find(item => item.activate)

                if (item) {
                    return item.slug
                } else {
                    return ''
                }
            }
        },

        activatePlugin: function (item, index) {
            this.$set(this.items[index], 'activate', true)
        },

        inactivatePlugin: function (item, index) {
            this.$set(this.items[index], 'activate', false)
        },

        removePlugin: function (item, index) {
            this.$set(this.items[index], 'alreadyAdded', false)
            if (item.activate) {
                this.$set(this.items[index], 'activate', false)
            }
            this.$emit('remove-item', item, `${this.capitalize(this.type)}s`)
        },

        stripHTMLTags: function (html) {
            var div = document.createElement('div')
            div.innerHTML = html
            return div.textContent || div.innerText || ''
        },

        trimLongText: function (text, n) {
            return (text.length > n) ? text.substr(0, n - 1) + '...' : text
        },

        isImageLoaded: function (img) {
            return img.complete && img.naturalHeight !== 0
        },

        merge () {
            if (this.defaultItems !== null) {
                let currentData = window._.keyBy(this.defaultItems, 'slug')
                let selectedData = window._.keyBy(this.selected, 'slug')
                this.items = window._.merge(currentData, selectedData)
                this.items = Object.values(this.items)
                let self = this

                this.items = this.items.map((item) => {
                    if (self.type === 'plugin') {
                        if (item.icons !== undefined) {
                            item.imageURL = item.imageURL || item.icons[Object.keys(item.icons)[0]]
                        }
                        item.description = item.short_description || item.description
                    } else {
                        item.imageURL = item.imageURL || item.screenshot_url
                    }

                    return item
                })
            }
        },

        capitalize (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },

        kFormat(number) {
            return Intl.NumberFormat('en', { notation: 'compact' }).format(number)
        }
    }
}
</script>

<style lang="scss" scoped>

.list-theme-plugin {
    ul {
        padding-top: 16px;
    }

    .flex-fill {
        flex: 1 1 auto !important;
    }

    .item {
        border-top: 1px solid #e9edf0 !important;
        padding: 16px 0;

        .img-wrapper {
            height: 40px;
            width: 40px;
            @apply bg-blue-300;
            margin-right: 16px;
        }

        img {
            height: 40px;
            width: 40px;
        }

        p {
            margin-bottom: 4px;
        }

        .title {
            span {
                opacity: 0.7;
                font-weight: 400;
            }
        }

        .sub {
            opacity: 0.7;
        }
    }
    .theme-plugin-action {
        a, button {
            margin-left: 16px;
        }
    }
}
</style>
