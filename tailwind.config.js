module.export = {
	darkMode: ['class'],
	theme: {
		extend: {
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--reka-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--reka-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [
    // --- INIZIO DELLA MODIFICA ---
    // Aggiungiamo questo plugin
    plugin(function({ addVariant }) {
      // Definiamo una nuova variante chiamata 'is-visible'
      // Il selettore '&.is-visible' dice: "applica questo stile quando
      // l'elemento stesso (&) ha anche la classe .is-visible"
      addVariant('is-visible', '&.is-visible')
    })
    // --- FINE DELLA MODIFICA ---
  ],
	content: [
		'./components/**/*.{vue,js,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./app.vue',
		'./plugins/**/*.{js,ts}',
	],
	purge: { enabled: false }
}