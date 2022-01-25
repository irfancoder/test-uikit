<template>
    <div class="modal fade" :id="`img-${id}`" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <input type="checkbox" id="zoomCheck">
                    <label for="zoomCheck">
                        <img :src="src" loading="lazy"/>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            src: { required: true, type: String },
            id: { required: true }
        }
    }
</script>
