<script lang="ts" setup>
import { ref, watch } from 'vue'

const steps = ref(0)
const messages = ['Ma davvero? 🤔', 'Sei curiosa.. 🫨', 'Affruntiti 😂', 'Vabene, hai vinto 🫡']
const colors = ['bg-yellow-500', 'bg-rose-500', 'bg-orange-500', 'bg-blue-500']

const shrunk = ref(false)
const confettiPieces = ref<Array<Record<string, string>>>([])

// NUOVO: emoji burst
type EmojiPiece = Record<string, string>
const emojiPieces = ref<EmojiPiece[]>([])

function onGiftClick() {
  shrunk.value = true
  setTimeout(() => {
    steps.value = 5
  }, 300)
}

watch(steps, (v, old) => {
  if (v === 5 && old !== 5) {
    generateConfetti()
    setTimeout(() => spawnEmojiBurst(), 1600) // piccolo delay prima delle emoji
  } else {
    confettiPieces.value = []
    emojiPieces.value = []
  }
})

// CONFETTI come prima
function generateConfetti() {
  const pieces: EmojiPiece[] = []
  const numPieces = 100
  const palette = ['#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#A855F7', '#EC4899']
  
  for (let i = 0; i < numPieces; i++) {
    const angle = Math.random() * 2 * Math.PI
    const radius = 5 + Math.random() * 40
    pieces.push({
      '--bg-color': palette[i % palette.length],
      '--x-end': `${Math.cos(angle) * radius}vw`,
      '--y-end': `${Math.sin(angle) * radius}vh`,
      '--rot-end': `${-500 + Math.random() * 1000}deg`,
      '--delay': `${Math.random() * 200}ms`,
      '--duration': `${800 + Math.random() * 800}ms`,
    })
  }
  confettiPieces.value = pieces
}

// NUOVO: una sola scarica di 30–40 emoji random
function spawnEmojiBurst() {
  const count = 30 + Math.floor(Math.random() * 11) // 30–40
  const chars = ['🤣', '😂', '🤥']
  const pieces: EmojiPiece[] = []
  
  for (let i = 0; i < count; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)]
    const left = Math.random() * 100
    const size = 22 + Math.random() * 26
    const duration = 3500 + Math.random() * 3000
    const delay = Math.random() * 1500
    const drift = (Math.random() * 2 - 1) * 12
    const rotate = (Math.random() * 2 - 1) * 40
    
    pieces.push({
      '--emoji': `"${char}"`,
      '--left': `${left}%`,
      '--size': `${size}px`,
      '--fall-duration': `${duration}ms`,
      '--fall-delay': `${delay}ms`,
      '--drift': `${drift}px`,
      '--rot': `${rotate}deg`,
    })
  }
  emojiPieces.value = pieces
}
</script>

<template>
  <div
    class="h-dvh w-dvw overflow-hidden transition-colors duration-700"
    :class="steps < 4 ? (colors[steps] || 'bg-green-500') : 'bg-gradient-to-br from-pink-200 via-fuchsia-200 to-sky-200'"
  >
    <div class="flex justify-center items-center h-full px-4">
      <Button
        v-if="steps <= 3"
        @click="steps++"
        class="px-10 py-12 text-3xl font-semibold rounded-xl shadow-md bg-white/80 active:scale-95 transition-transform"
      >
        {{ messages[steps] || '' }}
      </Button>

      <div class="relative flex justify-center items-center">
        <Transition name="fade-up">
          <Icon
            v-if="steps >= 4"
            @click="onGiftClick"
            name="fluent-color:gift-20"
            class="!size-[52dvw] md:!size-[34dvw] max-w-[420px] drop-shadow-xl z-10
                   transition-all duration-500 ease-in-out cursor-pointer active:scale-90"
            :class="shrunk ? 'scale-80 -rotate-12 translate-y-24' : 'scale-100 rotate-0 translate-y-0'"
          />
        </Transition>

        <Transition name="fade-up">
          <p
            v-if="steps >= 4"
            class="absolute left-1/2 -translate-x-1/2 z-30
                   bottom-[35dvh] w-full
                   
                   text-3xl md:text-4xl text-black/80 font-bold text-center drop-shadow-lg"
                   :class="steps ===4?'animate-pulse':''"
          >
            Il tuo regalo è..
          </p>
        </Transition>

        <Transition name="note-up">
          <div
            v-if="steps === 5"
            class="absolute left-1/2 -translate-x-1/2 z-30
                   bottom-[60%]
                   bg-white/90 backdrop-blur-sm border border-emerald-500/70
                   shadow-xl rounded-2xl px-6 py-5 w-[50dvw] text-center
                   text-xl md:text-2xl text-neutral-900 font-semibold tracking-tight"
          >
            Pinocchio 🤥
          </div>
        </Transition>
      </div>
    </div>

    <!-- Confetti -->
    <div class="fixed inset-0 z-20 pointer-events-none">
      <div
        v-for="(piece, i) in confettiPieces"
        :key="i"
        class="confetti-piece"
        :style="piece"
      ></div>
    </div>

    <!-- Emoji burst -->
    <div class="fixed inset-0  pointer-events-none blur-[1px]">
      <span
        v-for="(e, i) in emojiPieces"
        :key="i"
        class="emoji-drop"
        :style="e"
        aria-hidden="true"
      ></span>
    </div>
  </div>
</template>

<style scoped>
/* Confetti */
.confetti-piece {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background-color: var(--bg-color);
  animation: explode var(--duration) ease-out var(--delay) forwards;
}
@keyframes explode {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  100% { opacity: 0; transform: translate(var(--x-end), var(--y-end)) scale(0) rotate(var(--rot-end)); }
}

/* Emoji burst */
.emoji-drop {
  position: fixed;
  top: -12vh;
  left: var(--left, 50%);
  transform: translateX(-50%) rotate(var(--rot, 0deg));
  font-size: var(--size, 32px);
  line-height: 1;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,.25));
  animation: emoji-fall var(--fall-duration, 6s) linear var(--fall-delay, 0ms) forwards;
}
.emoji-drop::before {
  content: var(--emoji, "😂");
  display: block;
}
@keyframes emoji-fall {
  0%   { opacity: 0; transform: translate(-50%, -12vh) rotate(var(--rot, 0deg)); }
  10%  { opacity: 1; }
  100% { opacity: 1; transform: translate(calc(-50% + var(--drift, 0px)), 110vh) rotate(calc(var(--rot, 0deg) + 360deg)); }
}
</style>
