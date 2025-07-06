import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config'; // Importe a URL base da configuração
import Swal from 'sweetalert2';

export default function UpdatePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para os campos do jogador
  const [playerData, setPlayerData] = useState({
    Nome: "",
    idade: "",
    posicao: "",
    altura: "",
    golos: "",
    assistencias: ""
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Carrega os dados do jogador
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/player/get/${id}`);
        
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          setPlayerData({
            Nome: data.Nome,
            idade: data.idade,
            posicao: data.posicao,
            altura: data.altura,
            golos: data.golos,
            assistencias: data.assistencias
          });
        } else {
          Swal.fire('Erro', 'Não foi possível carregar os dados do jogador', 'error');
          navigate('/player/list'); // Redireciona se não encontrar
        }
      } catch (error) {
        console.error("Erro ao carregar jogador:", {
          URL: `${API_BASE_URL}/player/get/${id}`,
          Error: error.message,
          Response: error.response?.data
        });
        Swal.fire('Erro', 'Falha na conexão com o servidor', 'error');
        navigate('/player/list');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayerData();
  }, [id, navigate]);

  // Atualiza um campo específico
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envia a atualização para o servidor
  const sendUpdate = async () => {
    // Validação básica
    if (!playerData.Nome || !playerData.idade || !playerData.posicao) {
      Swal.fire('Atenção', 'Preencha todos os campos obrigatórios', 'warning');
      return;
    }

    try {
      setIsUpdating(true);
      
      const response = await axios.put(
        `${API_BASE_URL}/player/update/${id}`,
        playerData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        Swal.fire('Sucesso!', response.data.message, 'success');
        // Redireciona após 2 segundos
        setTimeout(() => navigate('/player/list'), 2000);
      } else {
        Swal.fire('Erro', response.data.message || 'Falha na atualização', 'error');
      }
    } catch (error) {
      console.error("Erro ao atualizar jogador:", {
        URL: `${API_BASE_URL}/player/update/${id}`,
        Error: error.message,
        Response: error.response?.data
      });
      
      let errorMsg = 'Erro no servidor';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      Swal.fire('Erro', errorMsg, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">A Carregar...</span>
        </div>
        <p className="mt-3">A Carregar dados do jogador...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Atualizar Jogador</h3>
      <div className="form-row justify-content-center">
        <div className="form-group col-md-6 mt-2">
          <label>Nome do Jogador:</label>
          <input 
            type="text" 
            className="form-control"
            name="Nome"
            value={playerData.Nome}
            onChange={handleInputChange}
            disabled={isUpdating}
          />
        </div>
        
        <div className="form-group col-md-6 mt-2">
          <label>Idade:</label>
          <input 
            type="number" 
            className="form-control"
            name="idade"
            value={playerData.idade}
            onChange={handleInputChange}
            min="16"
            max="45"
            disabled={isUpdating}
          />
        </div>
        
        <div className="form-group col-md-6 mt-2">
          <label>Posição:</label>
          <input 
            type="text" 
            className="form-control"
            name="posicao"
            value={playerData.posicao}
            onChange={handleInputChange}
            disabled={isUpdating}
          />
        </div>
        
        <div className="form-group col-md-6 mt-2">
          <label>Altura (cm):</label>
          <input 
            type="number" 
            className="form-control"
            name="altura"
            value={playerData.altura}
            onChange={handleInputChange}
            min="150"
            max="220"
            disabled={isUpdating}
          />
        </div>
        
        <div className='form-group col-md-6 mt-2'>
          <label>Golos:</label>
          <input 
            type="number"
            className="form-control"
            name="golos"
            value={playerData.golos}
            onChange={handleInputChange}
            min="0"
            disabled={isUpdating}
          />
        </div>
        
        <div className='form-group col-md-6 mt-2'>
          <label>Assistências:</label>
          <input 
            type="number"
            className="form-control"
            name="assistencias"
            value={playerData.assistencias}
            onChange={handleInputChange}
            min="0"
            disabled={isUpdating}
          />
        </div>
      </div>
      
      <div className="d-flex gap-2 mt-3">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/player/list')}
          disabled={isUpdating}
        >
          Cancelar
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={sendUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status"></span>
              <span className="ms-2">A Atualizar...</span>
            </>
          ) : 'Atualizar Jogador'}
        </button>
      </div>
    </div>
  );
}