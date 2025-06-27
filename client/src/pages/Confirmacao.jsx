import React from 'react';
import { Container, Typography, Button, Box, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Confirmacao() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Confirmação de Matrícula
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom color="success.main">
            Matrícula enviada com sucesso!
          </Typography>
          
          <Typography variant="body1" paragraph>
            Sua solicitação de matrícula foi recebida e está sendo processada.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Status atual:</strong> Pendente - Validando documentos
            </Typography>
          </Alert>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Você receberá atualizações sobre o status da sua matrícula por e-mail.
            O número de protocolo será enviado em breve.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
            >
              Voltar para Início
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                // Aqui você pode implementar a verificação de status
                alert('Funcionalidade de verificação de status será implementada na próxima etapa.');
              }}
            >
              Verificar Status
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 