<template>
    <div>
        <div class="flex-row" v-for="(feature, index) in features" :key="index">
            <div class="features">{{ feature.title }}</div>
            <div class="flex-cell">
                <span v-if="_.isString(feature.f)">{{ feature.f }}</span>
                <i :class="`rc rc-ln-${feature.f ? 'tick' : 'cross'}`" v-else></i>
            </div>
            <div class="flex-cell">
                <span v-if="_.isString(feature.b)">{{ feature.b }}</span>
                <i :class="`rc rc-ln-${feature.b ? 'tick' : 'cross'}`" v-else></i>
            </div>
            <div class="flex-cell">
                <span v-if="_.isString(feature.p)">{{ feature.p }}</span>
                <i :class="`rc rc-ln-${feature.p ? 'tick' : 'cross'}`" v-else></i>
            </div>
            <div class="flex-cell">
                <span v-if="_.isString(feature.bu)">{{ feature.bu }}</span>
                <i :class="`rc rc-ln-${feature.bu ? 'tick' : 'cross'}`" v-else></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        isWorkspace: { type: Boolean, default: false }
    },
    created() {
        if (this.isWorkspace) {
            this.features.splice(4, 1)
        }
    },
    data: () => ({
        features: [
            {
                title: 'Total connected server',
                f: '1',
                b: '1',
                p: 'Unlimited',
                bu: 'Unlimited'
            },
            {
                title: 'Graph of data transferred out per web application',
                f: 0,
                b: 'Daily only',
                p: 'Daily only',
                bu: 'Daily & Monthly'
            },
            {
                title: 'Reports server load, memory and hard disk usage for your servers',
                f: 0,
                b: 'Hourly only',
                p: 'Hourly only',
                bu: 'Hourly & Daily'
            },
            {
                title: 'WordPress site staging',
                f: 0,
                b: '1',
                p: '10',
                bu: 'Unlimited'
            },
            {
                title: 'Team Management. Share server with team based on permission given',
                f: 0,
                b: 0,
                p: 0,
                bu: 1
            },
            {
                title: 'Atomic Git Deployment',
                f: 0,
                b: 0,
                p: 0,
                bu: 1
            },
            {
                title: 'RunCache (WordPress caching system)',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Server health check',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Unlimited Web Applications',
                f: 1,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Multiple PHP versions',
                f: 1,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Script Installer. Download popular PHP scripts and place them inside Web Applications with a single click',
                f: 1,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Unlimited domain names per web application',
                f: 1,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Database operations. Add, delete and change passwords for each database',
                f: 1,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Change auto-update settings',
                f: 1,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Offsite Web Application and Database Backup (Additional charges)',
                f: 1,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Summary of data transfer per Web Application for yesterday and current month',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Git Deployment (clone, change branch, webhook for automatic pull, custom deployment scripts)',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: "SSL/TLS by Let's Encrypt or a custom SSL/TLS provider (Verisign, Comodo, etc)",
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'File Manager. Add, edit, delete, rename, change file or folder permissions, plus a code editor',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Modify Nginx and PHP Settings. Tweak values depending on your Web Application needs',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Server Health check. Reports current server load, memory and hard disk usage for your servers',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Server Health notification. Notifies you via email, Slack and/or Telegram when server health is in bad shape',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Manage Supervisord jobs',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Manage Cron jobs',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Change PHP CLI version',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Hook a server job to your Slack Channel/Telegram',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'View a server job log',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Manage service (start, stop, reload) for NGiNX, HTTPD, MariaDB, Supervisord, Beanstalkd, Redis and Memcached',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Manage firewall. Open or close ports globally or for certain IP Addresses',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Manage SSH public key for your server',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Manage multiple server users',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Change password for users',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'RunCloud Hub plugin',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Magic Link via RunCloud Hub',
                f: 0,
                b: 0,
                p: 0,
                bu: 1
            },
            {
                title: 'Clone web application',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'WordPress Canvas',
                f: 0,
                b: 0,
                p: 0,
                bu: 1
            },
            {
                title: 'Site authentication',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Change web application owner',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Fix file and folder ownership',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'SSH Key Vault',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Cloudflare DNS Manager',
                f: 0,
                b: 1,
                p: 1,
                bu: 1
            },
            {
                title: 'Web Application Firewall (WAF)',
                f: 0,
                b: 0,
                p: 0,
                bu: 1
            },
            {
                title: 'Custom NGINX configuration',
                f: 0,
                b: 0,
                p: 1,
                bu: 1
            }
        ]
    })
}
</script>
<style lang="scss" scoped>
.features {
    display: block;
    width: 50%;
}
</style>
