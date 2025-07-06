import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const baseUrl = "http://localhost:8080";

export default function UpdatePlayer() {

    const { id } = useParams();

    const [Nome, setNomePlayer] = useState("");
    const [idade, setIdade] = useState("");
    const [posicao, setPosicao] = useState("");
    const [altura, setAltura] = useState("");
    const [golos, setGolos] = useState("");
    const [assistencias, setAssistencias] = useState("");

    

    useEffect(() => {
        const url = baseUrl + "/player/get/" + id;

        axios.get(url)
            .then(res => {
                if (res.data.success && res.data.data) {
                    const data = res.data.data;
                    setNomePlayer(data.Nome);
                    setIdade(data.idade);
                    setPosicao(data.posicao);
                    setAltura(data.altura);
                    setGolos(data.golos);
                    setAssistencias(data.assistencias);
                }
                else {
                    alert("Erro ao obter dados do jogador");
                }
            })
            .catch(error => {
                alert("Erro no servidor: " + error);
            });
    }, [id]);

    return (
        <div className="container mt-4">
            <h3>Atualizar Jogador</h3>
            <div className="form-row justify-content-center">
                <div className="form-group col-md-6 mt-2">
                    <label>Nome do Jogador:</label>
                    <input type="text" className="form-control"
                        value={Nome}
                        onChange={(e) => setNomePlayer(e.target.value)} />
                </div>
                <div className="form-group col-md-6 mt-2">
                    <label>Idade:</label>
                    <input type="number" className="form-control"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)} />
                </div>
                <div className="form-group col-md-6 mt-2">
                    <label>Posição:</label>
                    <input type="text" className="form-control"
                        value={posicao}
                        onChange={(e) => setPosicao(e.target.value)} />
                </div>
                <div className="form-group col-md-6 mt-2">
                    <label>Altura (cm):</label>
                    <input type="number" className="form-control"
                        value={altura}
                        onChange={(e) => setAltura(e.target.value)} />
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
            <button type="submit" className="btn btn-primary mt-3 bot" onClick={() => sendUpdate()}>Atualizar</button>
        </div>
    );

    function sendUpdate() {
        const url = baseUrl + "/player/update/" + id;
        const datapost = {
            Nome: Nome,
            idade: idade,
            posicao: posicao,
            altura: altura,
            golos: golos,
            assistencias: assistencias
        };

        axios.put(url, datapost, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.data.success === true) {
                    alert(response.data.message);
                } else {
                    alert("Erro ao atualizar jogador");
                }
            })
            .catch(error => {
                alert("Erro no servidor: " + error);
            });
    }
}
