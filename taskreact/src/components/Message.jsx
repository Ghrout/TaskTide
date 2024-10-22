import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
} from "react-icons/fa"; // Importar los iconos

/**
 * Componente de mensaje que muestra un mensaje en la pantalla
 * basado en el tipo de alerta proporcionado.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - El mensaje a mostrar
 * @param {'success' | 'error' | 'alert'} props.type - Tipo de mensaje (success, error, alert)
 * @param {Function} [props.onClose] - Función opcional que se llama cuando se cierra el mensaje
 */
const Message = ({ message, type, onClose = () => {} }) => {
  // Estado que controla la visibilidad del mensaje
  const [isVisible, setIsVisible] = useState(true);
  // Estado que controla el cierre del mensaje
  const [isClosing, setIsClosing] = useState(false);

  // Clases CSS para los diferentes tipos de mensajes
  const messageClasses = {
    success: "text-green-800 bg-green-100 border-green-300",
    error: "text-red-800 bg-red-100 border-red-300",
    alert: "text-yellow-800 bg-yellow-100 border-yellow-300",
  };

  useEffect(() => {
    // Temporizador que controla la duración del mensaje
    const timer = setTimeout(() => {
      setIsClosing(true); // Iniciar la animación de cierre
      setTimeout(() => {
        onClose(); // Llamar a la función de cierre después de que la animación se complete
      }, 300);
    }, 3000); // Duración del mensaje en milisegundos

    // Limpieza del temporizador al desmontar el componente
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`flex items-center p-4 mb-4 border-l-4 ${
        messageClasses[type]
      } rounded-lg shadow-md transition-opacity duration-300 transform ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      role="alert" // Indica que es un alerta
      style={{ display: isClosing ? "none" : "flex" }} // Controla la visualización
    >
      <div className="flex-shrink-0">
        {/* Mostrar icono correspondiente según el tipo de mensaje */}
        {type === "success" && (
          <FaCheckCircle className="w-5 h-5 text-green-600" />
        )}
        {type === "error" && (
          <FaExclamationCircle className="w-5 h-5 text-red-600" />
        )}
        {type === "alert" && (
          <FaExclamationTriangle className="w-5 h-5 text-yellow-600" />
        )}
      </div>
      <div className="ml-3">{message}</div> {/* Mostrar el mensaje */}
    </div>
  );
};

export default Message;
