// Front/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./index.html",                     // HTML principal
	  "./src/**/*.{ts,html,js,jsx,tsx}",  // Todos os arquivos relevantes em src e subpastas
	],
	theme: {
		extend: {
		  colors: {
			foreground: 'hsl(var(--foreground))',
			background: 'hsl(var(--background))',
			// outros tokens se necessário
		  },
		},
	  },
	plugins: [],
  }