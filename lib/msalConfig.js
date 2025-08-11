import { CONSTANTS } from "@/constants";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: CONSTANTS.MICROSOFT_CLIENT_ID,
    authority: "https://login.microsoftonline.com/41c4aed8-357f-40b2-86a1-118ab218da23",
    redirectUri: CONSTANTS.CLIENT_URL
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);