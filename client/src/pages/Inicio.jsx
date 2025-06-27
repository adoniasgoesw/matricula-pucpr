import React from 'react';
import { useNavigate } from 'react-router-dom';
import pucLogo from '../assets/puc.png';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-[Poppins] bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-[#bb243e] shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={pucLogo} alt="PUCPR Logo" className="w-16 h-16 object-contain" />
            <h1 className="text-white text-lg md:text-xl ml-2 font-semibold">Pontifícia Universidade Católica</h1>
          </div>
          <div>
            <button className="text-white hover:underline text-sm md:text-base">Ajuda</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#bb243e]">Sistema de Matrícula Online</h2>
          <div className="mb-8">
            <ul className="space-y-4 text-gray-700 text-base md:text-lg">
              <li><span className="font-semibold text-[#bb243e]">1.</span> <span className="font-medium">Preencha seus dados pessoais:</span> Nome completo, CPF, e-mail e telefone.</li>
              <li><span className="font-semibold text-[#bb243e]">2.</span> <span className="font-medium">Escolha o curso:</span> Selecione entre as opções disponíveis.</li>
              <li><span className="font-semibold text-[#bb243e]">3.</span> <span className="font-medium">Envie os documentos:</span> Faça upload dos documentos necessários em PDF.</li>
              <li><span className="font-semibold text-[#bb243e]">4.</span> <span className="font-medium">Confirme o pagamento:</span> Marque a opção de pagamento realizado.</li>
              <li><span className="font-semibold text-[#bb243e]">5.</span> <span className="font-medium">Acompanhe o status:</span> Receba confirmação e acompanhe o progresso da sua matrícula.</li>
            </ul>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="px-8 py-3 bg-[#bb243e] hover:bg-[#a01e34] text-white rounded-lg font-semibold text-lg shadow-md transition-all duration-300"
              onClick={() => navigate('/formulario')}
            >
              Iniciar Matrícula
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-2">Pontifícia Universidade Católica</h3>
              <p className="text-sm text-gray-300">Excelência em educação desde 1946</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-300 mb-2">© 2023 PUC. Todos os direitos reservados.</p>
              <p className="text-sm text-gray-300">Contato: secretaria@puc.edu.br | (00) 0000-0000</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
