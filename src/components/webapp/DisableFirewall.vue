<template>
    <form @submit.prevent="submitForm(form, $event, 'Web Application Firewall', 'Add', 'Add/Update WAF', null, _.pick(form, ['isEnabled']))" :action="url" role="form">
        <input type="submit" class="btn btn-primary inline-block" value="Disable WAF">
    </form>
</template>

<script>
    import AjaxForm from '@/classes/AjaxForm'

    export default {
        props: {
            url: { type: String, required: true }
        },

        computed: {
            form () {
                return new AjaxForm({
                    isEnabled: false
                })
            }
        }
    }
</script>
