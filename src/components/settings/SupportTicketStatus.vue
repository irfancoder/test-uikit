<template>
    <label :class="`badge badge-${className} capitalize`">{{ status }}</label>
    <!-- status
    - new = 
    - pending = 
    - open = 
    - resolved = 
    - closed =  -->
</template>

<script>
    export default {
        props: {
            status: { required: true }
        },

        computed: {
            className () {
                let sts = window._.toLower(this.status)
                if (sts === 'new') { return 'success' }
                if (sts === 'pending') { return 'primary' }
                if (sts === 'open') { return 'warning' }
                if (sts === 'resolved') { return 'success' }

                // closed & waiting on customer
                return 'default'
            }
        }
    }
</script>
