<template>
    <a v-if="buttonType == 'button'" :class="[buttonClass]" role="button" @click="attemptDelete">
        <i :class="buttonIcon" v-if="buttonIcon"></i>
        <span>{{ buttonText }}</span>
    </a>

    <a v-else-if="buttonType == 'html'" :class="[buttonClass]" role="button" @click="attemptDelete" v-html="buttonText" v-tooltip.top="hoverTitle"></a>
</template>

<script>
export default {
    props: {
        title: { required: true },
        alertText: { type: String, required: false },
        warningText: { type: String, required: false },
        errorText: { type: String, required: true },
        text: { type: String, required: true },
        requireInput: { type: Boolean, required: true },
        buttonType: { default: 'button', required: true },
        buttonClass: { default: 'btn btn-danger btn-act' },
        buttonIcon: { default: 'rc rc-ln-trash' },
        buttonText: { default: 'Delete' },
        inputLabel: {},
        fieldName: {},
        fieldNameDeleteCheck: { type: String, default: null },
        url: { required: true },
        method: { default: 'post' },
        emptyRejectMessage: { default: 'You should write name of the item that you want to delete' },
        inputPlaceholder: { default: 'Insert the item id that you wish to remove' },
        cancelText: { default: 'Cancel' },
        deleteText: { default: 'Delete' },
        analyticCategory: {},
        analyticAction: {},
        postData: { type: Object, default: () => { } },
        paramKey: { type: String, default: null },
        paramId: { type: String, default: null },
        alertType: { default: 'notie' }
    },
    methods: {
        attemptDelete () {
            let self = this

            window.swal.fire({
                title: self.title,
                html: `
                <div class="${self.alertText ? 'alert alert-danger' : 'hidden'}"> ${self.alertText} </div>
                <div class="${self.warningText ? 'alert alert-warning' : 'hidden'}"> ${self.warningText} </div>
                <div> ${self.text ? self.text : ''}</div>
                `,
                customClass: {
                    container: 'rc-swal'
                },
                showCloseButton: true,
                closeButtonHtml: '<i class="rc rc-ln-cross rc-ln-semibold text-misc-700"></i>',
                input: self.requireInput ? 'text' : null,
                inputPlaceholder: self.fieldNameDeleteCheck,
                showCancelButton: true,
                confirmButtonText: self.deleteText,
                showLoaderOnConfirm: true,
                inputValidator: (value) => {
                    if (!value || value !== self.fieldNameDeleteCheck) {
                        return self.errorText
                    }
                },
                preConfirm (value) {
                    return new Promise((resolve, reject) => {
                        if (self.inputType !== null && (!value || value === '')) {
                            reject(self.emptyRejectMessage)
                            return
                        } else if (self.fieldNameDeleteCheck !== null && self.fieldNameDeleteCheck !== value) {
                            reject(new Error(`Wrong ${self.fieldName} supplied`))
                            return
                        }

                        let data = {}
                        if (self.inputType !== null) data[self.fieldName] = value
                        if (self.postData !== undefined) data = self.postData
                        if (self.paramKey !== null) { data = { [self.paramKey]: self.getDeleteOptions(self.paramKey) } }

                        window.enterPage(self.url, data, { method: self.method, showAlert: true }).then(response => {
                            if (self.analyticCategory !== '' && self.analyticCategory !== null) {
                                self.analyticEvent(self.analyticCategory, 'Click', self.analyticAction)
                            }
                            resolve(response)
                        }).catch(error => {
                            if (error.response.status === 422) {
                                let validationMessage = error.response.data.errors[self.fieldName]?.[0] ?? Object.values[error.response.data][0]

                                window.swal.showValidationMessage(validationMessage)
                                resolve()
                            }
                        })
                    })
                }
            }).then((response) => {
                self.$emit('deleted')
                if (response.value?.data.redirect !== undefined) {
                    window.handleRedirect(response.value.data.redirect)
                }
            }).catch(window.swal.noop)
        },
        getDeleteOptions (paramKey) {
            switch (paramKey) {
            case 'deleteUser':
            case 'deleteAll':
                return document.getElementById(paramKey).checked // DeleteDatabase & DeleteSSHKeyVault
            default:
                return document.getElementById(this.paramId).value // DeleteADWebApp,DeleteProject
            }
        }
    }
}
</script>
