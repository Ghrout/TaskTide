import React, { useState } from 'react';
import '../css/inputs.css';

const StyledInput = ({ id, label, type, required }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    return (
        <div className="input-container">
            <input
                type={isPasswordVisible && type === "password" ? "text" : type}
                id={id}
                required={required}
            />
            <label htmlFor={id} className="label">{label}</label>
            <div className="underline"></div>
            {type === "password" && (
                <span 
                    className="toggle-password-visibility" 
                    onClick={togglePasswordVisibility} 
                    style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '10px' }}
                >
                    {isPasswordVisible ? '👁️' : '👁️‍🗨️'} {/* Icono para mostrar/ocultar */}
                </span>
            )}
        </div>
    );
};

export default StyledInput;
