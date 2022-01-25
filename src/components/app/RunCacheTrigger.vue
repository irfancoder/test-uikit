<template>
    <button @click="doWork" role="button" :class="className">
        <spinner :text="buttonLabel" :working="working"></spinner>
    </button>
</template>

<script>
    export default {
        props: {
            url: String,
            className: String,
            action: String,
            buttonLabel: String,
            actionName: String
        },

        data () {
            return {
                working: false
            }
        },

        methods: {
            doWork () {
                this.working = true

                let data = {
                    action: this.action,
                    actionName: this.actionName
                }

                window.enterPage(this.url, data, { method: 'post', showAlert: true }).then(({data}) => {
                    this.working = false
                }).catch(e => {
                    this.working = false
                })
            }
        }
    }
</script>
