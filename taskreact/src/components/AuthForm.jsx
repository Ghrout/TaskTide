import React, { useState } from "react";
import axios from "axios";
import Background from "./Background";
import StyledInput from "./InputField";
import Message from "./Message";
import LoginImage from "../img/TaskTide-Login.png";
import RegisterImage from "../img/TaskTide-Register.png";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const navigate = useNavigate(); // Crear una instancia de navigate, que permite redirigir a diferentes rutas dentro de la aplicación.
  const [isLogin, setIsLogin] = useState(true); // Estado para determinar si el componente está en modo inicio de sesión o registro.
  const [isAnimating, setIsAnimating] = useState(false); // Estado para controlar animaciones durante el cambio de modo.
  const [errorMessage, setErrorMessage] = useState(""); // Estado para almacenar mensajes de error.
  const [successMessage, setSuccessMessage] = useState(""); // Estado para almacenar mensajes de éxito.
  const [isLoading, setIsLoading] = useState(false); // Estado que indica si la operación (login o registro) está en curso.
  const [message, setMessage] = useState(""); // Estado para almacenar un mensaje genérico.
  const [messageType, setMessageType] = useState(""); // Estado para definir el tipo de mensaje (éxito o error).
  const [showMessage, setShowMessage] = useState(false); // Estado que controla la visibilidad del mensaje.

  const showMessageHandler = (msg, type) => {
    // Función para mostrar mensajes.
    setMessage(msg); // Establece el mensaje a mostrar.
    setMessageType(type); // Establece el tipo del mensaje (éxito o error).
    setShowMessage(true); // Muestra el mensaje.
  };

  const closeMessage = () => {
    setShowMessage(false); // Cierra el mensaje cuando se llama a esta función.
  };

  const switchModeHandler = () => {
    // Función para alternar entre los modos de login y registro.
    setIsAnimating(true); // Inicia la animación.
    setTimeout(() => {
      setIsLogin((prevMode) => !prevMode); // Cambia el estado isLogin.
      setIsAnimating(false); // Finaliza la animación.
    }, 400); // Retraso de 400 ms antes de cambiar el modo.
  };

  const loginHandler = async (email, password) => {
    // Función para manejar el inicio de sesión.
    setIsLoading(true); // Activa el estado de carga.
    setErrorMessage(""); // Limpia cualquier mensaje de error previo.
    setSuccessMessage(""); // Limpia cualquier mensaje de éxito previo.

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        // Llama a la API para iniciar sesión.
        email,
        password,
      });
      const token = response.data.token; // Obtiene el token de la respuesta.
      // console.log("Token recibido:", token); // Imprime el token en consola.

      localStorage.setItem("token", token); // Almacena el token en localStorage.
      localStorage.setItem("email", email); // Almacena el email en localStorage.
      setSuccessMessage("Inicio de sesión exitoso"); // Establece un mensaje de éxito.

      navigate("dashboard"); // Redirige al usuario al dashboard tras un inicio de sesión exitoso.
    } catch (error) {
      // Maneja errores durante el inicio de sesión.
      if (error.response?.status === 404) {
        setErrorMessage("No hay un usuario creado con este correo."); // Mensaje de error si el usuario no existe.
      } else {
        setErrorMessage(
          error.response?.data?.message || "Error al iniciar sesión."
        ); // Mensaje de error genérico.
      }
    } finally {
      setIsLoading(false); // Desactiva el estado de carga independientemente del resultado.
    }
  };

  const registerHandler = async (name, email, password) => {
    // Función para manejar el registro de un nuevo usuario.
    setIsLoading(true); // Activa el estado de carga.
    setErrorMessage(""); // Limpia cualquier mensaje de error previo.

    try {
      await axios.post("http://127.0.0.1:8000/api/register", {
        // Llama a la API para registrar al usuario.
        name,
        email,
        password,
      });
      setSuccessMessage("Registro exitoso. Ahora puedes iniciar sesión."); // Mensaje de éxito tras registro exitoso.
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al registrarse."); // Mensaje de error si ocurre un fallo.
    } finally {
      setIsLoading(false); // Desactiva el estado de carga.
    }
  };

  const submitHandler = (event) => {
    // Maneja el envío del formulario de inicio de sesión.
    event.preventDefault(); // Previene la acción por defecto del formulario.
    const email = event.target.email.value; // Obtiene el valor del email del formulario.
    const password = event.target.password.value; // Obtiene el valor de la contraseña del formulario.
    // console.log("Email:", email, "Password:", password); // Imprime email y contraseña en consola.
    loginHandler(email, password); // Llama a la función loginHandler con email y contraseña.
  };

  const submitHandlerRegister = (event) => {
    // Maneja el envío del formulario de registro.
    event.preventDefault(); // Previene la acción por defecto del formulario.
    const name = event.target.name.value; // Obtiene el nombre del formulario.
    const email = event.target.email.value; // Obtiene el email del formulario.
    const password = event.target.password.value; // Obtiene la contraseña del formulario.
    // console.log("Nombre:", name, "Email:", email, "Password:", password); // Imprime el nombre, email y contraseña en consola.
    registerHandler(name, email, password); // Llama a la función registerHandler con los datos del formulario.
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-[#fff]">
      <Background />
      <div className="flex justify-between w-full max-w-4xl p-6 relative z-10">
        {isLogin ? (
          <>
            <div
              className={`w-full max-w-md backdrop-blur-md bg-white/35 shadow-lg p-6 transition-opacity duration-400 ease-in-out transform ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <h2
                className={`text-3xl font-semibold text-center text-black transition-opacity duration-400 mt-10 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
              >
                Bienvenido a TaskTide
              </h2>
              {errorMessage && (
                <Message
                  message={errorMessage}
                  type="error"
                  onClose={closeMessage}
                />
              )}
              {successMessage && (
                <Message
                  message={successMessage}
                  type="success"
                  onClose={closeMessage}
                />
              )}
              <form className="mt-4" onSubmit={submitHandler}>
                <StyledInput
                  id="email"
                  label="Correo Electrónico"
                  type="email"
                  name="email"
                  required
                />
                <StyledInput
                  id="password"
                  label="Password"
                  type="password"
                  required={true}
                />
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? "Cargando..." : "Iniciar Sesión"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <span className="text-black">
                  ¿No tienes una cuenta en TaskTide?
                </span>
                <button
                  onClick={switchModeHandler}
                  className="ml-2 text-[#c32cff] hover:underline"
                >
                  Registrarse
                </button>
              </div>
            </div>

            <div
              className={`w-full max-w-md backdrop-blur-md bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg p-6 transition-opacity duration-400 ease-in-out transform ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <div
                className={`text-center text-gray-200 p-4 transition-opacity duration-400 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
              >
                <h3 className={`text-2xl font-semibold mb-2`}>
                  ¡Únete a TaskTide!
                </h3>
                <p className={`text-sm mb-4`}>
                  Gestiona tu productividad y mantén el control de tus
                  proyectos. Inicia sesión para comenzar a organizar tu día.
                </p>
                <img
                  src={LoginImage}
                  alt="Descripción de la imagen"
                  className="w-full mt-4 rounded-lg transition-opacity duration-400 shadow-md"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className={`w-full max-w-md backdrop-blur-md bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg p-6 transition-opacity duration-400 ease-in-out transform ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <div
                className={`text-center text-gray-200 p-4 transition-opacity duration-400 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
              >
                <h3
                  className={`text-3xl font-semibold mb-2 transition-opacity duration-400 ${
                    isAnimating ? "opacity-0" : "opacity-100"
                  }`}
                >
                  ¡Bienvenido a TaskTide!
                </h3>
                <p
                  className={`text-sm transition-opacity duration-400 ${
                    isAnimating ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Regístrate ahora para comenzar a organizar tus tareas y
                  proyectos de manera eficiente.
                </p>
                <img
                  src={RegisterImage}
                  alt="Descripción de la imagen"
                  className="w-full mt-4 rounded-lg transition-opacity duration-400 shadow-md"
                />
              </div>
            </div>

            <div
              className={`w-full max-w-md backdrop-blur-md bg-white/35 shadow-lg p-6 transition-opacity duration-400 ease-in-out transform border-l-0 hover:shadow-xl ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <h2
                className={`text-2xl font-semibold text-center text-black transition-opacity duration-400 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
              >
                Crea tu cuenta en TaskTide
              </h2>
              {errorMessage && (
                <Message
                  message={errorMessage}
                  type="error"
                  onClose={closeMessage}
                />
              )}
              {successMessage && (
                <Message
                  message={successMessage}
                  type="success"
                  onClose={closeMessage}
                />
              )}
              <form className="mt-4" onSubmit={submitHandlerRegister}>
                <StyledInput
                  id="name"
                  label="Nombre Completo"
                  type="text"
                  name="name"
                  required
                />
                <StyledInput
                  id="email"
                  label="Correo Electrónico"
                  type="email"
                  name="email"
                  required
                />
                <StyledInput
                  id="password"
                  label="Contraseña"
                  type="password"
                  name="password"
                  required
                />
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 transform hover:scale-105"
                >
                  {isLoading ? "Cargando..." : "Registrarse"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <span className="text-black">¿Ya tienes una cuenta?</span>
                <button
                  onClick={switchModeHandler}
                  className="ml-2 text-[#c32cff] hover:underline"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
