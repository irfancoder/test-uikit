<template>
    <div class="flex-shrink-0" :class="customClass">
        <img v-if="type === 'gravatar'" :src="model.gravatar" loading="lazy" class="rounded-full flex-shrink-0" :style="generateSize">
        <short-text :text="model.name" class="flex-shrink-0 text-center uppercase rounded-full" :style="[generateSize, generateShortTextStyle]" v-else></short-text>
    </div>
</template>

<script>
    import ColorHash from 'color-hash'

    export default {
        props: {
            size: { type: Number, default: '32' },
            model: { type: Object },
            type: { required: true, type: String },
            customClass: { required: false, type: String },
            bgColor: { type: String, required: false },
            textColor: { type: String, required: false }
        },

        computed: {
            generateShortTextStyle () {
                if (this.bgColor && this.textColor) {
                    return {
                        'font-size': `${this.size / 3}px`,
                        'background': this.bgColor,
                        color: this.textColor,
                        'line-height': `${this.size}px`
                    }
                }

                let colorHash = new ColorHash({ lightness: 0.65 })
                let color = colorHash.hex(this.model.name)

                return {
                    'font-size': `${this.size / 3}px`,
                    'background-image': `linear-gradient(180deg, ${color} 0%, ${this.lightenColor(color, -15)} 100%)`,
                    color: this.lightenColor(color, -40),
                    'line-height': `${this.size}px`
                }
            },

            generateSize () {
                return {
                    height: `${this.size}px`,
                    width: `${this.size}px`
                }
            }
        }
    }
</script>
