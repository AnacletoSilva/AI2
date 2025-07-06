import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config'; // Importe a URL base da configuração
import Swal from 'sweetalert2';

export default function UpdateTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estado unificado para os dados da equipa
  const [teamData, setTeamData] = useState({
    nome_equipa: "",
    abrev: "",
    ano_fundacao: "",
    nome_estadio: "",
    emblema: ""
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Carrega os dados da equipa
  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/team/get/${id}`);
        
        if (response.data.success && response.data.data) {
          const data = response.data.data[0]; // Assume que o primeiro item é a equipa
          setTeamData({
            nome_equipa: data.nome_equipa,
            abrev: data.abrev,
            ano_fundacao: data.ano_fundacao,
            nome_estadio: data.nome_estadio,
            emblema: data.emblema
          });
        } else {
          Swal.fire('Erro', 'Não foi possível carregar os dados da equipa', 'error');
          navigate('/team/list');
        }
      } catch (error) {
        console.error("Erro ao carregar equipa:", {
          URL: `${API_BASE_URL}/team/get/${id}`,
          Error: error.message,
          Response: error.response?.data
        });
        Swal.fire('Erro', 'Falha na conexão com o servidor', 'error');
        navigate('/team/list');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, [id, navigate]);

  // Manipula mudanças nos campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validação dos campos
  const validateForm = () => {
    if (!teamData.nome_equipa || teamData.nome_equipa.length < 3) {
      Swal.fire('Atenção', 'Nome da equipa deve ter pelo menos 3 caracteres', 'warning');
      return false;
    }
    
    if (!teamData.abrev || teamData.abrev.length < 1 || teamData.abrev.length > 10) {
      Swal.fire('Atenção', 'Abreviatura deve ter entre 1 e 10 caracteres', 'warning');
      return false;
    }
    
    const currentYear = new Date().getFullYear();
    if (!teamData.ano_fundacao || teamData.ano_fundacao < 1800 || teamData.ano_fundacao > currentYear) {
      Swal.fire('Atenção', `Ano de fundação inválido (1800-${currentYear})`, 'warning');
      return false;
    }
    
    if (!teamData.nome_estadio || teamData.nome_estadio.length < 3) {
      Swal.fire('Atenção', 'Nome do estádio deve ter pelo menos 3 caracteres', 'warning');
      return false;
    }
    
    if (!teamData.emblema) {
      Swal.fire('Atenção', 'URL do emblema é obrigatório', 'warning');
      return false;
    }
    
    return true;
  };

  // Envia a atualização
  const sendUpdate = async () => {
    if (!validateForm()) return;
    
    try {
      setIsUpdating(true);
      
      const response = await axios.put(
        `${API_BASE_URL}/team/update/${id}`,
        teamData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: 'Sucesso!',
          text: response.data.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/team/list');
        });
      } else {
        Swal.fire('Erro', response.data.message || 'Falha na atualização', 'error');
      }
    } catch (error) {
      console.error("Erro ao atualizar equipa:", {
        URL: `${API_BASE_URL}/team/update/${id}`,
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
        <p className="mt-3">A Carregar dados da equipa...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Atualizar Equipa</h3>
      <div className="form-row justify-content-center">
        <div className="form-group col-md-6 mt-2">
          <label>Nome da Equipa:</label>
          <input 
            type="text" 
            className="form-control"
            name="nome_equipa"
            placeholder="Nome da equipa"
            value={teamData.nome_equipa}
            onChange={handleInputChange}
            disabled={isUpdating}
          />
        </div>
        
        <div className="form-group col-md-6 mt-2">
          <label>Abreviação:</label>
          <input 
            type="text" 
            className="form-control"
            name="abrev"
            placeholder="Abreviação"
            value={teamData.abrev}
            onChange={handleInputChange}
            disabled={isUpdating}
          />
        </div>
        
        <div className="form-group col-md-6 mt-2">
          <label>Ano de Fundação:</label>
          <input 
            type="number" 
            className="form-control"
            name="ano_fundacao"
            placeholder="Ano de fundação"
            value={teamData.ano_fundacao}
            onChange={handleInputChange}
            min="1800"
            max={new Date().getFullYear()}
            disabled={isUpdating}
          />
        </div>
        
        <div className="form-group col-md-6 mt-2">
          <label>Nome do Estádio:</label>
          <input 
            type="text" 
            className="form-control"
            name="nome_estadio"
            placeholder="Nome do estádio"
            value={teamData.nome_estadio}
            onChange={handleInputChange}
            disabled={isUpdating}
          />
        </div>
        
        <div className="form-group col-md-12 mt-2">
          <label>URL do Emblema:</label>
          <input 
            type="text" 
            className="form-control"
            name="emblema"
            placeholder="URL do emblema"
            value={teamData.emblema}
            onChange={handleInputChange}
            disabled={isUpdating}
          />
          {teamData.emblema && (
            <div className="mt-2 text-center">
              <img 
                src={teamData.emblema} 
                alt="Pré-visualização do emblema" 
                className="img-thumbnail mt-2"
                style={{ maxWidth: '150px', maxHeight: '150px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentNode.innerHTML = '<div class="alert alert-warning mt-2">URL inválido</div>';
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="d-flex gap-2 mt-3">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/team/list')}
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
          ) : 'Atualizar Equipa'}
        </button>
      </div>
    </div>
  );
}