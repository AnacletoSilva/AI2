// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import bcrypt from 'bcryptjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Home from './view/Home';
import Listteam from './view/listteam';
import Createteam from './view/createteam';
import Updateteam from './view/updateteam';
import Listplayer from './view/listplayer';
import Createplayer from './view/createplayer';
import Updateplayer from './view/updateplayer';

import logo from './images/Liga_Portugal_Betclic_2023.png';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // Hash bcrypt já gerado; confere com bcrypt.compare()
  const CORRECT = "$2a$10$CcFkiefeF9sXkjdcUCStAuPZX.C63w0cV3sZDozVuSrX35kAIkAmS";

  const toggleMode = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowModal(true);
    }
  };

  const handleSubmit = async () => {
    // compara plaintext vs hash
    const match = await bcrypt.compare(passwordInput, CORRECT);
    if (match) {
      setIsAdmin(true);
      setShowModal(false);
      setPasswordInput("");
    } else {
      alert("Senha incorreta");
    }
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <img src={logo} alt="Logo" className="me-2" style={{ height: '40px' }} />
        <Link className="navbar-brand flex-grow-1" to="/">LIGA PORTUGAL</Link>
        <button
          className="btn btn-primary bot"
          onClick={toggleMode}
        >
          {isAdmin ? "Utilizador" : "Admin"}
        </button>
      </nav>

      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home isAdmin={isAdmin} />} />
          <Route path="/team/list" element={<Listteam isAdmin={isAdmin} />} />
          <Route path="/team/create" element={isAdmin ? <Createteam /> : <Home isAdmin={isAdmin} />} />
          <Route path="/team/update/:id" element={isAdmin ? <Updateteam /> : <Home isAdmin={isAdmin} />} />
          <Route path="/team/:id/players" element={<Listplayer isAdmin={isAdmin} />} />
          <Route path="/player/create/:teamId" element={isAdmin ? <Createplayer /> : <Home isAdmin={isAdmin} />} />
          <Route path="/player/update/:id" element={isAdmin ? <Updateplayer /> : <Home isAdmin={isAdmin} />} />
        </Routes>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Entrar em Modo Admin</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Senha"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={handleSubmit}>Entrar</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </Router>
  );
}

export default App;
