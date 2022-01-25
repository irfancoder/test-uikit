<template>
<pre><code :id="id" :class="[{ 'pre-scrollable': enableScroll }, lang]" v-if="!code"><slot></slot></code><code :id="id" :class="[{ 'pre-scrollable': enableScroll }, lang]" v-else v-html="code"></code></pre>
</template>

<script>
    import hljs from 'highlight.js'
    import 'highlight.js/styles/github-gist.css'

    export default {
        props: {
            id: '',
            lang: '',
            code: null,
            enableScroll: { type: Boolean, default: false }
        },

        mounted () {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block)
            })
        },

        created () {
            hljs.initHighlightingOnLoad()
        }
    }
</script>
