import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/Tabela.css";
import { API_BASE_URL } from '../config'; // Importe a URL base da configuração

export default function Tabela({ isAdmin }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState(Array(18).fill(""));
  const [counters, setCounters] = useState(Array(18).fill(""));
  const [selectedEmblems, setSelectedEmblems] = useState(Array(18).fill(""));
  const [topgolos, setTopGolos] = useState([]);
  const [topassistencias, setTopAssistencias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        
        // Carrega a lista de equipas
        const res = await axios.get(`${API_BASE_URL}/team/list`);
        if (!res.data.success) {
          throw new Error("Falha ao carregar equipas");
        }
        const allTeams = res.data.data;
        setTeams(allTeams);

        // Carrega jogadores de todas as equipas
        let allPlayers = [];
        for (let team of allTeams) {
          try {
            const pRes = await axios.get(`${API_BASE_URL}/team/${team.id}/players`);
            if (pRes.data.success) {
              allPlayers = allPlayers.concat(pRes.data.data);
            }
          } catch (err) {
            console.error(`Erro ao carregar jogadores da equipa ${team.id}:`, err);
          }
        }
        
        // Top 10 golos
        const sortedG = [...allPlayers]
          .sort((a, b) => b.golos - a.golos)
          .slice(0, 10);
        setTopGolos(sortedG);
        
        // Top 10 assistências
        const sortedA = [...allPlayers]
          .sort((a, b) => b.assistencias - a.assistencias)
          .slice(0, 10);
        setTopAssistencias(sortedA);
        
        // Carrega seleções salvas
        const st = JSON.parse(localStorage.getItem('selectedTeams') || '[]');
        const ct = JSON.parse(localStorage.getItem('counters') || '[]');
        const se = JSON.parse(localStorage.getItem('selectedEmblems') || '[]');
        
        if (st.length === 18) setSelectedTeams(st);
        if (ct.length === 18) setCounters(ct);
        if (se.length === 18) setSelectedEmblems(se);

      } catch (err) {
        console.error("Erro ao carregar dados:", {
          URL: `${API_BASE_URL}/team/list`,
          Error: err.message,
          Response: err.response?.data
        });
        setError("Erro ao carregar dados. Tente recarregar a página.");
      }
    }
    
    fetchData();
  }, []);

  const handleTeamChange = (i, v) => {
    const updatedTeams = [...selectedTeams];
    updatedTeams[i] = v;
    setSelectedTeams(updatedTeams);
    localStorage.setItem('selectedTeams', JSON.stringify(updatedTeams));
    
    const team = teams.find(t => t.id === parseInt(v));
    const updatedEmblems = [...selectedEmblems];
    updatedEmblems[i] = team ? team.emblema : "";
    setSelectedEmblems(updatedEmblems);
    localStorage.setItem('selectedEmblems', JSON.stringify(updatedEmblems));
  };

  const handleCounterChange = (i, v) => {
    const value = Math.max(0, parseInt(v) || 0);
    const updatedCounters = [...counters];
    updatedCounters[i] = value;
    setCounters(updatedCounters);
    localStorage.setItem('counters', JSON.stringify(updatedCounters));
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => String(t.id) === String(teamId));
    return team ? team.nome_equipa : '-';
  };

  const getTeamAbrev = (teamId) => {
    const team = teams.find(t => String(t.id) === String(teamId));
    return team ? team.abrev : '-';
  };

  return (
    <div className="container mt-3">
      <h3 className="mb-4">Classificação da Liga</h3>
      
      {error && (
        <div className="alert alert-danger">
          {error}{" "}
          <button className="btn btn-link p-0" onClick={() => window.location.reload()}>
            Recarregar página
          </button>
        </div>
      )}

      {!error && (
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="table-responsive">
              <table className="table table-hover tabela-classificacao">
                <thead className="head">
                  <tr>
                    <th className="posicao">#</th>
                    <th className="emblema">Emblema</th>
                    <th className="equipa">Equipa</th>
                    <th className="pontuacao">Pontuação</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 18 }, (_, i) => {
                    const availableTeams = teams.filter(
                      t => !selectedTeams.includes(String(t.id)) || selectedTeams[i] === String(t.id)
                    );
                    const positionClass = 
                      i < 1 ? 'table-success' : 
                      i >= 15 ? 'table-danger' : 
                      '';
                    
                    return (
                      <tr key={i} className={positionClass}>
                        <td className="posicao align-middle">{i+1}</td>
                        <td className="emblema align-middle">
                          {selectedEmblems[i] ? (
                            <img 
                              src={selectedEmblems[i]} 
                              alt={`Emblema ${getTeamName(selectedTeams[i])}`}
                              className="img-thumbnail"
                              style={{ width: 40, height: 40 }}
                            />
                          ) : (
                            <div className="bg-light border rounded d-flex justify-content-center align-items-center" 
                                 style={{ width: 40, height: 40 }}>
                              <span className="text-muted">-</span>
                            </div>
                          )}
                        </td>
                        <td className="equipa align-middle">
                          {isAdmin ? (
                            <select 
                              className="form-select"
                              value={selectedTeams[i]}
                              onChange={e => handleTeamChange(i, e.target.value)}
                            >
                              <option value="">Selecionar equipa</option>
                              {availableTeams.map(t => (
                                <option key={t.id} value={t.id}>
                                  {t.nome_equipa}
                                </option>
                              ))}
                            </select>
                          ) : (
                            getTeamName(selectedTeams[i])
                          )}
                        </td>
                        <td className="pontuacao align-middle">
                          {isAdmin ? (
                            <input 
                              type="number" 
                              className="form-control text-center"
                              style={{ maxWidth: '90px' }}
                              min="0"
                              value={counters[i]}
                              onChange={e => handleCounterChange(i, e.target.value)}
                            />
                          ) : (
                            counters[i] || '0'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Top 10 Goleadores</h4>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Jogador</th>
                        <th>Equipa</th>
                        <th>Golos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topgolos.length > 0 ? (
                        topgolos.map((p, i) => (
                          <tr key={i}>
                            <td>{p.Nome}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {getTeamAbrev(p.team_id)}
                              </span>
                            </td>
                            <td className="fw-bold text-success">{p.golos}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center py-4">
                            Nenhum dado disponível
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">Top 10 Assistências</h4>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Jogador</th>
                        <th>Equipa</th>
                        <th>Assist.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topassistencias.length > 0 ? (
                        topassistencias.map((p, i) => (
                          <tr key={i}>
                            <td>{p.Nome}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {getTeamAbrev(p.team_id)}
                              </span>
                            </td>
                            <td className="fw-bold text-primary">{p.assistencias}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center py-4">
                            Nenhum dado disponível
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
