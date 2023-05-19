export interface ProjectModelInterface {
  id: number;
  titulo: string;
  estado: string;
  descripcion: string;
  macro_proyecto: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  semillero: string;
  retroalimentacion_final: string;
  visibilidad: number;
  ciudad: number;
  metodologia: string;
  conclusiones: string;
  justificacion: string;
  nota: number;
  tipo_proyecto: string;
}

export interface ProductModelInterface {
  id: number;
  titulo_producto: string;
  tipo_producto: string;
  url_repo: string;
  fecha: Date;
  proyecto: number;
}

export interface CommentModelInterface {
  id: number;
  comentario: string;
  califiacion: number;
  fase: string;
  nivel: string;
  fecha: Date; 
  producto_id: number;
}
