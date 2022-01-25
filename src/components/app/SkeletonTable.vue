<template>
    <div>
        <table class="table table-hover relative">
        <thead>
            <tr v-if="!$slots.header">
                <th v-for="col in cols" :key="col">
                    <vue-content-loading :width="300" :height="24" :speed="speed">
                        <rect x="8" y="4" rx="2" ry="2" :width="parsedWidthCols[col]" height="16" />
                    </vue-content-loading>
                </th>
            </tr>
            <slot name="header"></slot>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="row">
                <td v-for="col in cols" :key="col">
                    <vue-content-loading :width="300" :height="32" :speed="speed">
                        <circle v-if="shouldDisplayImageCircle(col)" cx="16" cy="16" r="16" />
                        <rect v-if="withImage" :x="shouldDisplayImageCircle(col) ?  '40' : centerHorizontal(parsedWidthCols[col-1])" y="8" rx="2" ry="2" :width="parsedWidthCols[col-1]" height="20" />
                        <rect v-else :x="col === 1 ?  '8' : centerHorizontal(parsedWidthCols[col-1])" y="8" rx="2" ry="2" :width="parsedWidthCols[col-1]" height="24"/>
                    </vue-content-loading>
                </td>
            </tr>
        </tbody>
        </table>
    </div>
</template>

<script>
    import { VueContentLoading } from 'vue-content-loading'
    export default {
        components: {
            VueContentLoading
        },
        props: {
            cols: { type: Number, default: 4 },
            rows: { type: Number, default: 4 },
            speed: { type: Number, default: 1 },
            withImage: { type: Boolean, required: false, default: false },
            widthCols: { type: Array, required: false }
        },
        computed: {
            parsedWidthCols () {
                return this.widthCols ? this.widthCols : Array(this.cols).fill(150)
            }
        },
        methods: {
            centerHorizontal (width, maxWidth = 150) {
                return maxWidth - (width / 2)
            },
            shouldDisplayImageCircle (col) {
                return this.withImage && col === 1
            }
        }

    }
</script>