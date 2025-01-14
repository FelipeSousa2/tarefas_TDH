import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Importe a configuração do Firebase

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Exibe um loader enquanto aguarda a autenticação
  }

  if (!authenticated) {
    return <Navigate to="/login" />; // Redireciona para a tela de login
  }

  return <>{children}</>; // Retorna os filhos, caso o usuário esteja autenticado
};

export default PrivateRoute;
