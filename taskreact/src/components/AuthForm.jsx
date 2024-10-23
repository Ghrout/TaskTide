import React, { useState } from "react";
import axios from "axios";
import Background from "./Background";
import StyledInput from "./InputField";
import Message from "./Message";
import LoginImage from "../img/TaskTide-Login.png";
import RegisterImage from "../img/TaskTide-Register.png";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const closeMessage = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const switchModeHandler = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin((prevMode) => !prevMode);
      setIsAnimating(false);
    }, 400);
  };

  const loginHandler = async (email, password) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      const token = response.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      setSuccessMessage("Inicio de sesión exitoso");
      navigate("dashboard");
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage("No hay un usuario creado con este correo.");
      } else {
        setErrorMessage(
          error.response?.data?.message || "Error al iniciar sesión."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const registerHandler = async (name, email, password) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validación de la contraseña
    if (!validatePassword(password)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un carácter especial."
      );
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
      });
      setSuccessMessage("Registro exitoso. Ahora puedes iniciar sesión.");
      
    } catch (error) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(" ");

        if (errorMessages.includes("email")) {
          setErrorMessage("El correo electrónico ya está registrado.");
        } else {
          setErrorMessage(errorMessages);
        }
      } else {
        setErrorMessage(
          error.response?.data?.message || "Error al registrarse."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    loginHandler(email, password);
  };

  const submitHandlerRegister = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    registerHandler(name, email, password);
  };
  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-[#fff]">
      {isLoading && <Loader />}{" "}
      {/* Mostrar el Loader cuando isLoading sea true */}
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
                  {isLoading ? null : "Iniciar Sesión"}
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
                  className="w-full mt-16 rounded-lg transition-opacity duration-400 shadow-md"
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
                Crea tu cuenta nueva en TaskTide
              </h2>
              <h3
                className={`text-center text-black transition-opacity duration-400 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
              >
                Es rápido y fácil
              </h3>
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
                  disabled={isLoading}
                >
                  {isLoading ? null : "Registrarse"}
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
