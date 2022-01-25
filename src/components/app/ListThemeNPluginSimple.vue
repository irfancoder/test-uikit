<template>
    <table class="table table-hover">
        <tbody>
            <tr v-for="(item, index) in items" :key="index">
                <template v-if="item.description !== null">
                    <td class="max-w-xs">
                        <div>
                            <h6>{{ stripHTMLTags(item.name) }}</h6>
                        </div>
                    </td>
                    <td class="space-x-4">
                        <template v-if="actionAdd">
                            <button type="button" class="btn btn-default" @click="addItem(item, index)" v-if="!item.alreadyAdded">Add</button>
                            <button type="button" class="btn btn-primary" disabled v-else>Added</button>
                        </template>
                        <template v-if="!actionAdd && type === 'theme'">
                            <a role="button" @click="removeTheme(item, index)" class="text-red-500" v-if="actionRemove && !item.activate">Remove</a>
                            <a role="button" :href="'https://wordpress.org/themes/' + item.slug" :alt="item.name" target="_blank" rel="noreferrer">More Detail</a>
                            <button type="button" class="btn btn-primary" @click="inactivateTheme(item, index)" v-if="item.activate">Activated</button>
                            <button type="button" class="btn btn-default" @click="activateTheme(item, index)" v-else>Activate</button>
                        </template>
                        <template v-if="!actionAdd && type === 'plugin'">
                            <a role="button" @click="removePlugin(item, index)" class="text-red-500" v-if="actionRemove">Remove</a>
                            <a role="button" :href="'https://wordpress.org/plugins/' + item.slug" :alt="item.name" target="_blank" rel="noreferrer">More Detail</a>
                            <button type="button" class="btn btn-primary" @click="inactivatePlugin(item, index)" v-if="item.activate">Activated</button>
                            <button type="button" class="btn btn-default" @click="activatePlugin(item, index)" v-else>Activate</button>
                        </template>
                    </td>
                </template>
                <template v-else>
                    <td>
                        <loader></loader>
                    </td>
                    <td></td>
                </template>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        defaultItems: { default: () => [], type: Array },
        type: String,
        actionAdd: { default: true, type: Boolean },
        actionRemove: { default: true, type: Boolean },
        selected: { default: () => [], type: Array },
        missingIcon: { default: false, type: Boolean }
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

        kFormat (number) {
            let rx = /\.0+$|(\.[0-9]*[1-9])0+$/
            if (number < 1000) return number
            return (number / 1000).toFixed(1).replace(rx, '$1') + 'k'
        }
    }
}
</script>
