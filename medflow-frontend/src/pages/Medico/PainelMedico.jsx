import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3333');

export default function PainelMedico() {
  const [fila, setFila] = useState([]);
  const [atendimentoAtual, setAtendimentoAtual] = useState(null);
  const [sintomas, setSintomas] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [prescricao, setPrescricao] = useState('');

  const carregarFila = async () => {
    try {
      const res = await api.get('/atendimentos');
      const lista = res.data.dados || res.data || [];
      const filaEspera = lista.filter(item => item.status !== 'FINALIZADO');
      setFila(filaEspera);
    } catch (e) {
      console.error("Erro ao conectar com o servidor");
    }
  };

  useEffect(() => {
    carregarFila();

    socket.on('atualizaKanban', () => {
      carregarFila();
    });

    return () => {
      socket.off('atualizaKanban');
    };
  }, []);

  const chamarPaciente = (paciente) => {
    setAtendimentoAtual(paciente);
  };

  const finalizarAtendimento = () => {
    alert("Atendimento finalizado com sucesso!");
    setAtendimentoAtual(null);
    setSintomas('');
    setDiagnostico('');
    setPrescricao('');
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="logo-section"><h2>MedFlow</h2></div>
        <nav className="menu-nav">
          <button className="active">🩺 Painel Médico</button>
          <button>📅 Agenda</button>
        </nav>
      </aside>

      <main className="content">
        <header className="content-header">
          <h1>CONSULTÓRIO MÉDICO</h1>
          <div className="user-info">Médico Plantonista: <strong>Dr. Silva</strong></div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', padding: '20px' }}>
          
          <section className="panel" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '15px' }}>Fila de Espera</h3>
            {fila.length > 0 ? (
              fila.map(item => (
                <div key={item.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
                  <p><strong>{item.paciente?.nome}</strong></p>
                  <p style={{ fontSize: '14px', color: '#666' }}>Ficha: #{item.id.substring(0, 5).toUpperCase()}</p>
                  <button onClick={() => chamarPaciente(item)} style={{ marginTop: '10px', padding: '8px', width: '100%', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Chamar Paciente
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>Nenhum paciente aguardando.</p>
            )}
          </section>

          <section className="panel" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '15px' }}>Prontuário Eletrônico</h3>
            
            {atendimentoAtual ? (
              <div>
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '4px', borderLeft: '4px solid #3498db' }}>
                  <p><strong>Paciente em consulta:</strong> {atendimentoAtual.paciente?.nome}</p>
                  <p><strong>Ficha:</strong> #{atendimentoAtual.id.substring(0, 5).toUpperCase()}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <textarea 
                    placeholder="Sintomas relatados na Anamnese..." 
                    value={sintomas} 
                    onChange={(e) => setSintomas(e.target.value)} 
                    rows="4" 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} 
                  />
                  <textarea 
                    placeholder="Diagnóstico Médico..." 
                    value={diagnostico} 
                    onChange={(e) => setDiagnostico(e.target.value)} 
                    rows="3" 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} 
                  />
                  <textarea 
                    placeholder="Prescrição (Medicamentos e Exames)..." 
                    value={prescricao} 
                    onChange={(e) => setPrescricao(e.target.value)} 
                    rows="4" 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} 
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button onClick={finalizarAtendimento} style={{ padding: '12px 24px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Salvar e Finalizar Consulta
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#999', backgroundColor: '#fafafa', borderRadius: '4px', border: '1px dashed #ccc' }}>
                <p>Selecione um paciente na fila para iniciar o atendimento.</p>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}