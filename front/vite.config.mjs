//vite config
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
dotenv.config();
// https://vitejs.dev/config/   

/* 
REACT_APP_BACK_URL=http://localhost:3001
REACT_APP_SECRET_KEY_ASSISTANT=hS8pcnB*7mN8#a?N!SKrSN*3^@Zmkk2yq39vesZ+e5uWH3eabVeH9yKed#sNZ6D%
REACT_APP_BRAND=FLOWTALK
*/
export default defineConfig({
    define: {
        REACT_APP_BACK_URL: `"${process.env.REACT_APP_BACK_URL}"`,
        REACT_APP_SECRET_KEY_ASSISTANT: `"${process.env.REACT_APP_SECRET_KEY_ASSISTANT}"`,
        REACT_APP_BRAND: `"${process.env.REACT_APP_BRAND}"`,
        FILES_API_URL: `"${process.env.FILES_API_URL}"`,
    },
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    }
})