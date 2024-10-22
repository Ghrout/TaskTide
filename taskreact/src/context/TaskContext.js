import React, { createContext, useReducer } from "react";

const initialState = {
  tasks: { data: [] },
};

const TaskContext = createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload, // Asegúrate de que action.payload sea un array
      };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload], // Agrega la nueva tarea
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState); // Inicializa el reducer con el estado inicial

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
