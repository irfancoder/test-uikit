<template>
    <div class="v-code">
        <input type="text"
            class="form-control"
            ref="d1"
            v-on:keypress="isNumber()"
            v-on:keyup="keyup(1, $event.target.value)"
            :maxlength=1
            v-model="digitArr[0]">
        <input type="text"
            class="form-control"
            ref="d2"
            v-on:keypress="isNumber()"
            v-on:keyup="keyup(2, $event.target.value)"
            :maxlength=1
            v-model="digitArr[1]">
        <input type="text"
            class="form-control"
            ref="d3"
            v-on:keypress="isNumber()"
            v-on:keyup="keyup(3, $event.target.value)"
            :maxlength=1
            v-model="digitArr[2]">
        <input type="text"
            class="form-control"
            ref="d4"
            v-on:keypress="isNumber()"
            v-on:keyup="keyup(4, $event.target.value)"
            :maxlength=1
            v-model="digitArr[3]">
        <input type="text"
            class="form-control"
            ref="d5"
            v-on:keypress="isNumber()"
            v-on:keyup="keyup(5, $event.target.value)"
            :maxlength=1
            v-model="digitArr[4]">
        <input type="text"
            class="form-control"
            ref="d6"
            v-on:keypress="isNumber()"
            v-on:keyup="keyup(6, $event.target.value)"
            :maxlength=1
            v-model="digitArr[5]">
    </div>
</template>


<script>
    export default {
        data () {
            return {
                digitArr: []
            }
        },

        methods: {
            isNumber: function () {
                let evt = window.event
                var charCode = evt.which ? evt.which : evt.keyCode
                if (
                    charCode > 31 &&
                    (charCode < 48 || charCode > 57) &&
                    charCode !== 46
                ) {
                    evt.preventDefault()
                } else {
                    return true
                }
            },

            keyup (id, value) {
                let evt = window.event
                var charCode = evt.which ? evt.which : evt.keyCode

                if (id) {
                    if (charCode === 37) {
                        if (id > 1) {
                            this.$refs['d' + (id - 1)].focus()
                        }
                    } else if (charCode === 39) {
                        if (id < 6) {
                            this.$refs['d' + (id + 1)].focus()
                        }
                    } else {
                        if (value) {
                            if (id < 6) {
                                this.$refs['d' + (id + 1)].focus()
                            }
                        } else {
                            this.$refs['d' + (id - 1)].focus()
                        }
                    }
                }
                this.$emit('handleDigit', this.digitArr.join(''))
            },

            handleNavRight (id) {
                if (id) {
                    this.$refs['d' + (id + 1)].focus()
                }
            },

            handleNavLeft (id) {
                if (id) {
                    this.$refs['d' + (id - 1)].focus()
                }
            }
        }
    }
</script>
