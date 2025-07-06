import React, { useState } from "react";
import { useParams } from "react-router-dom"; // importa useParams
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const baseUrl = "http://localhost:8080";

export default function CreatePlayer() {
    const { teamId } = useParams(); // obtém o teamId da URL

    const [Nome, setNomePlayer] = useState("");
    const [idade, setIdade] = useState("");
    const [posicao, setPosicao] = useState("");
    const [altura, setAltura] = useState("");
    const [golos, setGolos] = useState("");
    const [assistencias, setAssistencias] = useState("");

    function SendSave() {
        if (Nome === "" || idade === "" || posicao === "" || altura === "" || golos === "" || assistencias === "") {
            alert("Preenche todos os campos!");
        }
        else {
            const url = baseUrl + "/player/create";
            const datapost = {
                Nome: Nome,
                idade: idade,
                posicao: posicao,
                altura: altura,
                team_id: teamId, // associa o jogador à equipa
                golos: golos,
                assistencias: assistencias
            };
            axios.post(url, datapost)
                .then(response => {
                    if (response.data.success === true) {
                        alert(response.data.message);
                        // Limpa os campos após adicionar
                        setNomePlayer("");
                        setIdade("");
                        setPosicao("");
                        setAltura("");
                        setGolos("");
                        setAssistencias("");
                    }
                    else {
                        alert(response.data.message);
                    }
                })
                .catch(error => {
                    alert("Erro: " + error);
                });
        }
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
                        onChange={e => setNomePlayer(e.target.value)} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Idade:</label>
                    <input type="number"
                        className="form-control"
                        value={idade}
                        onChange={e => setIdade(e.target.value)} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Posição:</label>
                    <input type="text"
                        className="form-control"
                        value={posicao}
                        onChange={e => setPosicao(e.target.value)} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Altura (cm):</label>
                    <input type="number"
                        className="form-control"
                        value={altura}
                        onChange={e => setAltura(e.target.value)} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Golos:</label>
                    <input type="number"
                        className="form-control"
                        value={golos}
                        onChange={e => setGolos(e.target.value)} />
                </div>
                <div className='form-group col-md-6 mt-2'>
                    <label>Assistências:</label>
                    <input type="number"
                        className="form-control"
                        value={assistencias}
                        onChange={e => setAssistencias(e.target.value)} />
                </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 bot" onClick={() => SendSave()}>Adicionar</button>
        </div>
    );
}
