import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const baseUrl = "http://localhost:8080";

export default function UpdateTeam() {

    const [nome_equipa, setNomeEquipa] = useState("");
    const [abrev, setAbrev] = useState("");
    const [ano_fundacao, setAnoFundacao] = useState("");
    const [nome_estadio, setNomeEstadio] = useState("");
    const [emblema, setEmblema] = useState("");

    const { id } = useParams(); // usa 'id' porque no App.js é /team/update/:id

    useEffect(() => {
        const url = baseUrl + "/team/get/" + id;
        axios.get(url)
            .then(res => {
                if (res.data.success) {
                    const data = res.data.data[0];
                    setNomeEquipa(data.nome_equipa);
                    setAbrev(data.abrev);
                    setAnoFundacao(data.ano_fundacao);
                    setNomeEstadio(data.nome_estadio);
                    setEmblema(data.emblema);
                } else {
                    alert("Erro no web service");
                }
            })
            .catch(error => {
                alert("Erro no servidor: " + error);
            });
    }, [id]);

    function SendUpdate() {
        const url = baseUrl + "/team/update/" + id;
        const datapost = {
            nome_equipa: nome_equipa,
            abrev: abrev,
            ano_fundacao: ano_fundacao,
            nome_estadio: nome_estadio,
            emblema: emblema
        };

        console.log("Enviando:", datapost);

        axios.put(url, datapost, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.data.success === true) {
                    alert(response.data.message);
                } else {
                    alert(response.data.message || "Erro ao atualizar equipa");
                }
            })
            .catch(error => {
                alert("Erro no servidor: " + error);
            });
    }

    return (
        <div className="container mt-4">
            <h3>Atualizar Equipa</h3>
            <div className="form-row justify-content-center">
                <div className="form-group col-md-6 mt-2">
                    <label>Nome da Equipa:</label>
                    <input type="text" className="form-control" placeholder="Nome da equipa"
                        value={nome_equipa} onChange={(e) =>
                            setNomeEquipa(e.target.value)} />
                </div>
                <div className="form-group col-md-6 mt-2">
                    <label>Abreviação:</label>
                    <input type="text" className="form-control" placeholder="Abreviação"
                        value={abrev} onChange={(e) =>
                            setAbrev(e.target.value)} />
                </div>
                <div className="form-group col-md-6 mt-2">
                    <label>Ano de Fundação:</label>
                    <input type="number" className="form-control" placeholder="Ano de fundação"
                        value={ano_fundacao} onChange={(e) =>
                            setAnoFundacao(e.target.value)} />
                </div>
                <div className="form-group col-md-6 mt-2">
                    <label>Nome do Estádio:</label>
                    <input type="text" className="form-control" placeholder="Nome do estádio"
                        value={nome_estadio} onChange={(e) =>
                            setNomeEstadio(e.target.value)} />
                </div>
                <div className="form-group col-md-6 mt-2">
                    <label>URL do Emblema:</label>
                    <input type="text" className="form-control" placeholder="URL do emblema"
                        value={emblema} onChange={(e) =>
                            setEmblema(e.target.value)} />
                </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 bot" onClick={() => SendUpdate()}>Atualizar</button>
        </div>
    );
}
