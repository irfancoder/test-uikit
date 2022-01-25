<template>
    <div>
        <span v-if="log == '-'">{{ log }}</span>
        <a v-else role="button" @click="viewLog">{{ excerpt }}</a>
    </div>
</template>


<script>
    export default {
        props: {
            title: { required: true },
            excerpt: { required: true },
            log: { required: true }
        },

        methods: {
            viewLog () {
                window.swal.fire({
                    title: this.title,
                    customClass: {
                        container: 'rc-swal'
                    },
                    html: `<pre>${this.log}</pre>`,
                    width: 800,
                    confirmButtonText: 'Close'
                })
            }
        }
    }
</script>
