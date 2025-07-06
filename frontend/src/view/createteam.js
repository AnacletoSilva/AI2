import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../css/Tabela.css";

const baseUrl = "http://localhost:8080";

export default function CreateTeam() {
  // Estados para cada campo do formulário
  const [nome_equipa, setNomeEquipa] = useState("");
  const [abrev, setAbrev] = useState("");
  const [ano_fundacao, setAnoFundacao] = useState("");
  const [nome_estadio, setNomeEstadio] = useState("");
  const [emblema, setEmblema] = useState("");

  const navigate = useNavigate();

  // Função que envia o POST para criar a equipa
  async function sendSave() {
    // Validações simples
    if (!nome_equipa) return alert("Preenche o nome da equipa!");
    if (!abrev)         return alert("Preenche a abreviatura!");
    if (!ano_fundacao)  return alert("Preenche o ano de fundação!");
    if (!nome_estadio)  return alert("Preenche o nome do estádio!");
    if (!emblema)       return alert("Insere o URL do emblema!");

    const url = `${baseUrl}/team/create`;
    const datapost = { nome_equipa, abrev, ano_fundacao, nome_estadio, emblema };

    console.log("Enviando dados para criar equipa:", datapost);

    try {
      const response = await axios.post(url, datapost);
      console.log("Resposta do servidor:", response.data);

      if (response.data.success) {
        alert(response.data.message);
        // Limpa os campos
        setNomeEquipa("");
        setAbrev("");
        setAnoFundacao("");
        setNomeEstadio("");
        setEmblema("");
        // Redireciona para a listagem de equipas, se quiseres:
        // navigate('/team/list');
      } else {
        alert("Falha ao adicionar equipa: " + response.data.message);
      }
    } catch (error) {
      // Mostra o erro completo no console para saber o que está a falhar
      console.error(" Erro ao adicionar equipa (status, data, mensagem):",
        error.response?.status,
        error.response?.data,
        error.message
      );
      alert(`Erro ao adicionar equipa: ${error.response?.status || ''} ${error.message}`);
    }
  }

  return (
    <div className="container mt-4">
      <h3>Adicionar Equipa</h3>
      <div className="form-row justify-content-center">
        {/* Nome da equipa */}
        <div className="form-group col-md-6 mt-2">
          <label>Nome da Equipa:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nome da equipa"
            value={nome_equipa}
            onChange={e => setNomeEquipa(e.target.value)}
          />
        </div>

        {/* Abreviatura */}
        <div className="form-group col-md-6 mt-2">
          <label>Abreviatura:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Abreviatura"
            value={abrev}
            onChange={e => setAbrev(e.target.value)}
          />
        </div>

        {/* Ano de Fundação */}
        <div className="form-group col-md-6 mt-2">
          <label>Ano de Fundação:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Ano de fundação"
            value={ano_fundacao}
            onChange={e => setAnoFundacao(e.target.value)}
          />
        </div>

        {/* Nome do Estádio */}
        <div className="form-group col-md-6 mt-2">
          <label>Nome do Estádio:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nome do estádio"
            value={nome_estadio}
            onChange={e => setNomeEstadio(e.target.value)}
          />
        </div>

        {/* URL do Emblema */}
        <div className="form-group col-md-6 mt-2">
          <label>URL do Emblema:</label>
          <input
            type="text"
            className="form-control"
            placeholder="URL do emblema"
            value={emblema}
            onChange={e => setEmblema(e.target.value)}
          />
        </div>
      </div>

      {/* Botão que dispara a criação */}
      <button
        type="button"
        className="btn btn-primary mt-3 bot"
        onClick={sendSave}
      >
        Adicionar Equipa
      </button>
    </div>
  );
}
