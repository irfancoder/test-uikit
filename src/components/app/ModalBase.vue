<template>
    <div class="w-full cursor-auto" @click.stop="">
        <slot name="trigger" :open="openModal"></slot>
        <button v-if="!$scopedSlots.trigger && label" :class="labelClass" @click.prevent="show = true">{{ label }}</button>
        <transition name="modal" v-if="persistent">
            <div class="modal-backdrop fixed w-full h-full top-0 left-0 flex justify-center z-2050 " tabindex="-1" v-show="show" @click.self="enableClickAway ? closeModal() : null">
                <div :class="modalClass" @click.self="enableClickAway ? closeModal() : null">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div>
                                <h4 class="modal-title">{{ title }}</h4>
                                <p class="modal-description" v-if="description">{{ description }}</p>
                                <slot name="header"></slot>
                            </div>
                            <button type="button" class="close" @click.prevent="closeModal">
                                <span aria-hidden="true">
                                    <i class="rc rc-ln-cross"></i>
                                </span>
                            </button>
                        </div>

                        <slot name="form" :close="closeModal"></slot>
                        <template v-if="!$scopedSlots.form">
                            <div class="modal-body">
                                <slot name="content"></slot>
                            </div>
                            <div class="modal-footer">
                                <slot name="action" :close="closeModal">
                                    <button class="btn btn-default" @click.prevent="show = false">Close</button>
                                </slot>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="modal" v-else>
            <div class="modal-backdrop fixed w-full h-full top-0 left-0 flex justify-center z-2050 " tabindex="-1" v-if="show" @click.self="enableClickAway ? closeModal() : null">
                <div :class="modalClass" @click.self="enableClickAway ? closeModal() : null">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div>
                                <h4 class="modal-title">{{ title }}</h4>
                                <p class="modal-description" v-if="description">{{ description }}</p>
                                <slot name="header"></slot>
                            </div>
                            <button type="button" class="close" @click.prevent="closeModal">
                                <span aria-hidden="true">
                                    <i class="rc rc-ln-cross"></i>
                                </span>
                            </button>
                        </div>

                        <slot name="form" :close="closeModal"></slot>
                        <template v-if="!$scopedSlots.form">
                            <div class="modal-body">
                                <slot name="content"></slot>
                            </div>
                            <div class="modal-footer">
                                <slot name="action" :close="closeModal">
                                    <button class="btn btn-default" @click.prevent="closeModal">Close</button>
                                </slot>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        title: { type: String, required: false },
        description: { type: String, required: false },
        label: { type: String, required: false },
        labelClass: { type: String, required: false, default: 'btn btn-primary' },
        modalClass: { type: String, default: 'modal-dialog top-20 outline-none my-0 mx-auto w-11/12 md:w-165 mb-10 xl:w-240 ' },
        persistent: { type: Boolean, required: false, default: false },
        enableClickAway: { type: Boolean, default: true },
        enableEsc: { type: Boolean, default: true },
        openMounted: { type: Boolean, default: false }
    },
    data() {
        return {
            show: false
        }
    },

    mounted() {
        if (this.openMounted) this.openModal()
        if (this.enableEsc) document.addEventListener('keydown', this.attachEscKeyBinding)
    },

    beforeDestroy() {
        if (this.enableEsc) document.removeEventListener('keydown', this.attachEscKeyBinding)
    },

    methods: {
        openModal() {
            this.show = true
        },
        closeModal() {
            this.show = false
            this.$emit('modal-close')
            window.bus.$emit('modal-close')
        },
        attachEscKeyBinding: function(e) {
            if (this.show === true && e.keyCode === 27) this.closeModal()
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-enter-active, .modal-leave-active {
  @apply transition-all ease-in duration-100;
}
.modal-enter, .modal-leave-to {
    @apply transform opacity-0 -translate-y-2;
}
.modal-enter-to, .modal-leave {
    @apply opacity-100;
}
</style>

/** HOW TO USE:

// Plain Modal
    Purpose: To display quick information
    Props:  * title
            * label
            * labelClass
            * enableClickAway
            * enableEsc
            * persistent

    Usage:  <modal-base [...props]>
                <template #content>
                    TODO: Modal Content
                </template>
                <template #action="{ close }">
                    TODO: Modal Action Buttons
                </template>
            </modal-base>

// Form Modal
    Purpose: To be used for complex user actions (eg. select files / remove user etc)
    Require: Create a separate form component inside [./js/forms] that controls the logic of the user actions.
    Props:  * title
            * label
            * labelClass
            * enableClickAway
            * enableEsc
            * persistent

    Usage:  <modal-base [...props]>
                <template #form="{ close }">
                    TODO: Modal Form
                </template>
            </modal-base>

    *** NOTE: Use the passed functions { open, close } to control the modal behavior.

// Custom Trigger Modal
    Purpose: For custom trigger views. Omit [label, labelClass] props
    Props:  * title
            * enableClickAway
            * enableEsc
            * persistent

    Usage:  <modal-base [...props]>
                <template #trigger="{ open }">
                    TODO: Modal Trigger
                </template>
                ... [form OR plain] templates ...
            </modal-base>

// Manage Modal Behavior Dynamically
        Purpose: Trigger modal behavior outside of the usual scope (user click on modal button/etc)
        How: Use ref="refName" & $refs.refName

        Usage:
            * Declare the modal component with ref prop: <modal-base ... ref="refName">...</modal-base>
            * Inside the vue lifecycle, you may use the following methods:
                - Open modal: this.$refs.ref-name.openModal()
                - Close modal: this.$refs.ref-name.closeModal()

// Implementation Example: -- create-backup-instance.vue
 */

