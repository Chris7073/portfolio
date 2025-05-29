<template>
    <div class="flex justify-center p-4">
        <div class="flex flex-col text-center *:text-muted-foreground gap-4">
        <p class="text-[8rem] font-stretch-50%">404</p>
        <Separator label="Page not found" class="p-0.5"/>
        <Button @click="navigateTo('/')" class="!text-white">Homepage</Button>
        </div>
    </div>
</template>