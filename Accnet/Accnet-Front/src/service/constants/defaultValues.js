export const hostName = "https://cjtest.ir";
export const redirectFromDocuSign = "https://erp.accnetinc.com/client/taxes";
export const docuSignLocalStorageTaxName = "DOCU_SIGN_TAX_ID";
export const blobDownload = `${hostName}/api/blob/download/`;
export const surveyBlobDownload = `${hostName}/api/blob/user-survey/download/`;
export const blobUpload = `${hostName}/api/blob/upload`;
export const loginLocalStorageName = "ACCNET-SUPPORT-AUT";
export const amountSign = "$";

export const pathProject = {
  client: {
    messages: "/client/messages/",
    profile: "/client/profile/",
    ticket: "/client/ticket/",
    message: "/client/message/",
    invoice: "/client/invoice/",
    taxes: "/client/taxes/",
    link_account: "/client/link_account/",
    survey_history: "/client/survey/",
  },
  management: {
    role: "/management/role/",
    feature: "/management/feature/",
    invoice: "/management/invoice/",
    message: "/management/message/",
    marketing : "/management/marketing",
    linkedUser: "/management/link-user/",
    survey: "/management/survey/",
    tax: "/management/tax/",
    ticket: "/management/ticket/",
    user: "/management/user/",
    profile: "/management/profile/",
    appointment: "/management/appointment/",
    consultation_Exception: "/management/appointment-exception/",
  },
  login: "/",
  forgot_password: "/forgot-password/",
  term: "/terms-of-service/",
  policy: "/privacy-policy/",
  payment: {
    success: "/payment/success",
    failed: "/payment/failed/",
  },
  register: "/register/",
};
export const dashboard_Type = {
  taxes: "TAXES",
  invoice: "PAID_INVOICE",
  message: "MESSAGES",
  link_account: "LINK_ACCOUNT",
  ticket: "TICKET",
  messages: "MESSAGES",
  profile: "PROFILE",
  accept_user: "ACCEPT_USER",
  survey_history: "SURVEY_HISTORY",
  payment_success: "SUCCESS",
  payment_failed: "FAILED",
};

// ==============================================
export const languageKey = "Language";
export const defaultLanguage = "fa-IR";
