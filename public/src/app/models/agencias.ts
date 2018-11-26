export interface Agencia {
  agencia: {
    empresa?: string;
    provincia?: string;
    municipio?: string;
    ciudad?: string;
    sector?: string;
    calle?: string;
    referencia: string;
    distanciaRef?: string;
    georeferencia?: string;
  };
  images: Array<any>;
  id?: string;
}
