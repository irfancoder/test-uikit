<template>
    <div>
        <div class="modal-body" style="overflow-y: revert">
            <div class="form-group">
                <label class="form-label">Password length</label>
                <div class="flex items-center space-x-6">
                    <vue-slider :min="range[0]" :contained="true" :max="range[range.length - 1]" v-model="passwordLength" @change="generateRandomPassword" class="slider flex-grow"></vue-slider>
                    <h3 class="font-weight-bold pwd-lgth">{{ passwordLength }}</h3>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Character types</label>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div class="card-selection" :class="{ 'active' : characterTypes[index] }" v-for="(char, index) in characterTypes" :key="index">
                        <label class="justify-center h-16">
                            <input type="checkbox" role="checkbox" aria-checked="true" v-model="characterTypes[index]" @change="generateRandomPassword">
                            <div class="flex flex-col justify-center">
                                <span class="text-blue-500 rounded-sm text-center font-medium font-mono">{{ icons[index] }}</span>
                                <span class="capitalize">{{ index }}</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="flex items-start justify-between">
                    <label class="form-label">Generated password</label>

                    <div>
                        <a class="btn btn-primary btn-link btn-clipboard" @click="copyById('passwordToCopy')">
                            <i class="rc rc-ln-copy"></i><span>Copy</span>
                        </a>
                        <a class="btn btn-primary btn-link" v-tooltip.top="'Generate another password'" @click="generateRandomPassword()">
                            <i class="rc rc-ln-loop"></i><span>Regenerate</span>
                        </a>
                    </div>
                </div>
                <input type="text" class="form-control" id="passwordToCopy" v-model="generatedPassword" readonly>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-default" @click="close">Cancel</button>
            <button type="button" class="btn btn-primary" @click="usePassword">Use Password</button>
        </div>
    </div>
</template>

<script>
    import VueSlider from 'vue-slider-component'

    export default {
        props: {
            passwordType: { required: true },
            close: { type: Function, required: true },
            minLength: { default: 6 },
            maxLength: { default: 64 },
            defaultLength: { default: 10 }
        },

        components: {
            VueSlider
        },

        data () {
            return {
                generatedPassword: null,
                passwordLength: 0,
                range: [],
                characterTypes: {
                    uppercase: true,
                    lowercase: true,
                    numbers: true,
                    symbols: true
                },
                icons: {
                    uppercase: 'A-Z',
                    lowercase: 'a-z',
                    numbers: '0-9',
                    symbols: '!@#$'
                }
            }
        },

        mounted () {
            this.passwordLength = this.defaultLength

            for (var i = this.minLength; i <= this.maxLength; i++) {
                this.range.push(i)
            }
            this.generateRandomPassword()
        },

        methods: {
            validateRandomPassword (retVal) {
                if (this.characterTypes.uppercase) {
                    if (!retVal.match(/[A-Z]+/)) {
                        return false
                    }
                }

                if (this.characterTypes.lowercase) {
                    if (!retVal.match(/[a-z]+/)) {
                        return false
                    }
                }

                if (this.characterTypes.numbers) {
                    if (!retVal.match(/[0-9]+/)) {
                        return false
                    }
                }

                if (this.characterTypes.symbols) {
                    if (this.passwordType === 'all') {
                        if (!retVal.match(/[!@#$%^&*()_+~`|}{[\]:?><,./\-=]/)) {
                            return false
                        }
                    } else {
                        if (!retVal.match(/[%*+#^_@+~?.,}:{\-=]/)) {
                            return false
                        }
                    }
                }

                return true
            },

            generateFromCharset(charset) {
                let length = this.passwordLength
                let retVal = ''
                for (let i = 0, n = charset.length; i < length; ++i) {
                    retVal += charset.charAt(Math.floor(Math.random() * n))
                }

                if (this.validateRandomPassword(retVal)) {
                    this.generatedPassword = retVal
                } else {
                    this.generateFromCharset(charset)
                }
            },

            generateRandomPassword () {
                // Credit to hajiklist http://stackoverflow.com/a/1497512
                let charset = ''
                this.generatedPassword = null

                if (this.characterTypes.uppercase) {
                    charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                }

                if (this.characterTypes.lowercase) {
                    charset += 'abcdefghijklnopqrstuvwxyz'
                }

                if (this.characterTypes.numbers) {
                    charset += '0123456789'
                }

                if (this.characterTypes.symbols) {
                    if (this.passwordType === 'all') {
                        charset += '!@#$%^&*()_+~`|}{[]:?><,./-='
                    } else if (this.passwordType === 'database') {
                        // accepted symbol %*+#^_@+~?.,}:{-=
                        charset += '%*+#^_@+~?.,}:{-='
                    }
                }

                if (charset) {
                    this.generateFromCharset(charset)
                }
            },

            usePassword () {
                this.$emit('password-generated', this.generatedPassword)
                this.close()
            }
        }
    }
</script>
