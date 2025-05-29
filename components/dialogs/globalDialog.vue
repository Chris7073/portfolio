<script setup lang="ts">

const { isOpen, data, close } = useDialog();

</script>

<template>

    <Dialog v-model:open="isOpen">
        <DialogContent v-if="data" >
            <DialogHeader v-if="data.title || data.description">
                <DialogTitle v-if="data.title">
                    {{ data.title }}
                </DialogTitle>
                <DialogDescription v-if="data.description">
                    {{ data.description }}
                </DialogDescription>
            </DialogHeader>
            <component :data="data.props" :is="data.body"></component>
            <DialogFooter v-if="data.footer">
            {{ data.footer }}    
            </DialogFooter>
        </DialogContent>
    </Dialog>

</template>