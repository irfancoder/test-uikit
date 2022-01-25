<template>
    <div class="server-installation-note">
        <div class="grid grid-cols-1 md:grid-cols-3">
            <div class="col-span-1 md:col-span-2" v-if="type === 'ipaddress'">
                <h5 class="title font-bold">Installation Note</h5>
                <p>Before you proceed, have some time to read the instructions below. This will help you get your first server up and running quickly.</p>
                <div class="content ml-8">
                    <ol>
                        <li>You need to have a cloud Virtual Private Server (VPS) hosting first to use RunCloud.</li>
                        <li>You need to manually create server on your VPS provider first.</li>
                        <li v-if="webServer == 'ols'">Ensure that you are using or create a <strong>fresh Ubuntu server (18.04/20.04 LTS 64bit)</strong>.</li>
                        <li v-else>Ensure that you are using or create a <strong>fresh Ubuntu server (16.04/18.04/20.04 LTS 64bit)</strong>.</li>
                        <li>RunCloud will not work on existing production server</li>
                        <li>
                            RunCloud would not work with NAT VPN and OpenVZ.
                            <a href="https://runcloud.io/docs/guide/server-management/getting-started" class="font-semibold" target="_blank" alt="noopener noreferrer">What is this?</a>
                        </li>
                        <li>
                            Please enable inbound traffic for 80/tcp, 443/tcp and 34210/tcp if you are using external firewall. Read
                            <a href="https://runcloud.io/docs/guide/server-management/getting-started#requirements" class="font-semibold" target="_blank" alt="noopener noreferrer">here</a> on how to enable it.
                        </li>
                    </ol>
                </div>
            </div>
            <div class="col-span-1 md:col-span-2" v-if="type === 'build'">
                <h5 class="title font-bold">Installation Note</h5>
                <p>Before you proceed, have some time to read the instructions below. This will help you get your first server up and running quickly.</p>
                <div class="content ml-8">
                    <ol>
                        <li>You first need to have a cloud VPS provider account.</li>
                        <li>
                            Get and add VPS provider API key. Read <a :href="provider.creation_url" :alt="provider.name" target="_blank" class="font-semibold" rel="noreferrer">here</a> on how to generate and add your VPS provider API key.
                        </li>
                        <li>Choose your desired instance setup and we will deploy it for you</li>
                    </ol>
                </div>
            </div>
            <div class="hidden md:block">
                <img src="~img/reading.svg" style="height: 320px;" loading="lazy" class="img-responsive" alt="illustration-reading" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            type: String,
            provider: Object,
            webServer: String
        }
    }
</script>

<style lang="scss" scoped>
.server-installation-note {
    @apply bg-gray-100 box-border border;
    border-radius: 2px;
    margin-bottom: 24px;
    padding: 32px;

    .title {
        margin: unset;
        padding: unset;
        font-size: 20px;
        margin-bottom: 8px;
    }

    p {
        color: #4e5a65;
        line-height: 1.5;
    }

    ol {
        list-style-type: none;
        counter-reset: li;

        li {
            padding: 8px 16px;
            line-height: 32px;

            &::before {
                @apply bg-gray-300;
                counter-increment: li;
                content: counter(li, decimal-leading-zero);
                color: #0A0A0B;
                font-size: 14px;
                position: absolute;
                margin-left: -48px;
                height: 32px;
                width: 32px;
                line-height: 32px;
                display: inline-block;
                text-align: center;
                border-radius: 100px;
            }
        }
    }
}
</style>
