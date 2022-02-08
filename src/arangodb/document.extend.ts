/**
 * A value that can be used to identify a document within a collection in
 * arangojs methods, i.e. a partial ArangoDB document.
 */
export interface IDocument extends Record<string, any> {
  _key: string;
  _id: string;
}

/**
 * A value that can be used to identify a document within a collection in
 * arangojs methods, i.e. a partial ArangoDB document.
 */
export interface IEdge extends IDocument {
  _from: string;
  _to: string;
}

/**
 * A value that can be used to identify a document within a collection in
 * arangojs methods, i.e. a partial ArangoDB document.
 */
export declare type DocumentFindOneSelector = Partial<IDocument | IEdge>;
