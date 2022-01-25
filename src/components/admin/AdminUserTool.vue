<template>
    <span>
        <button v-if="isAdmin" class="btn btn-info" @click="topupCredit">Top Up Credit</button>
        <button v-if="isTrial" class="btn btn-warning" @click="extendTrial">Extend Trial</button>
    </span>
</template>

<script>
    export default {
        props: {
            isAdmin: Boolean,
            isTrial: Boolean,
            topupUrl: String,
            extendTrialUrl: String
        },

        methods: {
            extendTrial () {
                let that = this
                window
                    .swal.fire({
                        title: 'Extend Trial',
                        showCancelButton: true,
                        confirmButtonText: 'Extend',
                        confirmButtonColor: '#CF000F',
                        cancelButtonText: 'Cancel',
                        showLoaderOnConfirm: true,
                        html: `
                            Please select one of the options below.
                            <br><br>
                            <div class="text-left">
                                <select name="time" id="time" class="form-control" required="required">
                                    <option value="" disabled="disabled" selected>-- Please select one ---</option>
                                    <option value="1">1 day</option>
                                    <option value="3">3 days</option>
                                    <option value="5">5 days</option>
                                    <option value="30">30 days (1 month)</option>
                                    <option value="90">90 days (3 months)</option>
                                    <option value="180">180 days (6 months)</option>
                                    <option value="360">360 days (1 year)</option>
                                </select>
                            </div>
                            `,
                        focusConfirm: false,
                        customClass: {
                            container: 'rc-swal',
                            confirmButton: 'swal2-confirm'
                        },
                        preConfirm: function () {
                            return new Promise((resolve, reject) => {
                                let data = {
                                    time: document.getElementById('time').value
                                }

                                window
                                    .enterPage(that.extendTrialUrl, data, {
                                        method: 'post'
                                    })
                                    .then(response => {
                                        resolve(response)
                                    })
                                    .catch(e => {
                                        if (e.response.status === 422) {
                                            let errors = e.response.data

                                            for (let key in errors) {
                                                if (errors.hasOwnProperty(key)) {
                                                    reject(new Error(errors[key]))
                                                    break
                                                }
                                            }

                                            reject(e)
                                        } else if (e.response.status === 403) {
                                            window.toastr.error(e.response.data.message, 'Oopss!')
                                            // window.swal({
                                            //     title: 'Error',
                                            //     text: e.response.data.message,
                                            //     type: 'error'
                                            // })
                                            // .catch(window.swal.noop)
                                        } else {
                                            reject(e)
                                        }
                                    })
                            })
                        }
                    })
                    .then(function (response) {
                        that.$emit('completed')

                        if (response.data.redirect !== undefined) {
                            window.handleRedirect(response.data.redirect)
                        }
                    })
                    .catch(window.swal.noop)
            },

            topupCredit () {
                let that = this
                window
                    .swal.fire({
                        title: 'Top Up Credit',
                        showCancelButton: true,
                        confirmButtonText: 'Top Up',
                        confirmButtonColor: '#CF000F',
                        cancelButtonText: 'Cancel',
                        showLoaderOnConfirm: true,
                        html: `
                            Please select one of the options below.
                            <br><br>
                            <div class="text-left">
                                <select name="credit" id="credit" class="form-control" required="required">
                                    <option value="" disabled="disabled" selected>-- Please select one ---</option>
                                    ${this.creditRange()}
                                </select>
                            </div>
                            `,
                        focusConfirm: false,
                        customClass: {
                            container: 'rc-swal',
                            confirmButton: 'swal2-confirm'
                        },
                        preConfirm: function () {
                            return new Promise((resolve, reject) => {
                                let data = {
                                    credit: document.getElementById('credit').value
                                }

                                window
                                    .enterPage(that.topupUrl, data, {
                                        method: 'post'
                                    })
                                    .then(response => {
                                        resolve(response)
                                    })
                                    .catch(e => {
                                        if (e.response.status === 422) {
                                            let errors = e.response.data

                                            for (let key in errors) {
                                                if (errors.hasOwnProperty(key)) {
                                                    reject(new Error(errors[key]))
                                                    break
                                                }
                                            }

                                            reject(e)
                                        } else if (e.response.status === 403) {
                                            window.toastr.error(e.response.data.message, 'Oopss!')
                                            // window.swal({
                                            //     title: 'Error',
                                            //     text: e.response.data.message,
                                            //     type: 'error'
                                            // })
                                            // .catch(window.swal.noop)
                                        } else {
                                            reject(e)
                                        }
                                    })
                            })
                        }
                    })
                    .then(function (response) {
                        that.$emit('completed')

                        if (response.value?.data?.redirect !== undefined) {
                            window.handleRedirect(response.value.data.redirect)
                        }
                    })
                    .catch(window.swal.noop)
            },

            creditRange () {
                let options = ''

                for (var i = 1; i <= 100; i++) {
                    options += `<option value="${i}">$${i}</option>`
                }
                return options
            }
        }
    }
</script>
