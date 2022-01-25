<template>
    <span v-if="buttonType == 'image'" class="action-button" v-tooltip.bottom="hoverTitle">
        <a role="button" @click="run">
            <img :src="image" loading="lazy" :alt="hoverTitle" />
        </a>
    </span>

    <a v-else-if="buttonType == 'button'" :class="[buttonClass]" role="button" @click="run">
        <i :class="buttonIcon" v-if="buttonIcon"></i>
        <span>{{ buttonText }}</span>
    </a>

    <a v-else-if="buttonType == 'html'" :class="[buttonClass]" role="button" @click="run" v-html="buttonText" v-tooltip.top="hoverTitle"></a>
</template>


<script>
export default {
    props: {
        action: { type: String, required: true },
        alertText: { type: String },
        alertType: { default: 'notie' },
        analyticCategory: {},
        analyticAction: {},
        buttonType: { required: true },
        hoverTitle: {},
        buttonIcon: {},
        buttonText: { default: 'Reload' },
        buttonClass: { default: 'btn btn-primary btn-act' },
        confirmButtonText: { default: null },
        confirmButtonClass: { default: 'btn btn-primary' },
        emptyRejectMessage: { default: 'You should write name of the item' },
        errorText: { type: String },
        fieldName: {},
        image: {},
        infoText: { required: false, type: String },
        method: { default: 'post' },
        postData: { type: Object, default: {} },
        requireInput: { type: Boolean, required: true, default: false },
        inputValue: { },
        text: { type: String, required: true },
        title: { type: String, required: true },
        type: { default: 'warning' },
        url: { required: true },
        warningText: { type: String },
        width: { type: String, default: '32rem' }
    },
    methods: {
        run () {
            let self = this

            window.swal.fire({
                title: self.title,
                html: `
                <div class="${self.infoText ? 'alert alert-primary' : 'hidden'}"> ${self.infoText} </div>
                <div class="${self.alertText ? 'alert alert-danger' : 'hidden'}"> ${self.alertText} </div>
                <div class="${self.warningText ? 'alert alert-warning' : 'hidden'}"> ${self.warningText} </div>
                <div> ${self.text ? self.text : ''}</div>
                `,
                width: this.width,
                customClass: {
                    container: 'rc-swal',
                    confirmButton: self.action === 'delete' ? 'swal2-delete' : 'swal2-confirm'
                },
                input: self.requireInput ? 'text' : null,
                inputValue: self.inputValue || null,
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: this.confirmButtonText ? this.confirmButtonText : self.buttonText,
                closeButtonHtml: '<i class="rc rc-ln-cross rc-ln-semibold text-misc-700"></i>',
                showLoaderOnConfirm: true,
                preConfirm (value) {
                    return new Promise((resolve, reject) => {
                        if (self.inputType !== null) self.postData[self.fieldName] = value
                        self.$emit('init')
                        window.enterPage(self.url, self.postData, { method: self.method, showAlert: true }).then(response => {
                            if (self.analyticCategory !== '' && self.analyticCategory !== null) {
                                self.analyticEvent(self.analyticCategory, 'Click', self.analyticAction)
                            }

                            resolve(response)
                        }).catch(error => {
                            if (error.response.status === 422) {
                                let validationMessage = error.response.data.errors[self.fieldName]?.[0] ?? Object.values[error.response.data][0]

                                window.swal.showValidationMessage(validationMessage)
                            }

                            resolve()
                        })
                    })
                }
            }).then(response => {
                self.$emit('completed')

                if (response.value?.data?.redirect !== undefined) {
                    window.handleRedirect(response.value.data.redirect)
                }
            }).catch(window.swal.noop)
        }
    }
}
</script>
