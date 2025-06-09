<script setup lang="ts">
definePageMeta({ middleware: 'auth-dashboard' })
useHead({
  title:'Admin Panel',
})
import { ref } from 'vue'
import {
    PinInput,
    PinInputGroup,
    PinInputInput,
} from '@/components/ui/pin-input'

const router = useRouter();
const pinCode = ref<string[]>([]);
const userMail = ref<string>('');
const { user } = useUserSession();


const checkLogin = computed(() => {
    if (pinCode.value.length === 5) return true;
    return false;
});

const { fetch: refreshUserSession } = useUserSession();

async function loginUser() {
  try {
    const data = await $fetch<{ success: boolean; message?: string; [key: string]: any }>('/api/auth/login', {
      method: 'POST',
      body: {
        code: pinCode.value, 
        mail: userMail.value,   
      },
    });
    if (data.success) {
      await refreshUserSession();
      await navigateTo('/dashboard/');
    } else {
      pinCode.value = []; 
      userMail.value = '';
      showToast(data.message || 'Credenziali non corrette', 'error');
    }
  } catch (error: any) {

    pinCode.value = []; 
    userMail.value = '';
    console.error('Errore durante il tentativo di login:', error);
    const serverErrorMessage = error.data?.message || error.data?.body?.message || 'Errore durante il login. Riprova.';
    showToast(serverErrorMessage, 'error');
  }
}
</script>
<template>
  <div class="flex justify-center h-screen w-full bg-slate-200 dark:bg-slate-900">
    <div class="content-center">
      <Card class="w-100 h-fit bg-white dark:bg-slate-950 dark:border dark:border-slate-800">
        <CardHeader class="text-center">
          <CardTitle class="text-xl text-slate-800 dark:text-slate-50">Login</CardTitle>
          <CardDescription class="dark:text-slate-400">Use your private code for accessing</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div>
            <Label class="dark:text-slate-200">User Mail</Label>
            <Input 
              placeholder="User Mail" 
              type="email" 
              v-model="userMail" 
              class="bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500"
            />
          </div>
          <div>
            <Label class="dark:text-slate-200">User Private Code</Label>
            <PinInput class="flex justify-center" id="pin-input" v-model="pinCode" placeholder="o">
              <PinInputGroup>
                <PinInputInput 
                  type="password" 
                  class="w-full h-[4rem] text-xl bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-50" 
                  v-for="(id, index) in 5"
                  :key="id" 
                  :index="index" 
                />
              </PinInputGroup>
            </PinInput>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button 
            @click="router.back()" 
            variant="ghost" 
            class="dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Back
          </Button>
          <Button :disabled="!checkLogin" @click="loginUser">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
