import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import "animate.css";
import back from '../public/background.jpg'

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center  bg-cover bg-center justify-center "  style={{ backgroundImage: `url(${back})` }} >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 animate__animated animate__fadeIn">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-900/50">
            <UserPlus className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white animate__animated animate__fadeInDown">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Ou{' '}
            <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
              faça login na sua conta existente
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 animate__animated animate__fadeIn" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="w-90 h-12 relative flex rounded-xl">
              <input
                required
                className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl border border-gray-600 focus:border-purple-500 focus:shadow-[0_0_0_1px] focus:shadow-purple-500 text-white"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="absolute top-1/2 translate-y-[-50%] bg-gray-800 left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-purple-400 peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-purple-400 duration-150 text-gray-400"
              >
                Email
              </label>
            </div>

            <div className="w-90 h-12 relative flex rounded-xl">
              <input
                required
                className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl border border-gray-600 focus:border-purple-500 focus:shadow-[0_0_0_1px] focus:shadow-purple-500 text-white"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="absolute top-1/2 translate-y-[-50%] bg-gray-800 left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-purple-400 peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-purple-400 duration-150 text-gray-400"
              >
                Senha
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:animate__heartBeat"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
