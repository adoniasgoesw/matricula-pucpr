import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { enviarMatricula } from '../services/api';

export default function Formulario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    curso: '',
    documentos: [],
    pagamentoRealizado: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cursos = [
    'Análise e Desenvolvimento de Sistemas',
    'Administração',
    'Direito',
    'Engenharia Civil',
    'Medicina'
  ];

  // Máscara para CPF
  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cpf') {
      const formattedValue = formatCPF(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, documentos: files }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf || formData.cpf.length < 14) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.curso) {
      newErrors.curso = 'Selecione um curso';
    }

    if (formData.documentos.length === 0) {
      newErrors.documentos = 'Envie pelo menos um documento';
    }

    if (!formData.pagamentoRealizado) {
      newErrors.pagamentoRealizado = 'Confirme que o pagamento foi realizado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await enviarMatricula(formData);
      navigate('/confirmacao');
    } catch (error) {
      console.error('Erro ao enviar matrícula:', error);
      alert('Erro ao enviar matrícula. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Formulário de Matrícula
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>
              Dados Pessoais
            </Typography>
            
            <TextField
              fullWidth
              label="Nome completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.nome}
              helperText={errors.nome}
            />
            
            <TextField
              fullWidth
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.cpf}
              helperText={errors.cpf || 'Formato: 000.000.000-00'}
              inputProps={{ maxLength: 14 }}
            />
            
            <TextField
              fullWidth
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            
            <TextField
              fullWidth
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal" required error={!!errors.curso}>
              <InputLabel>Curso</InputLabel>
              <Select
                name="curso"
                value={formData.curso}
                label="Curso"
                onChange={handleChange}
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso} value={curso}>
                    {curso}
                  </MenuItem>
                ))}
              </Select>
              {errors.curso && <Alert severity="error" sx={{ mt: 1 }}>{errors.curso}</Alert>}
            </FormControl>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Documentos
            </Typography>
            
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              style={{ marginBottom: '16px' }}
            />
            {errors.documentos && <Alert severity="error" sx={{ mb: 2 }}>{errors.documentos}</Alert>}
            
            {formData.documentos.length > 0 && (
              <Box mb={2}>
                <Typography variant="body2">
                  Arquivos selecionados: {formData.documentos.map(file => file.name).join(', ')}
                </Typography>
              </Box>
            )}
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Pagamento
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="pagamentoRealizado"
                  checked={formData.pagamentoRealizado}
                  onChange={handleChange}
                />
              }
              label="Pagamento realizado"
            />
            {errors.pagamentoRealizado && <Alert severity="error" sx={{ mt: 1 }}>{errors.pagamentoRealizado}</Alert>}
            
            <Box textAlign="center" mt={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Matrícula'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 