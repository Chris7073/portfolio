
export type GlobalDialogPropsData = {
    body: Component,
    footer?: string,
    title?: string,
    description?: string,
    props?: any,
}

const currentDialogData = shallowRef<GlobalDialogPropsData>();
const dialogOpen = ref<boolean>(false);

export function useDialog() {

    const open = (data: GlobalDialogPropsData) => {
        currentDialogData.value = data;
        dialogOpen.value = true;
    }

    const close = () => {
        dialogOpen.value = false;
    }

    return { open, close, isOpen: dialogOpen, data: currentDialogData }
}