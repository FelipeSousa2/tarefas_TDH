import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaPlus, FaUser, FaBars, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../firebaseConfig"; // Certifique-se de importar a configuração do Firebase
import { signOut } from "firebase/auth";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Estado para armazenar o usuário logado

  // Função para alternar o menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Função para logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null); // Limpa o estado após o logout
  };

  // Verificar a autenticação do usuário
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-3xl font-extrabold tracking-wide hover:text-gray-100 transition duration-300 transform hover:scale-110"
        >
          Tarefas TDAH
        </Link>

        {/* Ícone do menu */}
        <div className="md:hidden" onClick={toggleMenu}>
          <FaBars className="text-white text-3xl cursor-pointer" />
        </div>

        {/* Links de navegação */}
        <div
          className={`md:flex space-x-8 ${
            isMenuOpen ? "flex" : "hidden"
          } md:block`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center text-white text-lg font-medium transition-transform duration-300 ${
                isActive
                  ? "border-b-4 border-white"
                  : "hover:text-gray-200 hover:scale-110"
              }`
            }
            aria-label="Ir para a página inicial"
          >
            <FaHome className="mr-2" />
            Início
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) =>
              `flex items-center text-white text-lg font-medium transition-transform duration-300 ${
                isActive
                  ? "border-b-4 border-white"
                  : "hover:text-gray-200 hover:scale-110"
              }`
            }
            aria-label="Adicionar uma nova tarefa"
          >
            <FaPlus className="mr-2" />
            Adicionar Tarefa
          </NavLink>

          {!user ? (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex items-center text-white text-lg font-medium transition-transform duration-300 ${
                  isActive
                    ? "border-b-4 border-white"
                    : "hover:text-gray-200 hover:scale-110"
                }`
              }
              aria-label="Registrar-se"
            >
              <FaUser className="mr-2" />
              Registrar
            </NavLink>
          ) : (
            <>
              <span className="text-white text-lg font-medium">
                Bem-vindo, {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-white text-lg font-medium transition-transform duration-300 hover:text-gray-200 hover:scale-110"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Menu de hambúrguer - Exibido em telas pequenas */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} mt-4`}>
        <NavLink
          to="/"
          className="block text-white text-lg font-medium transition-transform duration-300 hover:text-gray-200"
          onClick={toggleMenu}
        >
          <FaHome className="mr-2" />
          Início
        </NavLink>
        <NavLink
          to="/add"
          className="block text-white text-lg font-medium transition-transform duration-300 hover:text-gray-200"
          onClick={toggleMenu}
        >
          <FaPlus className="mr-2" />
          Adicionar Tarefa
        </NavLink>
        {!user ? (
          <NavLink
            to="/register"
            className="block text-white text-lg font-medium transition-transform duration-300 hover:text-gray-200"
            onClick={toggleMenu}
          >
            <FaUser className="mr-2" />
            Registrar
          </NavLink>
        ) : (
          <>
            <span className="block text-white text-lg font-medium">
              Bem-vindo, {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="block text-white text-lg font-medium transition-transform duration-300 hover:text-gray-200"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
