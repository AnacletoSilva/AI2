import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "../css/Tabela.css";
import { API_BASE_URL } from '../config'; // Importe a URL base da configuração

export default function Listteam({ isAdmin }) {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // ID da equipe sendo excluída
  const navigate = useNavigate();

  useEffect(() => { 
    loadTeams(); 
  }, []);

  function loadTeams() {
    setIsLoading(true);
    setError(null);
    
    axios.get(`${API_BASE_URL}/team/list`) // Use API_BASE_URL
      .then(res => {
        if (res.data.success) {
          setTeams(res.data.data);
        } else {
          setError("Erro ao carregar equipas");
          Swal.fire('Erro', 'Não foi possível carregar as equipas', 'error');
        }
      })
      .catch(err => {
        console.error("Erro ao carregar equipas:", {
          URL: `${API_BASE_URL}/team/list`,
          Error: err.message,
          Response: err.response?.data
        });
        setError("Erro de conexão com o servidor");
        Swal.fire('Erro', 'Não foi possível conectar ao servidor', 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onDelete(id) {
    if (!isAdmin) return;
    
    Swal.fire({
      title: 'Tens a certeza?',
      text: 'Esta ação não pode ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        setDeletingId(id); // Marca a equipe sendo excluída
        
        axios.delete(`${API_BASE_URL}/team/delete/${id}`) // Use API_BASE_URL
          .then(res => {
            if (res.data.success) {
              Swal.fire('Eliminada!', 'A equipa foi removida com sucesso.', 'success');
              loadTeams();
            } else {
              Swal.fire('Erro', res.data.message || 'Falha ao eliminar equipa', 'error');
            }
          })
          .catch(err => {
            console.error("Erro ao eliminar equipa:", {
              URL: `${API_BASE_URL}/team/delete/${id}`,
              Error: err.message,
              Response: err.response?.data
            });
            Swal.fire('Erro', err.response?.data?.message || 'Erro ao eliminar equipa', 'error');
          })
          .finally(() => {
            setDeletingId(null);
          });
      }
    });
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Equipas da Liga</h2>
        {isAdmin && (
          <Link 
            className="btn btn-success" 
            to="/team/create"
            disabled={isLoading}
          >
            Adicionar Equipa
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">A Carregar...</span>
          </div>
          <p className="mt-3">A Carregar equipas...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error} - <button className="btn btn-link p-0" onClick={loadTeams}>Tentar novamente</button>
        </div>
      ) : teams.length === 0 ? (
        <div className="alert alert-info text-center">
          Nenhuma equipa encontrada. {isAdmin && "Adicione uma nova equipa!"}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th><th>Emblema</th><th>Nome</th><th>Abrev</th>
                <th>Fundação</th><th>Estádio</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => (
                <tr key={team.id}>
                  <td>{i+1}</td>
                  <td>
                    {team.emblema ? (
                      <img 
                        src={team.emblema} 
                        alt={`Emblema da ${team.nome_equipa}`} 
                        className="img-thumbnail"
                        style={{ width: 50, height: 50, objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="bg-light border rounded d-flex justify-content-center align-items-center" 
                           style={{ width: 50, height: 50 }}>
                        <span className="text-muted">N/A</span>
                      </div>
                    )}
                  </td>
                  <td className="fw-bold">{team.nome_equipa}</td>
                  <td><span className="badge bg-secondary">{team.abrev}</span></td>
                  <td>{team.ano_fundacao}</td>
                  <td>{team.nome_estadio}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/team/${team.id}/players`)}
                        disabled={isLoading}
                      >
                        Jogadores
                      </button>
                      
                      {isAdmin && (
                        <>
                          <Link 
                            className="btn btn-info btn-sm"
                            to={`/team/update/${team.id}`}
                            disabled={isLoading}
                          >
                            Editar
                          </Link>
                          
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => onDelete(team.id)}
                            disabled={deletingId === team.id || isLoading}
                          >
                            {deletingId === team.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" />
                            ) : 'Eliminar'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}