import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config'; // Importe a URL base da configuração

export default function Listplayer({ isAdmin }) {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para carregamento
  const [error, setError] = useState(null); // Estado para erros
  const navigate = useNavigate();

  useEffect(() => { 
    loadPlayers(); 
  }, []);

  function loadPlayers() {
    setIsLoading(true);
    setError(null);
    
    axios.get(`${API_BASE_URL}/team/${id}/players`) // Use API_BASE_URL
      .then(res => {
        if (res.data.success) {
          setPlayers(res.data.data);
        } else {
          setError("Erro ao carregar jogadores");
        }
      })
      .catch(err => {
        console.error("Erro ao carregar jogadores:", {
          URL: `${API_BASE_URL}/team/${id}/players`,
          Error: err.message,
          Response: err.response?.data
        });
        setError("Erro ao conectar ao servidor");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function deletePlayer(pid) {
    if (!isAdmin) return;
    if (!window.confirm("Tem certeza que deseja eliminar este jogador?")) return;
    
    setIsLoading(true);
    
    axios.delete(`${API_BASE_URL}/player/delete/${pid}`) // Use API_BASE_URL
      .then(res => {
        if (res.data.success) {
          alert("Jogador eliminado com sucesso!");
          loadPlayers();
        } else {
          alert("Falha ao eliminar jogador: " + res.data.message);
        }
      })
      .catch(err => {
        console.error("Erro ao eliminar jogador:", {
          URL: `${API_BASE_URL}/player/delete/${pid}`,
          Error: err.message,
          Response: err.response?.data
        });
        alert("Erro ao eliminar jogador: " + (err.response?.data?.message || err.message));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Jogadores da Equipa</h3>
        {isAdmin && (
          <button
            className="btn btn-success"
            onClick={() => navigate(`/player/create/${id}`)}
            disabled={isLoading}
          >
            Adicionar Jogador
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">A Carregar...</span>
          </div>
          <p>A carregar jogadores...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error} - <button className="btn btn-link p-0" onClick={loadPlayers}>Tentar novamente</button>
        </div>
      ) : players.length === 0 ? (
        <div className="alert alert-info">
          Nenhum jogador encontrado para esta equipa.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th><th>Nome</th><th>Posição</th>
                <th>Altura</th><th>Golos</th><th>Assist.</th>
                {isAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id}>
                  <td>{i+1}</td>
                  <td>{p.Nome}</td><td>{p.posicao}</td>
                  <td>{p.altura} cm</td><td>{p.golos}</td>
                  <td>{p.assistencias}</td>
                  {isAdmin && (
                    <td>
                      <button
                        className="btn btn-info me-2"
                        onClick={() => navigate(`/player/update/${p.id}`)}
                        disabled={isLoading}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deletePlayer(p.id)}
                        disabled={isLoading}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}