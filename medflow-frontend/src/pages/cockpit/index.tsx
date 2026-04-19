import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. DADOS FALSOS (MOCK) - Usado apenas para testar a tela antes de ligar no banco
const pacientesIniciais = [
  { id: '1', nome: 'João da Silva', status: 'AGUARDANDO', tempoEspera: '15 min', atrasado: false },
  { id: '2', nome: 'Dona Maria (Idosa)', status: 'AGUARDANDO', tempoEspera: '45 min', atrasado: true },
  { id: '3', nome: 'Carlos Eduardo', status: 'CONVOCADO', tempoEspera: '5 min', atrasado: false },
  { id: '4', nome: 'Ana Souza', status: 'EM_ATENDIMENTO', tempoEspera: '-', atrasado: false },
];

export function Cockpit() {
  const navigate = useNavigate();
  
  // 2. ESTADO (STATE) - Guarda a lista de pacientes na memória do componente
  const [pacientes, setPacientes] = useState(pacientesIniciais);

  // 3. REGRAS DE NEGÓCIO - Filtra a lista principal para separar quem vai pra qual coluna
  const aguardando = pacientes.filter(p => p.status === 'AGUARDANDO');
  const convocados = pacientes.filter(p => p.status === 'CONVOCADO');
  const emAtendimento = pacientes.filter(p => p.status === 'EM_ATENDIMENTO');

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* CABEÇALHO */}
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <h1>Cockpit da Recepção - Kanban</h1>
        <button 
          onClick={() => navigate('/recepcao')}
          className="bg-white text-blue-800 px-4 py-2 rounded font-bold"
        >
          + Novo Paciente
        </button>
      </header>

      {/* KANBAN (As 3 Colunas) */}
      <main className="p-8 flex gap-6 overflow-x-auto">
        
        {/* COLUNA 1: AGUARDANDO */}
        <div className="w-80 bg-gray-200 rounded-lg p-4">
          <h2 className="font-bold mb-4">1. Aguardando ({aguardando.length})</h2>
          
          {/* 4. RENDERIZAÇÃO DE LISTA - O 'map' cria um cartão HTML para cada paciente */}
          {aguardando.map(paciente => (
            <div 
              key={paciente.id} 
              // REGRA DA US-10: Se estiver atrasado, muda a cor do cartão (Operador Ternário)
              className={`p-4 mb-3 bg-white rounded shadow border-l-4 ${paciente.atrasado ? 'border-red-500 bg-red-50' : 'border-blue-500'}`}
            >
              <p className="font-bold">{paciente.nome}</p>
              <p className="text-sm">Espera: {paciente.tempoEspera}</p>
              
              {/* Mostra o aviso de atraso somente se o 'atrasado' for verdadeiro */}
              {paciente.atrasado && (
                <span className="text-xs text-red-500 font-bold">⚠️ Tempo Excedido</span>
              )}
            </div>
          ))}
        </div>

        {/* COLUNA 2: CONVOCADO */}
        <div className="w-80 bg-gray-200 rounded-lg p-4">
          <h2 className="font-bold mb-4">2. Convocado ({convocados.length})</h2>
          
          {convocados.map(paciente => (
            <div key={paciente.id} className="p-4 mb-3 bg-white rounded shadow border-l-4 border-yellow-400">
              <p className="font-bold">{paciente.nome}</p>
              <p className="text-sm text-gray-500">Notificado via WhatsApp</p>
            </div>
          ))}
        </div>

        {/* COLUNA 3: EM ATENDIMENTO */}
        <div className="w-80 bg-gray-200 rounded-lg p-4">
          <h2 className="font-bold mb-4">3. Em Atendimento ({emAtendimento.length})</h2>
          
          {emAtendimento.map(paciente => (
            <div key={paciente.id} className="p-4 mb-3 bg-white rounded shadow border-l-4 border-green-500">
              <p className="font-bold">{paciente.nome}</p>
              <p className="text-sm text-green-600">Na sala do médico</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}