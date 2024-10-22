import React from 'react';
import ReactDOM from 'react-dom/client'; // Importar desde 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'; // Importar BrowserRouter
import App from './App'; // Importar tu componente principal
import './index.css';
import { TaskProvider } from './context/TaskContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <TaskProvider>
            <Router>
                <App />
            </Router>
        </TaskProvider>
    </React.StrictMode>
);
