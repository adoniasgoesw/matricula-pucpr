const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('arquivo');

exports.upload = async (req) => {
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient('documentos');
  const blobName = `${Date.now()}-${req.file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(req.file.buffer, req.file.size);
  return blockBlobClient.url;
};
