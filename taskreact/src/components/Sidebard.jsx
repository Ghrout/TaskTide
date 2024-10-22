import React, { useEffect, useState } from "react"; // Importar React y los hooks necesarios
import axios from "axios"; // Importar axios para realizar solicitudes HTTP
import "../css/sidebard.css"; // Importar estilos CSS para el componente
import avatar from "../img/img-profile/12.jpg"; // Importar la imagen del avatar
import out from "../assets/out.png"; // Importar el icono de cerrar sesión
import settings from "../assets/settings.png"; // Importar el icono de ajustes
import profile from "../assets/profile.png"; // Importar el icono de perfil
import home from "../assets/home.png"; // Importar el icono de inicio
import { useNavigate } from "react-router-dom"; // Importar el hook useNavigate para la navegación

/**
 * Componente Sidebard
 *
 * Este componente representa una barra lateral que muestra el nombre de usuario, su rol y
 * proporciona opciones de navegación dentro de la aplicación, como acceder al perfil o cerrar sesión.
 */
function Sidebard() {
  const [username, setUsername] = useState(""); // Estado para almacenar el nombre de usuario
  const navigate = useNavigate(); // Inicializar el hook useNavigate para redirigir a otras rutas

  // Obtener email y token desde localStorage
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  /**
   * Función para alternar la visibilidad de la barra lateral.
   */
  const toggleSidebar = () => {
    document.body.classList.toggle("open"); // Alternar la clase "open" en el body para mostrar/ocultar la barra lateral
  };

  useEffect(() => {
    /**
     * Función asíncrona para obtener el nombre de usuario desde la API.
     * Se realiza una solicitud GET al endpoint de usuarios utilizando el email y el token para autenticación.
     */
    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users?email=${email}`, // Endpoint de la API
          {
            headers: {
              Authorization: `Bearer ${token}`, // Incluir el token en los headers para autorización
            },
          }
        );
        // console.log("Respuesta de la API:", response.data); // Verificar la respuesta de la API

        // Acceder al nombre directamente desde el objeto de respuesta
        const fetchedName = response.data.name; // Obtener el nombre del usuario

        // Verificar si fetchedName es válido
        if (fetchedName) {
          setUsername(fetchedName); // Establecer el nombre de usuario en el estado
          // console.log("Nombre de usuario recibido:", fetchedName);
        } else {
          console.warn("El nombre de usuario es undefined o null"); // Advertir si el nombre es inválido
          setUsername(email); // Usar el email como fallback
        }
      } catch (error) {
        // console.error("Error al obtener el nombre de usuario:", error); // Manejar errores en la solicitud
        setUsername(email); // Usar el email como fallback en caso de error
      }
    };

    if (email) {
      fetchUsername(); // Llamar a la función si hay un email en localStorage
    }
  }, [email, token]); // Dependencias del useEffect, se ejecuta al cambiar email o token

  /**
   * Función para cerrar sesión.
   * Limpia el localStorage y redirige a la página de inicio de sesión.
   */
  const handleSignOut = () => {
    localStorage.clear(); // Limpiar todo el localStorage al cerrar sesión
    navigate("/"); // Redirigir a la página de inicio de sesión
  };

  /**
   * Función para redirigir al perfil del usuario.
   * Cambia la ruta a "/profile" cuando se hace clic en el botón del perfil.
   */
  const handleProfileClick = () => {
    navigate("/profile"); // Redirigir a la ruta del perfil del usuario
  };

  // Renderizar el componente
  return (
    <>
      <button type="button" className="burger" onClick={toggleSidebar}>
        <img className="burger-avatar" src={avatar} alt="Avatar" />{" "}
        {/* Avatar del usuario */}
        <span className="burger-icon"></span> {/* Icono del botón de menú */}
      </button>
      <div className="overlay"></div>{" "}
      {/* Capa de fondo para cerrar la barra lateral */}
      <aside className="sidebar">
        {" "}
        {/* Barra lateral */}
        <img className="sidebar-avatar" src={avatar} alt="Avatar" />{" "}
        {/* Imagen del avatar en la barra lateral */}
        <div className="sidebar-username">
          {username || email || "frontendjoe"}{" "}
          {/* Mostrar el nombre de usuario, email o un nombre predeterminado */}
        </div>
        <div className="sidebar-role">Frontend Developer</div>{" "}
        {/* Mostrar rol del usuario */}
        <nav className="sidebar-menu">
          {/* Botón para ir al perfil */}
          <button type="button" onClick={handleProfileClick}>
            <img src={profile} alt="Profile Icon" className="avatar" />{" "}
            {/* Icono de perfil */}
            <span>Perfil</span> {/* Texto del botón */}
          </button>
        </nav>
        <nav className="sidebar-menu bottom">
          {/* Botón para cerrar sesión */}
          <button type="button" onClick={handleSignOut}>
            <img src={out} alt="Sign Out Icon" /> {/* Icono de cerrar sesión */}
            <span>Cerrar Sesión</span> {/* Texto del botón */}
          </button>
        </nav>
      </aside>
      <h2>Dashboard</h2> {/* Título de la sección principal */}
    </>
  );
}

export default Sidebard; // Exportar el componente para su uso en otros archivos
