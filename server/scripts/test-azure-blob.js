const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

async function testAzureBlobConnection() {
  console.log('🧪 Testando conexão com Azure Blob Storage...\n');

  try {
    // URL do SAS Token
    const blobSasUrl = process.env.AZURE_BLOB_SAS_URL || 'https://arquivosalunos.blob.core.windows.net/?sv=2024-11-04&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2026-06-28T21:21:06Z&st=2025-06-28T13:21:06Z&spr=https&sig=tgFdtvzm4MOJZIEPl4qpfST79zQpPrXbkaUtnELMWcQ%3D';
    const containerName = process.env.AZURE_STORAGE_CONTAINER || 'documentos-matricula';

    console.log('📋 Configurações:');
    console.log(`   Container: ${containerName}`);
    console.log(`   SAS URL: ${blobSasUrl.substring(0, 50)}...`);
    console.log('');

    // Criar cliente do Blob Service
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    console.log('✅ Cliente do Blob Service criado com sucesso');

    // Obter cliente do container
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log('✅ Cliente do container criado com sucesso');

    // Verificar se o container existe
    const containerExists = await containerClient.exists();
    if (containerExists) {
      console.log('✅ Container existe');
    } else {
      console.log('⚠️ Container não existe, tentando criar...');
      await containerClient.create();
      console.log('✅ Container criado com sucesso');
    }

    // Listar blobs no container
    console.log('\n📁 Listando arquivos no container:');
    let blobCount = 0;
    for await (const blob of containerClient.listBlobsFlat()) {
      console.log(`   - ${blob.name} (${blob.properties.contentLength} bytes)`);
      blobCount++;
    }
    
    if (blobCount === 0) {
      console.log('   (Nenhum arquivo encontrado)');
    }

    console.log(`\n📊 Total de arquivos: ${blobCount}`);

    // Teste de upload de arquivo de exemplo
    console.log('\n📤 Testando upload de arquivo...');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Este é um arquivo de teste para verificar a conectividade com Azure Blob Storage.';
    const testBuffer = Buffer.from(testContent, 'utf8');

    const blockBlobClient = containerClient.getBlockBlobClient(testFileName);
    await blockBlobClient.uploadData(testBuffer, {
      blobHTTPHeaders: { blobContentType: 'text/plain' }
    });

    console.log(`✅ Arquivo de teste enviado: ${testFileName}`);

    // Verificar se o arquivo foi criado
    const blobExists = await blockBlobClient.exists();
    if (blobExists) {
      console.log('✅ Arquivo de teste confirmado no container');
      
      // Obter URL do arquivo
      const blobUrl = blockBlobClient.url;
      console.log(`🔗 URL do arquivo: ${blobUrl}`);
    }

    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('✅ Azure Blob Storage está funcionando corretamente');

  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message);
    console.error('Detalhes:', error);
    
    if (error.message.includes('403')) {
      console.log('\n💡 Possíveis soluções:');
      console.log('   1. Verificar se o SAS Token está correto');
      console.log('   2. Verificar se as permissões estão configuradas corretamente');
      console.log('   3. Verificar se o container existe');
    }
  }
}

// Executar o teste
testAzureBlobConnection(); 