import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // O pintor chegou!

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // Colocamos ele pra trabalhar junto com o React
  ],
})