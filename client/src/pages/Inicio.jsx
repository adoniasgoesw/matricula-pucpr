import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Sistema de Matrícula Online
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Como funciona o processo de matrícula:
          </Typography>
          
          <Typography variant="body1" paragraph>
            1. <strong>Preencha seus dados pessoais:</strong> Nome completo, CPF, e-mail e telefone.
          </Typography>
          
          <Typography variant="body1" paragraph>
            2. <strong>Escolha o curso:</strong> Selecione entre as opções disponíveis.
          </Typography>
          
          <Typography variant="body1" paragraph>
            3. <strong>Envie os documentos:</strong> Faça upload dos documentos necessários em PDF.
          </Typography>
          
          <Typography variant="body1" paragraph>
            4. <strong>Confirme o pagamento:</strong> Marque a opção de pagamento realizado.
          </Typography>
          
          <Typography variant="body1" paragraph>
            5. <strong>Acompanhe o status:</strong> Receba confirmação e acompanhe o progresso da sua matrícula.
          </Typography>
          
          <Box textAlign="center" mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/formulario')}
            >
              Iniciar Matrícula
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 