# Backend - Sistema de Matrícula PUC

Backend completo para o sistema de matrícula da Pontifícia Universidade Católica do Paraná, desenvolvido com Node.js, Express, Prisma e Azure Blob Storage.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Azure Blob Storage** - Armazenamento de documentos
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **Helmet** - Segurança
- **Rate Limiting** - Proteção contra spam

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- Conta Azure (para Blob Storage)
- Git

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd matricula-pucpr/server
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Servidor
NODE_ENV=development
PORT=3000

# Configurações do Frontend
FRONTEND_URL=http://localhost:5173

# Configurações do Banco de Dados
DATABASE_URL="postgresql://username:password@localhost:5432/matricula_puc?schema=public"

# Configurações do Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=yourstoragekey;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER=documentos-puc

# Configurações de Segurança
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
```

4. **Configure o banco de dados**
```bash
# Gerar cliente Prisma
npm run db:generate

# Criar tabelas no banco
npm run db:push

# Executar seed (dados iniciais)
npm run seed
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Estrutura do Projeto

```
server/
├── controllers/          # Controladores da aplicação
│   └── matriculaController.js
├── routes/              # Rotas da API
│   └── matriculaRoutes.js
├── services/            # Serviços (Azure Blob, etc.)
│   └── blobService.js
├── prisma/              # Configuração do Prisma
│   └── schema.prisma
├── scripts/             # Scripts utilitários
│   └── seed.js
├── middlewares/         # Middlewares customizados
├── utils/               # Utilitários
├── app.js              # Configuração do Express
├── index.js            # Ponto de entrada
└── package.json
```

## 🔌 Endpoints da API

### Matrículas
- `POST /api/matricula` - Criar nova matrícula
- `GET /api/status/:id` - Obter status da matrícula
- `GET /api/admin/matriculas` - Listar matrículas (admin)
- `PUT /api/admin/matricula/:id/status` - Atualizar status (admin)

### Documentos
- `POST /api/documento` - Upload de documento

### Pagamentos
- `POST /api/pagamento` - Processar pagamento

### Contratos
- `GET /api/contrato/:matriculaId` - Gerar contrato

### Health Check
- `GET /health` - Status da API

## 🗄️ Modelos de Dados

### Matricula
- Dados pessoais do candidato
- Curso e campus selecionados
- Status do processo
- Valor da matrícula

### Documento
- Upload de arquivos (RG, CPF, etc.)
- Integração com Azure Blob Storage
- Validação de tipos e tamanhos

### Pagamento
- Métodos de pagamento (PIX, Cartão, Boleto)
- Status do processamento
- Dados específicos do pagamento

### Contrato
- Geração automática de contratos
- Numeração única
- Status de assinatura

## 🔒 Segurança

- **Helmet** - Headers de segurança
- **CORS** - Configurado para frontend específico
- **Rate Limiting** - Proteção contra spam
- **Validação de dados** - Validação de entrada
- **Upload seguro** - Validação de arquivos
- **Tratamento de erros** - Logs e respostas seguras

## 📁 Upload de Arquivos

O sistema suporta upload de:
- **PDF** - Documentos oficiais
- **JPEG/PNG** - Fotos e imagens

**Limites:**
- Tamanho máximo: 10MB
- Tipos permitidos: PDF, JPEG, PNG
- Validação de conteúdo

## 🚀 Deploy no Azure App Service

1. **Configure o Azure App Service**
```bash
# Instalar Azure CLI
az login
az webapp create --name matricula-puc-backend --resource-group your-rg --plan your-plan --runtime "NODE|18-lts"
```

2. **Configure as variáveis de ambiente no Azure**
```bash
az webapp config appsettings set --name matricula-puc-backend --resource-group your-rg --settings \
  NODE_ENV=production \
  DATABASE_URL="your-production-database-url" \
  AZURE_STORAGE_CONNECTION_STRING="your-azure-storage-connection-string"
```

3. **Deploy via GitHub Actions ou Azure CLI**
```bash
# Via Azure CLI
az webapp deployment source config --name matricula-puc-backend --resource-group your-rg --repo-url https://github.com/your-repo.git --branch main
```

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test

# Testar endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/matricula
```

## 📊 Monitoramento

- **Morgan** - Logs de requisições
- **Health Check** - Status da aplicação
- **Error Handling** - Tratamento de erros
- **Rate Limiting** - Monitoramento de requisições

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com nodemon
npm start           # Produção
npm run seed        # Popular banco com dados iniciais
npm run db:generate # Gerar cliente Prisma
npm run db:push     # Sincronizar schema
npm run db:migrate  # Executar migrações
npm run db:studio   # Abrir Prisma Studio
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento da PUC. 