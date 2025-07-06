import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { API_BASE_URL } from '../config'; // Importe a configuração da URL base

export default function CreatePlayer() {
    const { teamId } = useParams();

    const [Nome, setNomePlayer] = useState("");
    const [idade, setIdade] = useState("");
    const [posicao, setPosicao] = useState("");
    const [altura, setAltura] = useState("");
    const [golos, setGolos] = useState("");
    const [assistencias, setAssistencias] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Estado para loading

    function SendSave() {
        if (Nome === "" || idade === "" || posicao === "" || altura === "" || golos === "" || assistencias === "") {
            alert("Preenche todos os campos!");
            return;
        }

        setIsLoading(true);
        
        const url = `${API_BASE_URL}/player/create`; // Use a URL base da configuração
        const datapost = {
            Nome,
            idade,
            posicao,
            altura,
            team_id: teamId,
            golos,
            assistencias
        };

        axios.post(url, datapost)
            .then(response => {
                if (response.data.success) {
                    alert(response.data.message);
                    // Limpa os campos
                    setNomePlayer("");
                    setIdade("");
                    setPosicao("");
                    setAltura("");
                    setGolos("");
                    setAssistencias("");
                } else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error("Axios Error:", {
                    URL: url,
                    Method: "POST",
                    Error: error.message,
                    Code: error.code
                });
                alert("Erro ao criar jogador: " + (error.response?.data?.message || error.message));
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className="container mt-4">
            <h3>Adicionar Jogador</h3>
            <div className='form-row justify-content-center'>
                <div className='form-group col-md-6'>
                    <label>Nome do Jogador:</label>
                    <input type="text"
                        className="form-control"
                        value={Nome}
                        onChange={e => setNomePlayer(e.target.value)}
                        disabled={isLoading} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Idade:</label>
                    <input type="number"
                        className="form-control"
                        value={idade}
                        onChange={e => setIdade(e.target.value)}
                        disabled={isLoading} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Posição:</label>
                    <input type="text"
                        className="form-control"
                        value={posicao}
                        onChange={e => setPosicao(e.target.value)}
                        disabled={isLoading} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Altura (cm):</label>
                    <input type="number"
                        className="form-control"
                        value={altura}
                        onChange={e => setAltura(e.target.value)}
                        disabled={isLoading} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Golos:</label>
                    <input type="number"
                        className="form-control"
                        value={golos}
                        onChange={e => setGolos(e.target.value)}
                        disabled={isLoading} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Assistências:</label>
                    <input type="number"
                        className="form-control"
                        value={assistencias}
                        onChange={e => setAssistencias(e.target.value)}
                        disabled={isLoading} />
                </div>
            </div>
            <button 
                type="submit" 
                className="btn btn-primary mt-3 bot" 
                onClick={SendSave}
                disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ml-2">A Processar...</span>
                    </>
                ) : "Adicionar"}
            </button>
        </div>
    );
}