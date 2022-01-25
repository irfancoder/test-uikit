<template>
    <div class="flex items-center">
        <Flag
            v-if="isFlagAvailable(shortcode)"
            :hasDropShadow="false"
            :hasBorder="false"
            gradient="real-circular"
            :code="checkCountryCode(shortcode)"
            class="inline-block h-8"
            :size="flagSize"/>
        <img v-else class="inline-block h-4 w-6.5 rounded-sm" :src="getMissingFlag(shortcode)" />
        <span v-if="location" class="ml-3" :class="locationClass">{{ location }}</span>
    </div>
</template>

<script>
export default {
    props: {
        shortcode: String,
        location: String,
        locationClass: { default: '' },
        flagSize: { default: 'm' }
    },

    methods: {
        isFlagAvailable(code) {
            let exception = ['DZ', 'IC', 'BQ', 'EA', 'CP', 'XK', 'YT', 'TA']
            return !exception.includes(code)
        },

        checkCountryCode(code) {
            switch (code) {
            case 'GB': // UK
                return 'GB-UKM'
            case 'KN': // Saint Kitts & Nevis
                return 'KN-SK'
            default:
                return code
            }
        },
        getMissingFlag (code) {
            return '/assets/img/flag/' + code.toLowerCase() + '.svg'
        }
    }
}
</script>

