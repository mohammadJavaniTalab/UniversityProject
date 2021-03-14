export interface NameIdModel {
  name: string;
  id: string;
}

export interface IdModel {
  id: string;
}

export interface CrudObject {
  visible: boolean;
  update: boolean;
  edit: boolean;
  value: any;
  valueIndex: number;
}
