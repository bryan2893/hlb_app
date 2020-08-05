export interface TraspatioFincaConIdLocalDTO{
    id_local:Number;
    id_traspatio_finca:Number;
    pais: String;
    tipo:String;
    finca_poblado:String;
    lote_propietario:String;
    latitud: Number;
    longitud: Number;
    estado:Number;
    provincia:String;
    canton:String;
    distrito:String;
    sincronizado:Number;//1 = sincronizado, 0 = no sincronizado.
}