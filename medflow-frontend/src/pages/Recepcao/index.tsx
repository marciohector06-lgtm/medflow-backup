import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, senha });
      
      // Salva no navegador
      localStorage.setItem('user', JSON.stringify(response.data));

      // MENSAGEM NOVA AQUI!
      alert('Acesso Liberado! Indo para a Recepção 🚀');
      
      // Redireciona
      navigate('/recepcao'); 
      
    } catch (err) {
      alert('E-mail ou senha incorretos!');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-8">MedFlow</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input 
              type="email" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition font-bold"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}