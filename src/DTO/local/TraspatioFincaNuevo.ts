export interface TraspatioFincaNuevo{
    id_traspatio_finca:Number;
    pais: String;
    tipo:String;
    provincia:String;
    canton:String;
    distrito:String;
    finca_poblado:String;
    lote_propietario:String;
    latitud: Number;
    longitud: Number;
    estado:Number;
    sincronizado:Number;//1 = sincronizado, 0 = no sincronizado.
}