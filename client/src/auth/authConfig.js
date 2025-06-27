import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'SEU_CLIENT_ID_B2C',
    authority: 'https://SEU_TENANT.b2clogin.com/SEU_TENANT.onmicrosoft.com/B2C_1_signupsignin',
    redirectUri: '/',
  },
};

export const msalInstance = new PublicClientApplication(msalConfig); 