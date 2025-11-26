<template>
    <div class="main">
        <div
            class="dropzone-container"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
        >
            <input
                :id="$props.id"
                type="file"
                :name="$props.name"
                ref="file"
                :accept="$props.accept"
                @change="onChange"
                hidden="hidden"
            />

            <label :for="$props.name" class="file-label">
                <div class="rounded-box flex flex-col justify-center border-2 border-base-content/20 border-dashed"
                     :class="{ 'bg-base-200/60 border-base-content/20': !isDragging, 'bg-primary/10 border-primary': isDragging || files.length}">
                    <div v-if="files.length"
                         class="p-12">
                        <div v-for="file in files"
                             :key="file.name"
                             class="text-center">
                            <p class="text-base-content/50 mb-3">{{ file.name }}</p>
                        </div>
                        <div class="text-center">
                            <button class="btn btn-soft btn-sm btn-primary text-nowrap m0-auto text-sm"
                                    @click="remove(files.indexOf(file))">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m1.41-1.41A8 8 0 1 0 15.66 4.34A8 8 0 0 0 4.34 15.66m9.9-8.49L11.41 10l2.83 2.83l-1.41 1.41L10 11.41l-2.83 2.83l-1.41-1.41L8.59 10L5.76 7.17l1.41-1.41L10 8.59l2.83-2.83z"/></svg>
                                <span>Remove/Replace</span>
                            </button>
                        </div>
                    </div>
                    <div v-else class="text-center cursor-pointer p-12" data-file-upload-trigger="">
                        <p class="text-base-content/50 mb-3 text-sm">Only GPX file is supported. Max file size: 2MB</p>
                        <button class="btn btn-soft btn-sm btn-primary text-nowrap pointer-events-none">
                            <span class="icon-[tabler--file-upload] size-4.5 shrink-0"></span>
                            <span v-if="isDragging">Release to drop files here</span>
                            <span v-else>Drag & Drop to Upload</span>
                        </button>
                        <p class="text-base-content/50 my-2 text-xs">or <b class="link link-animated link-primary font-medium text-sm ml-[5px]">Browse</b></p>
                    </div>
                </div>
            </label>

        </div>
    </div>
</template>

<style scoped>
/*@import '../assets/css/components/fileDropper.css';*/
</style>

<script>
export default {
    props: {
        'id': 'fileInput',
        'name': 'fileInput',
        'accept': '',
    },
    setup(props) {
        //const props = defineProps(['id', 'name', 'accept']);
    },
    data() {
        return {
            isDragging: false,
            files: [],
        };
    },
    methods: {
        onChange() {
            const reader = new FileReader();
            reader.onload = () => {
                localStorage.setItem('reportFile', reader.result);
            }
            reader.readAsText(...this.$refs.file.files);
            this.files.push(...this.$refs.file.files);
            this.$emit('onChange', this.files);
        },
        dragover(e) {
            e.preventDefault();
            this.isDragging = true;
        },
        dragleave() {
            this.isDragging = false;
        },
        drop(e) {
            e.preventDefault();
            const reader = new FileReader();
            this.$refs.file.files = e.dataTransfer.files;
            this.onChange();
            this.isDragging = false;
        },
        remove(i) {
            this.files.splice(i, 1);
        }
    },
};
</script>