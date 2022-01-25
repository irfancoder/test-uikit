import FormErrors from './FormErrors'

export default class AjaxForm {
    constructor (data) {
        this.originalData = data
        this.submitting = false

        for (let field in data) {
            this[field] = data[field]
        }

        this.errors = new FormErrors()
    }

    data () {
        let data = {}

        for (let property in this.originalData) {
            data[property] = this[property]
        }

        return data
    }

    reset () {
        for (let field in this.originalData) {
            if (typeof this[field] === 'boolean') {
                this[field] = false
            } else {
                this[field] = ''
            }
        }
    }

    addFields (obj) {
        this.originalData = window._.merge(this.originalData, obj)
    }

    submit (requestType, url, { showAlert = true, alertType = 'notie', showErrorAlert = true, errorAlertType = 'swal' } = {}, config) {
        this.submitting = true
        let data = null

        if (requestType === 'delete') {
            data = {
                params: this.data()
            }
        } else {
            data = this.data()
        }

        return new Promise((resolve, reject) => {
            window.enterPage(url, data, { method: requestType, showAlert, alertType, showErrorAlert, errorAlertType }, config).then(res => {
                this.submitting = false
                this.onSuccess(res.data)

                if (res.data.redirect !== undefined) {
                    window.handleRedirect(res.data.redirect)
                }

                resolve(res)
            }).catch(error => {
                this.submitting = false

                if (error.response.status === 422) {
                    this.onFail(error.response.data)
                }

                if (error.response.status === 403) {
                    if (error.response.data.redirect !== undefined) {
                        window.handleRedirect(error.response.data.redirect)
                    }
                }

                reject(error)
            })
        })
    }

    onSuccess (data) {
        if (data.resetForm === false) {
            return
        }

        this.reset()
    }

    onFail (errors) {
        if (errors.errors !== undefined) {
            this.errors.record(errors.errors)
        } else {
            this.errors.record(errors)
        }
    }

    disableButton () {
        if (this.errors.any()) {
            return true
        } else if (this.submitting) {
            return true
        }

        return false
    }
}
