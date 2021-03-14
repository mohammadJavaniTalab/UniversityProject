import { ApplicationDataResponse } from "../essentials-tools/type/Response-type";

interface BasicCommentModel {
  text: string;
  blobId: string;
}

export interface CommentAddModel extends BasicCommentModel {
  ticketId: string;
}

export interface CommentEditModel extends BasicCommentModel {
  id: string;
}

export interface CommentDataResponse extends ApplicationDataResponse {
  data: string;
}


