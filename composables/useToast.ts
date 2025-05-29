import { toast } from 'vue-sonner'

export function showToast(message: string, type: 'success' | 'error') {
    return toast[type](type.charAt(0).toUpperCase() + type.slice(1), {
        position: 'top-right',
        description: message,
    })
}