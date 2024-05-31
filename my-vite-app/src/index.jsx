import './index.css';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppProvider } from './contexts/userData/index'

import Home from './pages/Layout'
function App() {
    return (
        <StrictMode>
            <AppProvider>
                <BrowserRouter>
                    <Routes>
                        <Route exact path='/' element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </AppProvider>
        </StrictMode>)
}
const root = createRoot(document.getElementById('root'));

root.render(<App />);
