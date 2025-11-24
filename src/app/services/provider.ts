export interface Proveedor {
  id: number;
  nombreEmpresa: string;
  nombreContacto?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}