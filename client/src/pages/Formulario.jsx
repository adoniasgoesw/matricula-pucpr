import React, { useState } from 'react';
import pucLogo from '../assets/puc.png';

const Formulario = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    nascimento: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    documents: {
      rg: null,
      cpf: null,
      residencia: null,
      historico: null,
      certificado: null,
      foto: null
    },
    cardData: {
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    }
  });

  const steps = ['Dados Pessoais', 'Documentação', 'Escolha do Curso', 'Pagamento'];
  const courses = [
    {
      id: 1,
      name: 'Administração',
      type: 'Bacharelado',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.250,00',
      description: 'Forma profissionais capacitados para gerir organizações e recursos.'
    },
    {
      id: 2,
      name: 'Direito',
      type: 'Bacharelado',
      duration: '10 semestres',
      shift: 'Matutino/Noturno',
      tuition: 'R$ 1.850,00',
      description: 'Forma profissionais para atuar nas diversas áreas jurídicas.'
    },
    {
      id: 3,
      name: 'Engenharia de Software',
      type: 'Bacharelado',
      duration: '8 semestres',
      shift: 'Integral',
      tuition: 'R$ 1.650,00',
      description: 'Forma profissionais para desenvolvimento e gestão de sistemas.'
    },
    {
      id: 4,
      name: 'Medicina',
      type: 'Bacharelado',
      duration: '12 semestres',
      shift: 'Integral',
      tuition: 'R$ 9.800,00',
      description: 'Forma médicos com visão humanista e excelência técnica.'
    },
    {
      id: 5,
      name: 'Análise e Desenvolvimento de Sistemas',
      type: 'Tecnólogo',
      duration: '6 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.150,00',
      description: 'Forma profissionais para análise, desenvolvimento e manutenção de sistemas.'
    },
    {
      id: 6,
      name: 'Ciência da Computação',
      type: 'Bacharelado',
      duration: '8 semestres',
      shift: 'Integral',
      tuition: 'R$ 1.750,00',
      description: 'Forma profissionais para pesquisa e desenvolvimento em computação.'
    },
    {
      id: 7,
      name: 'Sistemas de Informação',
      type: 'Bacharelado',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.450,00',
      description: 'Forma profissionais para gestão de sistemas de informação empresariais.'
    },
    {
      id: 8,
      name: 'Engenharia Civil',
      type: 'Bacharelado',
      duration: '10 semestres',
      shift: 'Matutino',
      tuition: 'R$ 1.950,00',
      description: 'Forma engenheiros para planejamento e execução de obras civis.'
    },
    {
      id: 9,
      name: 'Engenharia Elétrica',
      type: 'Bacharelado',
      duration: '10 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.850,00',
      description: 'Forma engenheiros para sistemas elétricos e eletrônicos.'
    },
    {
      id: 10,
      name: 'Engenharia Mecânica',
      type: 'Bacharelado',
      duration: '10 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.800,00',
      description: 'Forma engenheiros para projetos e manutenção de sistemas mecânicos.'
    },
    {
      id: 11,
      name: 'Psicologia',
      type: 'Bacharelado',
      duration: '10 semestres',
      shift: 'Matutino/Noturno',
      tuition: 'R$ 1.650,00',
      description: 'Forma psicólogos para atuação em diversas áreas da psicologia.'
    },
    {
      id: 12,
      name: 'Pedagogia',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 950,00',
      description: 'Forma pedagogos para atuação na educação básica e gestão escolar.'
    },
    {
      id: 13,
      name: 'Letras - Português/Inglês',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.050,00',
      description: 'Forma professores de língua portuguesa e inglesa.'
    },
    {
      id: 14,
      name: 'História',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.000,00',
      description: 'Forma professores de história para educação básica.'
    },
    {
      id: 15,
      name: 'Geografia',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.000,00',
      description: 'Forma professores de geografia para educação básica.'
    },
    {
      id: 16,
      name: 'Matemática',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.100,00',
      description: 'Forma professores de matemática para educação básica.'
    },
    {
      id: 17,
      name: 'Física',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.100,00',
      description: 'Forma professores de física para educação básica.'
    },
    {
      id: 18,
      name: 'Química',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.100,00',
      description: 'Forma professores de química para educação básica.'
    },
    {
      id: 19,
      name: 'Biologia',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.100,00',
      description: 'Forma professores de biologia para educação básica.'
    },
    {
      id: 20,
      name: 'Filosofia',
      type: 'Licenciatura',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.000,00',
      description: 'Forma professores de filosofia para educação básica.'
    },
    {
      id: 21,
      name: 'Teologia',
      type: 'Bacharelado',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.200,00',
      description: 'Forma teólogos para atuação pastoral e acadêmica.'
    },
    {
      id: 22,
      name: 'Jornalismo',
      type: 'Bacharelado',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.350,00',
      description: 'Forma jornalistas para atuação em diversos meios de comunicação.'
    },
    {
      id: 23,
      name: 'Publicidade e Propaganda',
      type: 'Bacharelado',
      duration: '8 semestres',
      shift: 'Noturno',
      tuition: 'R$ 1.400,00',
      description: 'Forma publicitários para criação e gestão de campanhas publicitárias.'
    },
    {
      id: 24,
      name: 'Arquitetura e Urbanismo',
      type: 'Bacharelado',
      duration: '10 semestres',
      shift: 'Matutino',
      tuition: 'R$ 2.100,00',
      description: 'Forma arquitetos para projetos arquitetônicos e urbanísticos.'
    },
    {
      id: 25,
      name: 'Design',
      type: 'Bacharelado',
      duration: '8 semestres',
      shift: 'Matutino',
      tuition: 'R$ 1.500,00',
      description: 'Forma designers para criação de produtos e comunicação visual.'
    }
  ];

  const campuses = [
    { id: 'curitiba', name: 'Curitiba - Campus Central' },
    { id: 'londrina', name: 'Londrina' },
    { id: 'maringa', name: 'Maringá' },
    { id: 'toledo', name: 'Toledo' },
    { id: 'cascavel', name: 'Cascavel' },
    { id: 'ponta-grossa', name: 'Ponta Grossa' },
    { id: 'guarapuava', name: 'Guarapuava' },
    { id: 'pato-branco', name: 'Pato Branco' },
    { id: 'francisco-beltrao', name: 'Francisco Beltrão' },
    { id: 'uniao-da-vitoria', name: 'União da Vitória' },
    { id: 'paranagua', name: 'Paranaguá' },
    { id: 'campo-mourao', name: 'Campo Mourão' },
    { id: 'apucarana', name: 'Apucarana' },
    { id: 'cornelio-procopio', name: 'Cornélio Procópio' },
    { id: 'jacarezinho', name: 'Jacaerzinho' }
  ];

  // Input masks
  const applyCPFMask = (value) => {
    let masked = value.replace(/\D/g, '');
    if (masked.length > 11) masked = masked.slice(0, 11);
    
    if (masked.length > 9) {
      masked = masked.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    } else if (masked.length > 6) {
      masked = masked.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    } else if (masked.length > 3) {
      masked = masked.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
    }
    
    return masked;
  };

  const applyPhoneMask = (value) => {
    let masked = value.replace(/\D/g, '');
    if (masked.length > 11) masked = masked.slice(0, 11);
    
    if (masked.length > 6) {
      masked = masked.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (masked.length > 2) {
      masked = masked.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    }
    
    return masked;
  };

  const handleInputChange = (field, value) => {
    if (field === 'cpf') {
      value = applyCPFMask(value);
    } else if (field === 'telefone') {
      value = applyPhoneMask(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentUpload = (docType, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));
  };

  const handleCardInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      cardData: {
        ...prev.cardData,
        [field]: value
      }
    }));
  };

  const validateStep1 = () => {
    const requiredFields = ['nome', 'cpf', 'rg', 'nascimento', 'email', 'telefone', 'endereco', 'cidade', 'estado'];
    return requiredFields.every(field => formData[field].trim() !== '');
  };

  const validateStep2 = () => {
    return Object.values(formData.documents).every(doc => doc !== null);
  };

  const validateStep3 = () => {
    return selectedCourse !== null && selectedCampus !== '';
  };

  const validateStep4 = () => {
    if (paymentMethod === 'card') {
      const { number, name, expiry, cvv } = formData.cardData;
      return number.trim() && name.trim() && expiry.trim() && cvv.trim();
    }
    return true;
  };

  const nextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 0:
        isValid = validateStep1();
        if (!isValid) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
        }
        break;
      case 1:
        isValid = validateStep2();
        if (!isValid) {
          alert('Por favor, faça o upload de todos os documentos obrigatórios.');
          return;
        }
        break;
      case 2:
        isValid = validateStep3();
        if (!isValid) {
          alert('Por favor, selecione um curso e um campus.');
          return;
        }
        break;
      case 3:
        isValid = validateStep4();
        if (!isValid) {
          alert('Por favor, preencha todos os dados do cartão.');
          return;
        }
        setCurrentStep(4); // Show confirmation
        return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedCourse(null);
    setSelectedCampus('');
    setPaymentMethod('pix');
    setFormData({
      nome: '',
      cpf: '',
      rg: '',
      nascimento: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      documents: {
        rg: null,
        cpf: null,
        residencia: null,
        historico: null,
        certificado: null,
        foto: null
      },
      cardData: {
        number: '',
        name: '',
        expiry: '',
        cvv: ''
      }
    });
  };

  const generateMatriculaNumber = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${year}00${randomNum}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#bb243e] shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src={pucLogo} alt="PUCPR Logo" className="w-16 h-16 object-contain" />
            <h1 className="text-white text-xl ml-2 font-bold">Pontifícia Universidade Católica</h1>
          </div>
          <div>
            <button className="text-white hover:underline">Ajuda</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#bb243e]">Processo de Matrícula</h2>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center w-1/4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index < currentStep ? 'bg-[#bb243e] text-white' : 
                    index === currentStep ? 'bg-[#bb243e] text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-center">{step}</span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-300 relative">
              <div 
                className="h-full bg-[#bb243e] transition-all duration-300" 
                style={{ width: `${Math.min(((currentStep + 1) / 4) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Form Steps */}
          <div>
            {currentStep === 0 && (
              <div>
                {/* Aviso de Segurança */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">⚠️ Projeto Acadêmico</h4>
                      <p className="text-sm text-yellow-700">
                        Este é um projeto acadêmico demonstrativo. <strong>NÃO insira dados pessoais reais</strong> como CPF, RG ou informações pessoais verdadeiras. Use dados fictícios para testar o sistema.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-[#bb243e]">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF*</label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RG*</label>
                    <input
                      type="text"
                      value={formData.rg}
                      onChange={(e) => handleInputChange('rg', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento*</label>
                    <input
                      type="date"
                      value={formData.nascimento}
                      onChange={(e) => handleInputChange('nascimento', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo*</label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade*</label>
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={nextStep} 
                    className="px-6 py-2 bg-[#bb243e] text-white rounded-md transition-all duration-300 hover:bg-[#a01e34]"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                {/* Aviso de Segurança */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">⚠️ Projeto Acadêmico</h4>
                      <p className="text-sm text-yellow-700">
                        Este é um projeto acadêmico demonstrativo. <strong>NÃO faça upload de documentos reais</strong> como RG, CPF ou documentos pessoais verdadeiros. Use arquivos fictícios para testar o sistema.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-[#bb243e]">Documentação</h3>
                <p className="text-gray-600 mb-6">Faça o upload dos documentos necessários para a matrícula. Todos os arquivos devem estar em formato PDF.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {[
                    { key: 'rg', label: 'RG (frente e verso)*' },
                    { key: 'cpf', label: 'CPF*' },
                    { key: 'residencia', label: 'Comprovante de Residência*' },
                    { key: 'historico', label: 'Histórico Escolar*' },
                    { key: 'certificado', label: 'Certificado de Conclusão do Ensino Médio*' },
                    { key: 'foto', label: 'Foto 3x4*' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                      <div
                        className="relative border-2 border-dashed border-[#bb243e] rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                        onClick={e => {
                          e.currentTarget.querySelector('input[type=file]').click();
                        }}
                      >
                        <input
                          type="file"
                          className="hidden"
                          accept={key === 'foto' ? '.pdf,.jpg,.jpeg,.png' : '.pdf'}
                          onChange={(e) => handleDocumentUpload(key, e.target.files[0])}
                          required
                          tabIndex={-1}
                        />
                        <div className="text-gray-500">
                          {formData.documents[key] ? (
                            <>
                              <svg className="w-6 h-6 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <p className="text-green-600">{formData.documents[key].name}</p>
                            </>
                          ) : (
                            <>
                              <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                              </svg>
                              <p>Clique para selecionar ou arraste o arquivo</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={prevStep} 
                    className="px-6 py-2 border border-[#bb243e] text-[#bb243e] rounded-md transition-all duration-300 hover:bg-gray-100"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={nextStep} 
                    className="px-6 py-2 bg-[#bb243e] text-white rounded-md transition-all duration-300 hover:bg-[#a01e34]"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                {/* Aviso de Segurança */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">⚠️ Projeto Acadêmico</h4>
                      <p className="text-sm text-yellow-700">
                        Este é um projeto acadêmico demonstrativo. A seleção de curso e campus é apenas para demonstração. <strong>Não há matrícula real</strong> sendo processada.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-[#bb243e]">Escolha do Curso e Campus</h3>
                <p className="text-gray-600 mb-6">Selecione o curso e o campus de sua preferência para realizar a matrícula.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campus*</label>
                    <select
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o campus</option>
                      {campuses.map((campus) => (
                        <option key={campus.id} value={campus.id}>
                          {campus.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Curso*</label>
                    <select
                      value={selectedCourse ? selectedCourse.id : ''}
                      onChange={(e) => {
                        const courseId = parseInt(e.target.value);
                        const course = courses.find(c => c.id === courseId);
                        setSelectedCourse(course);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o curso</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedCourse && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-lg text-[#bb243e] mb-4">Detalhes do Curso Selecionado</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Nome do Curso:</span>
                        <p className="font-medium">{selectedCourse.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Tipo:</span>
                        <p className="font-medium">{selectedCourse.type}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Duração:</span>
                        <p className="font-medium">{selectedCourse.duration}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Turno:</span>
                        <p className="font-medium">{selectedCourse.shift}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Mensalidade:</span>
                        <p className="font-medium text-[#bb243e]">{selectedCourse.tuition}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-600">Descrição:</span>
                        <p className="font-medium">{selectedCourse.description}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button 
                    onClick={prevStep} 
                    className="px-6 py-2 border border-[#bb243e] text-[#bb243e] rounded-md transition-all duration-300 hover:bg-gray-100"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={nextStep} 
                    className="px-6 py-2 bg-[#bb243e] text-white rounded-md transition-all duration-300 hover:bg-[#a01e34]"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#bb243e]">Pagamento da Matrícula</h3>
                
                {/* Aviso de Segurança */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">⚠️ Projeto Acadêmico</h4>
                      <p className="text-sm text-yellow-700">
                        Este é um projeto acadêmico demonstrativo. <strong>NÃO insira dados financeiros reais</strong> como números de cartão de crédito, CPF real ou informações bancárias. Use dados fictícios para testar o sistema.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">Escolha a forma de pagamento para a taxa de matrícula.</p>
                
                {selectedCourse && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Curso selecionado:</p>
                        <p className="font-semibold text-[#bb243e]">{selectedCourse.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Valor da matrícula:</p>
                        <p className="text-xl font-bold text-[#bb243e]">{selectedCourse.tuition}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="payment-pix"
                      name="payment-method"
                      value="pix"
                      checked={paymentMethod === 'pix'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="payment-pix" className="font-medium">PIX</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="payment-card"
                      name="payment-method"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="payment-card" className="font-medium">Cartão de Crédito</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="payment-boleto"
                      name="payment-method"
                      value="boleto"
                      checked={paymentMethod === 'boleto'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="payment-boleto" className="font-medium">Boleto Bancário</label>
                  </div>
                </div>
                
                {paymentMethod === 'pix' && (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-semibold text-lg text-gray-800">Pagamento via PIX</h4>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg mx-auto w-64 h-64 mb-6 flex items-center justify-center">
                      <div className="grid grid-cols-25 gap-0.5 w-48 h-48">
                        {/* QR Code pattern - simplified but realistic */}
                        {Array.from({ length: 625 }, (_, i) => {
                          const row = Math.floor(i / 25);
                          const col = i % 25;
                          const isBlack = (
                            // Corner patterns
                            (row < 7 && col < 7) || (row < 7 && col > 17) || (row > 17 && col < 7) ||
                            // Center pattern
                            (row > 9 && row < 15 && col > 9 && col < 15) ||
                            // Random pattern for realism
                            Math.random() > 0.6
                          );
                          return (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 ${isBlack ? 'bg-black' : 'bg-white'}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Chave PIX: <span className="font-mono font-medium">matricula@puc.edu.br</span></p>
                      <p className="text-sm text-gray-600">Valor: <span className="font-bold text-lg text-[#bb243e]">{selectedCourse ? selectedCourse.tuition : 'R$ 0,00'}</span></p>
                      <p className="text-xs text-gray-500 mt-4">Escaneie o QR Code com o app do seu banco</p>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'card' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão*</label>
                        <input
                          type="text"
                          value={formData.cardData.number}
                          onChange={(e) => handleCardInputChange('number', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão*</label>
                        <input
                          type="text"
                          value={formData.cardData.name}
                          onChange={(e) => handleCardInputChange('name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Validade*</label>
                        <input
                          type="text"
                          value={formData.cardData.expiry}
                          onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                          placeholder="MM/AA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                        <input
                          type="text"
                          value={formData.cardData.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb243e] focus:border-transparent"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg mb-6">
                      <p className="text-sm text-gray-600">Valor da matrícula: <span className="font-bold text-[#bb243e]">{selectedCourse ? selectedCourse.tuition : 'R$ 0,00'}</span></p>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'boleto' && (
                  <div className="bg-gray-100 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold mb-4">Boleto Bancário</h4>
                    <p className="text-sm text-gray-600 mb-4">O boleto será gerado após a confirmação dos dados. Você receberá uma cópia no e-mail cadastrado.</p>
                    <p className="text-sm text-gray-600">Valor da matrícula: <span className="font-bold text-[#bb243e]">{selectedCourse ? selectedCourse.tuition : 'R$ 0,00'}</span></p>
                    <button
                      onClick={() => alert('Boleto gerado com sucesso! Um e-mail foi enviado com as instruções de pagamento.')}
                      className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Gerar Boleto
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button 
                    onClick={prevStep} 
                    className="px-6 py-2 border border-[#bb243e] text-[#bb243e] rounded-md transition-all duration-300 hover:bg-gray-100"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={nextStep} 
                    className="px-6 py-2 bg-[#bb243e] text-white rounded-md transition-all duration-300 hover:bg-[#a01e34]"
                  >
                    Finalizar Matrícula
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Matrícula Enviada com Sucesso!</h3>
                <p className="text-gray-600 mb-6">Sua matrícula foi recebida e está em análise.</p>
                
                <div className="bg-gray-100 p-6 rounded-lg mb-6 max-w-md mx-auto">
                  <h4 className="font-semibold mb-4 text-[#bb243e]">Status da Matrícula</h4>
                  <div className="flex justify-between mb-2">
                    <span>Número da matrícula:</span>
                    <span className="font-medium">{generateMatriculaNumber()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Status:</span>
                    <span className="font-medium text-yellow-600">Em análise documental</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Curso:</span>
                    <span className="font-medium">{selectedCourse?.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Pagamento:</span>
                    <span className="font-medium text-green-600">Confirmado</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">Você receberá um e-mail com mais informações sobre os próximos passos.</p>
                <p className="text-gray-600 mb-6">Em caso de dúvidas, entre em contato com a secretaria acadêmica.</p>
                
                <button 
                  onClick={resetForm} 
                  className="px-6 py-2 bg-[#bb243e] text-white rounded-md transition-all duration-300 hover:bg-[#a01e34]"
                >
                  Voltar para o Início
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
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
};

export default Formulario; 