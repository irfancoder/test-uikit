<template>
    <button role="button" @click="viewKey"><code :id="`ssh-${title}`">{{ excerpt }}</code></button>
</template>

<script>
    export default {
        props: {
            title: { required: true },
            excerpt: { required: true },
            publicKey: { required: true }
        },

        methods: {
            viewKey () {
                window.swal.fire({
                    title: this.title,
                    closeButtonHtml: '<i class="rc rc-ln-cross rc-ln-semibold text-misc-700"></i>',
                    html: `
                    <div class="flex space-x-4 justify-end align-baseline"> 
                        <button class="btn btn-primary btn-link btn-clipboard float-right" v-tooltip.top="'Copy'" data-clipboard-target="#ssh-key" data-copied-message="Copied! You can now use this key for Git Deployment for user ${this.user}">
                            <i class="rc rc-ln-copy"></i><span>Copy</span>
                        </button>
                    </div>
                    <br />
                    <pre class="whitespace-pre-wrap break-all mb-0" id="ssh-key">${this.publicKey}</pre>
                    
                    
                    
                    `,
                    width: 800,
                    customClass: {
                        container: 'rc-swal'
                    },
                    confirmButtonClass: 'btn btn-default',
                    confirmButtonText: 'Close'
                })
            }
        }
    }
</script>
