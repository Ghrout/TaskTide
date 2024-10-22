// pages/index.js
import React from 'react';
import AuthForm from '../src/components/AuthForm';

const HomePage = () => {
    return (
        <div>
            <h1>Bienvenido a mi aplicación Next.js</h1>     
            <AuthForm />
        </div>
    );
};

export default HomePage;
