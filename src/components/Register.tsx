import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { MdEmail, MdPhone } from "react-icons/md";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos
    if (!firstName || !lastName || !age || !phone || !email || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    // Validação do formato de e-mail
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    try {
      // Criar o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Salvar os dados do usuário no Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        firstName,
        lastName,
        age,
        phone,
        email,
        createdAt: new Date(),
      });

      // Realiza o login do usuário após o cadastro
      await signInWithEmailAndPassword(auth, email, password);

      // Exibe a mensagem de sucesso
      setSuccessMessage("Usuário cadastrado com sucesso!");
      setFirstName("");
      setLastName("");
      setAge("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redireciona para a página principal após 2 segundos
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário: ", error);

      // Melhor tratamento de erro
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este e-mail já está em uso.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setErrorMessage('Erro desconhecido. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastro</h2>
        {successMessage && (
          <p className="mb-4 text-green-600 font-medium">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mb-4 text-red-600 font-medium">{errorMessage}</p>
        )}

        {/* Nome */}
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        {/* Sobrenome */}
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Sobrenome
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        {/* Idade */}
        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Idade
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        {/* Telefone */}
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Telefone
          </label>
          <div className="relative">
            <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full pl-10 p-2 border rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="relative">
            <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full pl-10 p-2 border rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Senha */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        {/* Confirmar Senha */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar Senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        {/* Botão de cadastro */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded-md shadow hover:bg-indigo-700 transition"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Register;
