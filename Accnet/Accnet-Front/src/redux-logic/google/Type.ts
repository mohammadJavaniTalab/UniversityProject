import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";

export interface GoogleAutoCompleteStructuredFormattingModel {
  main_text: string;
  main_text_matched_substrings: Array<GoogleAutoCompleteMatchedSubstringsModel>;
  secondary_text: string;
}

export interface GoogleAutoCompleteMatchedSubstringsModel {
  length: number;
  offset: number;
}

export interface GoogleAutoCompleteTermModel {
  offset: number;
  value: string;
}

export interface GoogleAutoCompleteModel {
  description: string;
  id: string;
  matched_substrings: Array<GoogleAutoCompleteMatchedSubstringsModel>;
  place_id: string;
  reference: string;
  structured_formatting: GoogleAutoCompleteStructuredFormattingModel;
  terms: Array<GoogleAutoCompleteTermModel>;
  types: Array<string>;
}

export interface GoogleAutoCompleteResponse extends ApplicationDataResponse {
  data: Array<GoogleAutoCompleteModel>;
}

interface GoogleAutoCompleteType {
  type: "GOOGLE_AUTO_COMPLETE";
  response: GoogleAutoCompleteResponse;
}

export type GoogleAutoCompleteActionType = GoogleAutoCompleteType;
