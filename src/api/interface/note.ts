export namespace Note {
  export interface NoteList {
    name: string;
    code: string;
    content: string;
    id: number;
    type: number;
    gmtCreate: string;
    gmtModified: string;
  }
  export interface NoteParams {
    type?: number;
    name?: string;
  }
  export interface NoteAddParams extends NoteParams {
    id?: number;
    content?: string;
  }
  export interface SaveNote extends Omit<NoteAddParams, "type"> {
    templateId: number;
    phones: string;
  }
  export interface NoteLogList {
    id: number;
    gmtCreate: number;
    phone: string;
    response: string;
    status: string;
    templateName: string;
    templateType: string;
    content: string;
  }
}
