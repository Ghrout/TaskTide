import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebard";
import TaskContext from "../context/TaskContext";
import Message from "./Message";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Dashboard = () => {
  // Obtiene el contexto de la tarea y la función dispatch para manejar acciones.
  const { state, dispatch } = useContext(TaskContext);

  // Estados locales utilizando useState para gestionar diferentes valores en el componente.
  const [newTask, setNewTask] = useState(""); // Para almacenar el nombre de la nueva tarea.
  const [description, setDescription] = useState(""); // Para almacenar la descripción de la tarea.
  const [dueDate, setDueDate] = useState(""); // Para almacenar la fecha de vencimiento de la tarea.
  const [status, setStatus] = useState(""); // Para almacenar el estado actual de la tarea.
  const [priority, setPriority] = useState(""); // Para almacenar la prioridad de la tarea.
  const [editingTaskId, setEditingTaskId] = useState(null); // Para almacenar el ID de la tarea que se está editando.
  const [isLoading, setIsLoading] = useState(true); // Para manejar el estado de carga del componente.
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Para verificar si el usuario está autenticado.
  const [message, setMessage] = useState(null); // Para almacenar mensajes de notificación o errores.
  const [messageType, setMessageType] = useState(null); // Para almacenar el tipo de mensaje (éxito, error, etc.).
  const [filteredTasks, setFilteredTasks] = useState([]); // Inicializa el estado de las tareas filtradas como un array vacío.
  const [filterStatus, setFilterStatus] = useState(""); // Para almacenar el estado de filtro de tareas.
  const [filterPriority, setFilterPriority] = useState(""); // Para almacenar la prioridad de filtro de tareas.
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true); // Estado para el mensaje de bienvenida

  // Hook para la navegación entre rutas en la aplicación.
  const navigate = useNavigate();

  // Función para verificar si hay un token de autenticación en el almacenamiento local.
  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false); // Si no hay token, actualiza el estado de autenticación.
      navigate("/"); // Redirige al usuario a la página de inicio.
      return false; // Devuelve falso si no está autenticado.
    }
    return true; // Devuelve verdadero si el token está presente.
  };

  // Función asíncrona para obtener el ID de un usuario a partir de su correo electrónico.
  const fetchUserIdByEmail = async (email) => {
    try {
      const token = localStorage.getItem("token"); // Obtiene el token de autenticación.
      // Realiza una solicitud GET a la API para obtener el ID del usuario.
      const response = await axios.get(
        `http://127.0.0.1:8000/api/users?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Añade el token en los encabezados de la solicitud.
          },
        }
      );
      return response.data.id; // Devuelve el ID del usuario de la respuesta.
    } catch (error) {
      console.error("Error al obtener el ID del usuario:", error); // Manejo de errores en caso de fallo en la solicitud.
      setIsAuthenticated(false); // Actualiza el estado de autenticación si hay un error.
      navigate("/error"); // Redirige al usuario a la página de error.
      return null; // Devuelve null en caso de error.
    }
  };

  // Función asíncrona para obtener las tareas de un usuario a partir de su ID.
  const fetchTasks = async (userId) => {
    setIsLoading(true); // Establece el estado de carga en verdadero mientras se obtienen las tareas.
    try {
      // Realiza una solicitud GET a la API para obtener las tareas del usuario.
      const response = await axios.get(
        `http://127.0.0.1:8000/api/tasks?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Añade el token de autenticación.
          },
        }
      );

      // Dispara una acción para establecer las tareas en el estado global.
      dispatch({ type: "SET_TASKS", payload: response.data.data });

      // Filtra las tareas obtenidas para incluir solo las del usuario actual.
      const userTasks = response.data.data.filter(
        (task) => task.user_id === userId
      );
      setFilteredTasks(userTasks); // Establece las tareas filtradas en el estado local.
    } catch (error) {
      console.error("Error al obtener las tareas:", error); // Manejo de errores.
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false); // Actualiza el estado de autenticación en caso de un error 401.
        navigate("/error"); // Redirige a la página de error.
      }
    } finally {
      setIsLoading(false); // Establece el estado de carga en falso al finalizar la operación.
    }
  };

  // Efecto que se ejecuta al montar el componente para verificar el token y obtener el ID del usuario.
  useEffect(() => {
    const tokenValid = checkToken(); // Verifica si el token es válido.
    if (tokenValid) {
      const email = localStorage.getItem("email"); // Obtiene el correo electrónico del almacenamiento local.
      const name = localStorage.getItem("name"); 
      fetchUserIdByEmail(email).then((userId) => {
        if (userId) {
          fetchTasks(userId); // Obtiene las tareas del usuario si se obtuvo el ID.
        }
      });
    }
  }, []);

  useEffect(() => {
    // Ocultar el mensaje de bienvenida después de 3 segundos
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 3000);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
  }, []);

  // Efecto que filtra las tareas según el estado y la prioridad seleccionados.
  useEffect(() => {
    const filterTasks = () => {
      let tasks = state.tasks; // Obtiene las tareas del estado global.

      if (filterStatus) {
        tasks = tasks.filter((task) => task.status === filterStatus); // Filtra por estado si está definido.
      }

      if (filterPriority) {
        tasks = tasks.filter((task) => task.priority === filterPriority); // Filtra por prioridad si está definido.
      }

      setFilteredTasks(tasks); // Establece las tareas filtradas en el estado local.
    };

    filterTasks(); // Llama a la función de filtrado.
  }, [filterStatus, filterPriority, state.tasks]); // Dependencias que desencadenan la reejecución del efecto.

  // Si el usuario no está autenticado, muestra un mensaje y no permite el acceso a la página.
  if (!isAuthenticated) {
    return <p>No tienes acceso a esta página. Redirigiendo...</p>;
  }

  // Función asíncrona para agregar una nueva tarea.
  const addTask = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    if (!newTask) return; // No agrega la tarea si el campo está vacío.

    try {
      // Realiza una solicitud POST para agregar la nueva tarea.
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tasks",
        {
          title: newTask, // Título de la nueva tarea.
          description, // Descripción de la tarea.
          due_date: dueDate, // Fecha de vencimiento de la tarea.
          status, // Estado de la tarea.
          priority, // Prioridad de la tarea.
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Añade el token de autenticación.
          },
        }
      );

      dispatch({ type: "ADD_TASK", payload: response.data }); // Dispara acción para agregar la tarea en el estado global.
      setMessage("Tarea agregada correctamente"); // Establece mensaje de éxito.
      setMessageType("success"); // Establece tipo de mensaje como éxito.
      resetForm(); // Reinicia el formulario.
    } catch (error) {
      console.error("Error al agregar la tarea:", error); // Manejo de errores.
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false); // Actualiza el estado de autenticación en caso de un error 401.
        navigate("/error"); // Redirige a la página de error.
      }
    }
  };

  // Función asíncrona para eliminar una tarea.
  const deleteTask = async (id) => {
    try {
      // Realiza una solicitud DELETE para eliminar la tarea.
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Añade el token de autenticación.
        },
      });

      dispatch({
        type: "SET_TASKS", // Dispara acción para actualizar el estado de las tareas eliminando la tarea.
        payload: state.tasks.filter((task) => task.id !== id),
      });
      setMessage("Tarea eliminada correctamente"); // Establece mensaje de éxito.
      setMessageType("success"); // Establece tipo de mensaje como éxito.
    } catch (error) {
      console.error("Error al eliminar la tarea:", error); // Manejo de errores.
      setMessage("Hubo un error al eliminar la tarea"); // Establece mensaje de error.
      setMessageType("error"); // Establece tipo de mensaje como error.
    }
  };

  // Función asíncrona para actualizar una tarea existente.
  const updateTask = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    if (!editingTaskId) return; // No actualiza si no hay ID de tarea en edición.

    try {
      // Realiza una solicitud PUT para actualizar la tarea.
      const response = await axios.put(
        `http://127.0.0.1:8000/api/tasks/${editingTaskId}`,
        {
          title: newTask, // Nuevo título de la tarea.
          description, // Nueva descripción de la tarea.
          due_date: dueDate, // Nueva fecha de vencimiento de la tarea.
          status, // Nuevo estado de la tarea.
          priority, // Nueva prioridad de la tarea.
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Añade el token de autenticación.
          },
        }
      );
      dispatch({ type: "UPDATE_TASK", payload: response.data }); // Dispara acción para actualizar la tarea en el estado global.
      setMessage("Tarea actualizada correctamente"); // Establece mensaje de éxito.
      setMessageType("success"); // Establece tipo de mensaje como éxito.
      resetForm(); // Reinicia el formulario.
    } catch (error) {
      console.error("Error al actualizar la tarea:", error); // Manejo de errores.
      setMessage("Hubo un error al actualizar la tarea"); // Establece mensaje de error.
      setMessageType("error"); // Establece tipo de mensaje como error.
    }
  };

  // Función para reiniciar los campos del formulario.
  const resetForm = () => {
    setNewTask(""); // Reinicia el campo de nuevo título de tarea.
    setDescription(""); // Reinicia el campo de descripción de tarea.
    setDueDate(""); // Reinicia el campo de fecha de vencimiento.
    setStatus(""); // Reinicia el campo de estado.
    setPriority(""); // Reinicia el campo de prioridad.
    setEditingTaskId(null); // Reinicia el ID de tarea en edición.
  };

  // Traducción de estados de las tareas para mostrar en el UI.
  const statusTranslation = {
    in_progress: "En progreso",
    completed: "Completado",
    pending: "Pendiente",
  };

  // Obtiene el token y el correo electrónico del almacenamiento local.
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col p-6">
      <Sidebar email={email} token={token} /> 
      <div className="flex w-full bg-white rounded-lg shadow-lg p-6 space-x-6">
        <div className="flex-1 w-full max-w-md mx-auto">
          {" "}
          {/* Limitar el ancho del formulario */}
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Dashboard de Tareas
          </h1>
          <form
            onSubmit={editingTaskId ? updateTask : addTask}
            className="mb-6 p-6 bg-purple-500 bg-opacity-30 backdrop-blur-md border border-black shadow-lg rounded-lg flex flex-col space-y-6"
          >
            <h2 className="text-2xl font-semibold text-black mb-4 text-center">
              {editingTaskId ? "Edición de tarea" : "Crear una Nueva Tarea"}
            </h2>

            <div className="relative">
              <input
                id="taskInput"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Escribe tu tarea aquí..."
                required
                className="p-4 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out w-full bg-white bg-opacity-80 placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <input
                id="descriptionInput"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción adicional"
                className="p-4 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out w-full bg-white bg-opacity-80 placeholder:text-gray-400"
              />
            </div>

            <input
              id="dueDateInput"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-4 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out w-full bg-white bg-opacity-80 placeholder:text-gray-400"
            />

            <select
              id="statusSelect"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-4 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out w-full bg-white bg-opacity-80 placeholder:text-gray-400"
            >
              <option value="">Selecciona un estado</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completada</option>
            </select>

            <select
              id="prioritySelect"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-4 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out w-full bg-white bg-opacity-80 placeholder:text-gray-400"
            >
              <option value="">Selecciona una prioridad</option>
              <option value="low" className="text-blue-500">
                Baja
              </option>
              <option value="medium" className="text-yellow-500">
                Media
              </option>
              <option value="high" className="text-red-500">
                Alta
              </option>
            </select>

            <button
              type="submit"
              className="w-full p-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              {editingTaskId ? "Actualizar Tarea" : "Agregar Tarea"}
            </button>
          </form>
          {message && <Message type={messageType} message={message} />}
        </div>
      </div>
      <div className="bg-white my-6">
        <h2 className="text-2xl font-semibold text-black mb-4 text-center">
          Filtrar Tareas
        </h2>

        <div className="flex justify-center space-x-4 mb-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-4 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out"
          >
            <option value="">Filtrar por estado</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En progreso</option>
            <option value="completed">Completada</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-4 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out"
          >
            <option value="">Filtrar por prioridad</option>
            <option value="low" className="text-blue-500">
              Baja
            </option>
            <option value="medium" className="text-yellow-500">
              Media
            </option>
            <option value="high" className="text-red-500">
              Alta
            </option>
          </select>
        </div>
      </div>
      <div className="flex w-full bg-white rounded-lg shadow-lg p-6 space-x-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* Asegúrate de que ocupe todo el ancho */}
          {isLoading ? (
            <p>Cargando tareas...</p>
          ) : filteredTasks.length === 0 ? ( // Verificamos si no hay tareas
            <p className="text-center text-black bg-[#ff1212a6] border border-r-amber-200">
              No hay tareas disponibles.
            </p> // Mensaje cuando no hay tareas
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-col p-4 bg-white rounded-lg shadow-lg transition-shadow duration-200 hover:shadow-xl mb-4"
              >
                <div className="flex-1 w-full mb-4">
                  <h3 className="font-semibold text-xl text-center text-gray-800 mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {task.description}
                  </p>
                  <p className="text-gray-600 text-center">
                    Fecha de entrega:{" "}
                    <span className="font-semibold">{task.due_date}</span>
                  </p>
                  <p className="text-gray-600 text-center">
                    Estado:{" "}
                    <span
                      className={`font-semibold ${
                        statusTranslation[task.status] === "En progreso"
                          ? "text-yellow-500 font-bold"
                          : statusTranslation[task.status] === "Completado"
                          ? "text-green-600"
                          : statusTranslation[task.status] === "Pendiente"
                          ? "text-blue-600"
                          : ""
                      }`}
                    >
                      {statusTranslation[task.status]}
                    </span>
                  </p>
                  <p className="text-gray-600 text-center">
                    Prioridad:{" "}
                    <span
                      className={
                        task.priority === "high"
                          ? "text-red-500 font-bold"
                          : task.priority === "medium"
                          ? "text-yellow-500 font-bold"
                          : "text-blue-500 font-bold"
                      }
                    >
                      {task.priority === "high"
                        ? "Alta"
                        : task.priority === "medium"
                        ? "Media"
                        : "Baja"}
                    </span>
                  </p>
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setNewTask(task.title);
                      setDescription(task.description);
                      setDueDate(task.due_date);
                      setStatus(task.status);
                      setPriority(task.priority);
                      setEditingTaskId(task.id);
                    }}
                    className="flex items-center bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                  >
                    <FaEdit className="mr-1" /> Editar
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex items-center bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    <FaTrashAlt className="mr-1" /> Eliminar
                  </button>
                </div>
              </li>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
