import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaPlus, FaCheckCircle, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Indicador de carregamento
  const [error, setError] = useState<string>(""); // Mensagem de erro ao carregar tarefas

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksList);
      } catch (error) {
        setError("Erro ao carregar tarefas. Tente novamente mais tarde.");
        console.error("Erro ao buscar tarefas: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleComplete = async (taskId: string, currentStatus: boolean) => {
    const taskRef = doc(db, "tasks", taskId);

    try {
      await updateDoc(taskRef, { completed: !currentStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefa: ", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);

    try {
      await deleteDoc(taskRef);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao excluir tarefa: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white">
      <div className="container mx-auto px-6 py-16 flex flex-col items-center justify-center text-center">
        <div className="mb-16 space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-white">
            Organize Sua Vida com Facilidade!
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-200">
            Gerencie suas tarefas de forma simples, eficiente e intuitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link to="/add">
              <div className="w-24 h-24 bg-blue-500 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all">
                <FaPlus className="text-white text-3xl" />
              </div>
              <p className="text-xl text-white">Adicionar Tarefas</p>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-16 text-lg font-semibold">Carregando tarefas...</p>
        ) : error ? (
          <p className="mt-16 text-lg font-semibold text-red-600">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="mt-16 text-lg font-semibold">Nenhuma tarefa encontrada.</p>
        ) : (
          <div className="mt-16 space-y-6 w-full sm:w-3/4 md:w-1/2 mx-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-6 rounded-lg shadow-lg transition transform hover:scale-105 ${
                  task.completed ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <h3
                  className={`text-2xl font-bold ${task.completed ? "line-through text-gray-300" : ""}`}
                >
                  {task.title}
                </h3>
                <p className="mt-2">
                  Status:{" "}
                  <span className="font-semibold">
                    {task.completed ? "Concluída" : "Pendente"}
                  </span>
                </p>
                {task.createdAt && (
                  <p className="text-sm text-gray-300 mt-2">
                    {new Date(task.createdAt.seconds * 1000).toLocaleString()}
                  </p>
                )}
                <div className="flex space-x-4 mt-4">
                  <button
                    className="flex items-center text-white hover:text-gray-300 transition-all"
                    onClick={() => handleComplete(task.id, task.completed)}
                    aria-label={`Marcar tarefa como ${
                      task.completed ? "pendente" : "concluída"
                    }`}
                  >
                    <FaCheckCircle className="text-2xl" />
                    <span className="ml-2">Concluir</span>
                  </button>
                  <button
                    className="flex items-center text-white hover:text-gray-300 transition-all"
                    onClick={() => handleDelete(task.id)}
                    aria-label="Excluir tarefa"
                  >
                    <FaTrash className="text-2xl" />
                    <span className="ml-2">Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
