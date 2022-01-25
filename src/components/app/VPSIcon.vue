<template>
    <svg-icon height="24" width="24" :icon="iconClass"></svg-icon>
</template>

<script>
    export default {
        props: {
            provider: { required: true, type: String },
            customClass: {}
        },

        data: () => ({
            iconClass: null
        }),

        created () {
            let p = this.provider.toLowerCase()

            if (p === 'digitalocean' || p === 'digital ocean' || p === 'do') {
                this.iconClass = 'br-digitalocean'
            } else if (p === 'upcloud') {
                this.iconClass = 'br-upcloud'
            } else if (p === 'linode') {
                this.iconClass = 'br-linode'
            } else if (p === 'vultr') {
                this.iconClass = 'br-vultr'
            } else if (p === 'aws' || p === 'amazon web service') {
                this.iconClass = 'br-aws'
            } else if (p === 'azure') {
                this.iconClass = 'br-azure'
            } else if (p === 'gcp' || p === 'google cloud platform') {
                this.iconClass = 'br-gcp'
            } else if (p === 'cloudflare') {
                this.iconClass = 'br-cloudflare'
            } else if (p === 'hetzner') {
                this.iconClass = 'br-hetzner'
            } else if (p === 'lightsail') {
                this.iconClass = 'br-lightsail'
            } else {
                this.iconClass = 'br-ubuntu'
            }
        }
    }
</script>
