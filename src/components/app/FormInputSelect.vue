<template>
    <div class="form-group" :class="[ {'has-error': model.errors.has(name)}, formClass]" :id="`form-group-${name}-${randomId}`">
        <label :class="[labelClass]" v-if="label">{{ label }}</label>
        <p class="form-input-description" v-html="description" v-if="description"></p>

        <ul class="list-unstyled parent-list">
            <li v-if="selectedItem" class="selected-item">
                <div @click="deselect($event)" id="item"><p class="truncate">{{ selectedItem.name }}</p></div>
            </li>
            <li>
                <input 
                    type="text"
                    :class="[inputClass]"
                    :name="name"
                    :id="inputId"
                    :placeholder="placeholder"
                    v-model="keyword"
                    :ref="name"
                    :data-value="keyword"
                    :disabled="disabled"
                    @input="search($event)"
                    @focus="showSelection = true"
                    autocomplete="off">
            </li>

            <div class="wrap-list" v-if="showSelection" @mouseover="showSelection = true">
                <ul class="list-unstyled">
                    <li class="text-misc-100" disabled>---Please select one---</li>
                    <li v-for="(item, index) in searchResult" :key="index" @click="select($event)" :data-value="item.id"><span>{{ item.name }}</span></li>
                    <li v-if="searchResult.length === 0">No result found containing '{{ keyword }}'</li>
                </ul>
            </div>
        </ul>

        <span v-if="model.errors.has(name)" v-text="model.errors.get(name)" class="help-block"></span>
    </div>
</template>

<script>
    export default {
        props: {
            label: { required: false },
            labelClass: { default: 'form-label' },
            inputClass: { default: 'form-control' },
            description: {},
            name: { required: true },
            model: { required: true },
            selection: { required: true, type: Array },
            value: {},
            inputId: {},
            placeholder: { default: 'Select or custom input' },
            type: { default: 'text' },
            formClass: {},
            disabled: { default: false }
        },

        data () {
            return {
                showSelection: false,
                selectedItem: null,
                searchResult: [],
                keyword: ''
            }
        },

        computed: {
            placeholder () {
                return `Select ${this.label} or enter custom ${this.label}`
            },

            selectedItem () {
                return this.selection.find(item => item.id === parseInt(this.value))
            },

            randomId () {
                return '_' + Math.random().toString(36).substr(2, 9)
            }
        },

        methods: {
            handleMouseLeave () {
                setTimeout(() => {
                    // this.showSelection = false
                    // console.log('yeay, blur is working')
                }, 3000)
            },

            handleEmit (value) {
                // console.log(event.currentTarget.getAttribute('data-value'))

                this.$emit('input', value)
                this.model.errors.clear(this.name)
            },

            select (event) {
                let target = event.currentTarget.getAttribute('data-value')
                this.handleEmit(target)

                this.selectedItem = this.getItem(target)

                this.showSelection = false
            },

            deselect (event) {
                this.selectedItem = null
                this.$refs[this.name].focus()
                this.showSelection = true
                this.keyword = null
            },

            search (event) {
                this.searchResult = this.selection.filter(item => item.name.toLowerCase().includes(this.keyword.toLowerCase()))

                if (this.searchResult.length === 0) {
                    this.handleEmit(this.keyword)
                }
            },

            getItem (id) {
                return this.selection.find(item => item.id === id)
            }
        },

        mounted () {
            document.addEventListener('click', (evt) => {
                const el = document.getElementById(`form-group-${this.name}-${this.randomId}`)
                let targetElement = evt.target

                do {
                    if (targetElement === el) {
                        // console.log('click inside')
                        return
                    }
                    targetElement = targetElement.parentNode
                } while (targetElement)

                // console.log('click outside')
                this.showSelection = false
            })
        },

        created () {
            if (this.value) {
                let found = this.getItem(this.value)

                if (found) {
                    this.selectedItem = found
                } else {
                    this.keyword = this.value
                }
            }
            this.searchResult = this.selection
        }
    }
</script>

<style lang="scss" scoped>
    .parent-list {
        position: relative;
    }

    .wrap-list {
        position: absolute;

        margin-top: 10px;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        border-radius: 2px;
        box-shadow: 0 8px 12px rgba(34, 49, 63, 0.08);
        z-index: 9999;
        background-color: #ffffff;
        width: 100%;

        ul {
            li {
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s;
                margin: 8px;
                border-radius: 2px;

                &:hover {
                    background-color: #e9edf0;
                }
            }
        }
    }

    .selected-item {
        position: relative;

        > div {
            padding: 10px 14px;
            position: absolute;
            z-index: 1;
            left: 2px;
            right: 2px;
            top: 2px;
            cursor: pointer;
            background: #ffffff;
        }
    }
</style>
