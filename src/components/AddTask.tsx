import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddTask: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Limpar mensagem de erro ao digitar
  useEffect(() => {
    if (taskTitle || taskDate) {
      setMessage("");
    }
  }, [taskTitle, taskDate]);

  const addTask = async () => {
    if (taskTitle.trim() === "" || taskDate === "") {
      setMessage("O título e a data da tarefa não podem estar vazios.");
      return;
    }

    if (new Date(taskDate) <= new Date()) {
      setMessage("A data da tarefa deve ser futura.");
      return;
    }

    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        date: taskDate,
        completed: false,
        createdAt: new Date(),
      });
      console.log("Tarefa adicionada com ID:", docRef.id);
      setTaskTitle("");
      setTaskDate("");
      setMessage("Tarefa adicionada com sucesso!");
      navigate("/"); // Redireciona para a página inicial
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      setMessage("Erro ao adicionar a tarefa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
          Adicione Sua Tarefa Agora!
        </h2>
        <div className="flex items-center mb-4">
          <FaPlusCircle className="text-4xl text-green-500 mr-3" />
          <input
            className="border-2 border-gray-300 p-3 w-full rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Digite o título da tarefa"
          />
        </div>
        <div className="mb-4">
          <input
            className="border-2 border-gray-300 p-3 w-full rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
            type="datetime-local"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
        </div>
        <button
          className={`w-full py-3 px-4 rounded-lg text-white font-bold ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 transition"
          }`}
          onClick={addTask}
          disabled={isLoading}
        >
          {isLoading ? "Adicionando..." : "Adicionar Tarefa"}
        </button>
        {message && (
          <p
            className={`text-center mt-4 font-semibold ${
              message.includes("sucesso") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddTask;
