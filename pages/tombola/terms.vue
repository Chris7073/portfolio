<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

</script>

<template>
    <div class="bg">
        <div class="bg-slate-200/90 dark:bg-background/90 flex flex-col gap-4 justify-center items-center min-h-dvh">
            <Card >

                <CardHeader class="flex justify-between">
                    <CardTitle>Tombola 2.0</CardTitle>
                    <CardDescription>Termini di Servizio</CardDescription>
                </CardHeader>
<CardContent>
  <ul class="list-disc list-inside space-y-2 text-sm leading-relaxed">
    <li>L’app è gratuita e destinata all’intrattenimento personale.</li>
    <li>L’unica regola è divertirsi. Vietato l’uso commerciale o illegale.</li>
    <li>L’app funziona solo offline, senza interazioni tra utenti.</li>
    <li>È fornita “così com’è”, senza garanzie di funzionamento continuo o privo di errori.</li>
    <li>I Termini possono essere aggiornati con futuri rilasci.</li>
  </ul>
</CardContent>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.bg {
    background-image:
        linear-gradient(45deg, var(--primary) 25%, transparent 25%),
        linear-gradient(-45deg, var(--primary) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--primary) 75%),
        linear-gradient(-45deg, transparent 75%, var(--primary) 75%);
    background-size: 100px 100px;
    background-position: 0 0, 0 100px, 100px -100px, -100px 0;
}
</style>
