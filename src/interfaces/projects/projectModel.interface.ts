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
    tipo_proyecto: string
  }