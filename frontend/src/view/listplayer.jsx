// src/view/listplayer.jsx
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:8080";

export default function Listplayer({ isAdmin }) {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { loadPlayers(); }, []);

  function loadPlayers() {
    axios.get(`${baseUrl}/team/${id}/players`)
      .then(res => res.data.success
        ? setPlayers(res.data.data)
        : alert("Erro ao carregar"))
      .catch(err => alert("Erro: " + err));
  }

  function deletePlayer(pid) {
    if (!isAdmin) return;
    if (window.confirm("Eliminar este jogador?")) {
      axios.delete(`${baseUrl}/player/delete/${pid}`)
        .then(res => {
          if (res.data.success) {
            alert("Eliminado");
            loadPlayers();
          } else alert("Erro");
        })
        .catch(err => alert("Erro: " + err));
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Jogadores da Equipa</h3>
        {isAdmin && (
          <button
            className="btn btn-success"
            onClick={() => navigate(`/player/create/${id}`)}
          >
            Adicionar Jogador
          </button>
        )}
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th><th>Nome</th><th>Posição</th>
            <th>Altura</th><th>Golos</th><th>Assist.</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={p.id}>
              <td>{i+1}</td>
              <td>{p.Nome}</td><td>{p.posicao}</td>
              <td>{p.altura}</td><td>{p.golos}</td>
              <td>{p.assistencias}</td>
              <td>
                {isAdmin && (
                  <>
                    <button
                      className="btn btn-info me-2"
                      onClick={() => navigate(`/player/update/${p.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deletePlayer(p.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
