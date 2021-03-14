import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
// --------------------------- reducer --------------------------
import { roleReducer } from "./role/Reducer";
import { featureReducer } from "./feature/Reducer";
import { userReducer } from "./user/Reducer";
import { invoiceReducer } from "./invoice/Reducer";
import { registerReducer } from "./auth/register/Reducer";
import { advanceRegisterReducer } from "./auth/register/Reducer";
import { loginReducer } from "./auth/generate-token/Reducer";
import { profileReducer, smallProfileReducer } from "./auth/profile/Reducer";
import { taxReducer } from "./tax/Reducer";
import { messageReducer } from "./message/Reducer";
import { tikbedSetting } from "./management/sidebar/Reducer";
import { surveyReducer } from "./survey/Reducer";
import { permissionReducer } from "./permission/Reducer";
import { organizationReducer } from "./link_user/Reducer";
import { ticketReducer } from "./../redux-logic/ticket/Reducer";
import { appointmentReducer } from "./appointment/Reducer";
import { consultationExceptionReducer } from "./consultation-exception/Reducer";
import {
  userSurveyListReducer,
  userSurveyQuestionReducer,
} from "./user-survey/Reducer";
import { forgotPasswordReducer } from "./auth/forgot-password/Reducer";
import {
  payPalCreateOrderReducer,
  payPalCaptureOrderReducer,
} from "./payPal/Reducer";
import { googleAutoCompleteReducer } from "./google/Reducer";

// --------------------------------------------------------------

// survey relatives , dependents
import {
  relativeActionsReducer,
  relativeListReducer,
} from "./relative/Reducer";
import {
  dependentListReducer,
  dependent_add_delete_reducer,
} from "./dependent/Reducer";
// ---------------

//DocuSign reducers
import { fetchEngagementFormReducer } from "./docusign/engagement/Reducer";
import { fetchTaxFormReducer } from "./docusign/tax-form/Reducer";
// ---------------

// delete survey reducer
import {
  deleteSurveyReducer,
  getExceptionsReducer,
  sendExceptionsReducer,
} from "./user-survey/Reducer";
// ---------------

// assessment and reducer
import {
  fetchAssessmentList,
  add_delete_assessment,
} from "./assessment/Reducer";
import { addReceiptReducer, listReceiptReducer } from "./receipts/Reducer";
// ---------------

// spouse services
import { spouseReducer, fetchSpouseReducer } from "./spouse/Reducer";

//update survey state
import { surveyUpdateReducer } from "./survey/survey-update/Reducer";

//files
import {
  addAllFiles,
  fetchAllFiles,
  fetchChildCareFiles,
  fetchMedicalFiles,
  fetchSelfFiles
} from "./files/Reducer";


//****** Marketing
import { fetchMarketingList } from "./marketing/Reducer"

const rootReducer = combineReducers({
  roleReducer,
  featureReducer,
  userReducer,
  invoiceReducer,
  registerReducer,
  advanceRegisterReducer,
  loginReducer,
  profileReducer,
  taxReducer,
  messageReducer,
  tikbedSetting,
  surveyReducer,
  permissionReducer,
  organizationReducer,
  ticketReducer,
  appointmentReducer,
  userSurveyListReducer,
  userSurveyQuestionReducer,
  forgotPasswordReducer,
  payPalCreateOrderReducer,
  payPalCaptureOrderReducer,
  relativeActionsReducer,
  relativeListReducer,
  dependentListReducer,
  dependent_add_delete_reducer,
  consultationExceptionReducer,
  googleAutoCompleteReducer,
  fetchTaxFormReducer,
  fetchEngagementFormReducer,
  deleteSurveyReducer,
  fetchAssessmentList,
  add_delete_assessment,
  addReceiptReducer,
  spouseReducer,
  fetchSpouseReducer,
  listReceiptReducer,
  smallProfileReducer,
  surveyUpdateReducer,
  getExceptionsReducer,
  sendExceptionsReducer,
  addAllFiles,
  fetchAllFiles,
  fetchChildCareFiles,
  fetchMedicalFiles,
  fetchMarketingList,
  fetchSelfFiles
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const middleWares = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middleWares);
  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  );
  return store;
}
