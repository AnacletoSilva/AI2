// src/view/listteam.jsx
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import "../css/Tabela.css";

const baseUrl = "http://localhost:8080";

export default function Listteam({ isAdmin }) {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { loadTeams(); }, []);

  function loadTeams() {
    axios.get(`${baseUrl}/team/list`)
      .then(res => res.data.success ? setTeams(res.data.data) : alert("Erro!"))
      .catch(err => alert("Erro: " + err));
  }

  function onDelete(id) {
    if (!isAdmin) return;
    Swal.fire({
      title: 'Tens a certeza?',
      text: 'Não poderá reverter!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, eliminar!'
    }).then(result => {
      if (result.isConfirmed) {
        axios.delete(`${baseUrl}/team/delete/${id}`)
          .then(res => {
            if (res.data.success) {
              Swal.fire('Eliminada!', '', 'success');
              loadTeams();
            } else Swal.fire('Erro', '', 'error');
          })
          .catch(err => alert("Erro: " + err));
      }
    });
  }

  return (
    <div>
      {isAdmin && (
        <div className="d-flex justify-content-end mb-3">
          <Link className="btn btn-success" to="/team/create">Adicionar Equipa</Link>
        </div>
      )}
      <table className="table table-hover table-striped">
        <thead className="thead-dark">
          <tr>
            <th>#</th><th>Emblema</th><th>Nome</th><th>Abrev</th>
            <th>Fundação</th><th>Estádio</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => (
            <tr key={team.id}>
              <td>{i+1}</td>
              <td>{team.emblema
                ? <img src={team.emblema} alt="" style={{width:50,height:50}}/>
                : "–"}
              </td>
              <td>{team.nome_equipa}</td>
              <td>{team.abrev}</td>
              <td>{team.ano_fundacao}</td>
              <td>{team.nome_estadio}</td>
              <td>
                {isAdmin && (
                  <>
                    <Link className="btn btn-info me-2" to={`/team/update/${team.id}`}>Editar</Link>
                    <button className="btn btn-danger me-2" onClick={() => onDelete(team.id)}>Eliminar</button>
                  </>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/team/${team.id}/players`)}
                >
                  Ver Jogadores
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
