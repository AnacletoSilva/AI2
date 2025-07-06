// src/view/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tabela from '../view/Tabela';

export default function Home({ isAdmin }) {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Bem-vindo à Liga Portugal</h2>
      <div className="text-start mb-3">
        <button className="btn btn-primary bot" onClick={() => navigate('/team/list')}>
          Ver Equipas
        </button>
      </div>
      <Tabela isAdmin={isAdmin} />
    </div>
  );
}
