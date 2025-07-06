// src/Tabela.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/Tabela.css";

const baseUrl = "http://localhost:8080";

export default function Tabela({ isAdmin }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState(Array(18).fill(""));
  const [counters, setCounters] = useState(Array(18).fill(""));
  const [selectedEmblems, setSelectedEmblems] = useState(Array(18).fill(""));
  const [topgolos, setTopGolos] = useState([]);
  const [topassistencias, setTopAssistencias] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${baseUrl}/team/list`);
      if (res.data.success) {
        const allTeams = res.data.data;
        setTeams(allTeams);

        let allPlayers = [];
        for (let team of allTeams) {
          const pRes = await axios.get(`${baseUrl}/team/${team.id}/players`);
          if (pRes.data.success) allPlayers = allPlayers.concat(pRes.data.data);
        }
        // Top 10 golos
        const sortedG = allPlayers.slice().sort((a,b)=>b.golos-a.golos).slice(0,10);
        setTopGolos(sortedG);
        // Top 10 assistências
        const sortedA = allPlayers.slice().sort((a,b)=>b.assistencias-a.assistencias).slice(0,10);
        setTopAssistencias(sortedA);
      }

      const st = JSON.parse(localStorage.getItem('selectedTeams')||'[]');
      const ct = JSON.parse(localStorage.getItem('counters')||'[]');
      const se = JSON.parse(localStorage.getItem('selectedEmblems')||'[]');
      if (st.length) setSelectedTeams(st);
      if (ct.length) setCounters(ct);
      if (se.length) setSelectedEmblems(se);
    }
    fetchData();
  }, []);

  const handleTeamChange = (i,v) => {
    const u = [...selectedTeams]; u[i]=v; setSelectedTeams(u);
    localStorage.setItem('selectedTeams',JSON.stringify(u));
    const team = teams.find(t=>t.id===parseInt(v));
    const ue = [...selectedEmblems]; ue[i]=team?team.emblema:""; setSelectedEmblems(ue);
    localStorage.setItem('selectedEmblems',JSON.stringify(ue));
  };

  const handleCounterChange = (i,v) => {
    const u = [...counters]; u[i]=v; setCounters(u);
    localStorage.setItem('counters',JSON.stringify(u));
  };

  return (
    <div className="container mt-3">
      <h3>Classificação</h3>
      <div className="row">
        <div className="col-md-8">
          <table className="table">
            <thead className="head">
              <tr>
                <th className="posicao">#</th>
                <th className="emblema"></th>
                <th className="equipa">Equipa</th>
                <th className="pontuacao">Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 18 }, (_, i) => {
                const available = teams.filter(
                  t => !selectedTeams.includes(String(t.id)) || selectedTeams[i] === String(t.id)
                );
                const cls = i<1?'table-success': i>=15?'table-danger':'';
                return (
                  <tr key={i} className={cls}>
                    <td className="posicao">{i+1}</td>
                    <td className="emblema">
                      {selectedEmblems[i]
                        ? <img src={selectedEmblems[i]} alt="Emblema" style={{width:30,height:30}}/>
                        : '-'
                      }
                    </td>
                    <td className="equipa">
                      {isAdmin
                        ? (
                          <select className="form-select"
                            value={selectedTeams[i]}
                            onChange={e=>handleTeamChange(i,e.target.value)}
                          >
                            <option value="">Seleciona equipa</option>
                            {available.map(t=>(
                              <option key={t.id} value={t.id}>{t.nome_equipa}</option>
                            ))}
                          </select>
                        )
                        : (teams.find(t=>String(t.id)===selectedTeams[i])?.nome_equipa || '-')
                      }
                    </td>
                    <td className="pontuacao">
                      {isAdmin
                        ? (
                          <input type="number" className="form-control text-center"
                            style={{maxWidth:'70px'}}
                            value={counters[i]}
                            onChange={e=>handleCounterChange(i,e.target.value)}
                          />
                        )
                        : (counters[i] || '-')
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <div className="mb-4 tabgolos">
            <h4>Top 10 Golos</h4>
            <table className="table table-striped golos">
              <thead>
                <tr><th>Jogador</th><th>Equipa</th><th>Golos</th></tr>
              </thead>
              <tbody>
                {topgolos.map((p,i)=>(
                  <tr key={i}>
                    <td>{p.Nome}</td>
                    <td>{teams.find(t=>t.id===p.team_id)?.abrev||'-'}</td>
                    <td>{p.golos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tabassists">
            <h4>Top 10 Assistências</h4>
            <table className="table table-striped assists">
              <thead>
                <tr><th>Jogador</th><th>Equipa</th><th>Assistências</th></tr>
              </thead>
              <tbody>
                {topassistencias.map((p,i)=>(
                  <tr key={i}>
                    <td>{p.Nome}</td>
                    <td>{teams.find(t=>t.id===p.team_id)?.abrev||'-'}</td>
                    <td>{p.assistencias}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
