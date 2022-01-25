<template>
    <div class="mb-7" :class="[{ 'has-error': model.errors.has(name) || errorMessage }]">
        <p class="font-medium text-black-500 mb-2">{{ label }}</p>
        <div class="border rounded p-1 input-multiple-container" :class="[{ 'border-red-500 bg-red-50': model.errors.has(name) || errorMessage, 'bg-blue-50 text-black-500 outline-none border-blue-500': focus }]">
            <div class="flex flex-wrap">
                <template v-if="!_.isEmpty(model[name])">
                    <div class="flex items-center justify-between bg-gray-50 py-1 px-2 rounded-sm m-1" v-for="(item, index) in model[name]" :key="index">
                        <span>{{ item }}</span>
                        <i class="rc rc-ln-cross rc-ln-semibold text-misc-100 text-xs ml-3" role="button" @click="model[name].splice(index, 1)"></i>
                    </div>
                </template>
                <div class="flex-grow">
                    <input
                        ref="input"
                        class="block w-full border-none m-0 mt-1 outline-none px-2 py-1 placeholder-gray-700 bg-transparent"
                        :name="name"
                        :type="type" 
                        autocomplete="off" 
                        @focus="focus = true"
                        @blur="focus = false"
                        @keydown.enter.prevent="handleEmit($event)"
                        @keydown.188.prevent="handleEmit($event)"
                        :pattern="pattern"
                        :placeholder="placeholder">
                </div>
            </div>
        </div>

        <transition name="fade" mode="out-in">
            <p class="mt-2 text-gray-700 block" v-html="description" v-show="description && focus && !model.errors.has(name) && !errorMessage"></p>
        </transition>

        <span v-if="model.errors.has(name) || errorMessage" v-text="model.errors.get(name) || errorMessage" class="mt-2 text-gray-700 block help-block"></span>
    </div>
</template>

<script>
    export default {
        props: {
            label: { required: true },
            name: { required: true },
            description: {},
            type: { default: 'text' },
            model: { required: true },
            pattern: { default: null },
            customValidity: { default: null },
            placeholder: { default: "Separate by hitting ' , ' or 'Enter'" }
        },

        data: () => ({
            errorMessage: '',
            focus: false
        }),

        methods: {
            handleEmit (evt) {
                this.model.errors.errors = {} // reset validation error
                this.errorMessage = ''
                this.focus = true
                evt.target.setCustomValidity('')

                if (evt.target.value && evt.target.checkValidity()) {
                    this.$emit('get-tag', evt.target.value)
                    evt.target.value = ''
                } else {
                    if (this.customValidity !== null) {
                        evt.target.setCustomValidity(this.customValidity)
                    }

                    this.errorMessage = evt.target.validationMessage
                    this.focus = false
                }
            },

            fireEnterKey () {
                let temp = this.$refs.input
                temp.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 13})) // manually trigger 'Enter' event
            },
    
            isInputEmpty () {
                return this.$refs.input.value.length === 0
            }
        }
    }
</script>

<style lang="scss" scoped>
    .has-error {
        .help-block {
            @apply text-red-500 relative;

            &::before {
                content: "\f241";
                font-family: runcloudnicon;
                @apply mr-2 text-base relative inset-y-0 my-auto;
            }
        }
    }
</style>
