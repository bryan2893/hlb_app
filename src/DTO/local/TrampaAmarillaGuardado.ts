export interface TrampaAmarillaGuardado{
    id_local:Number;
    id_trampa:Number;
    num_trampa: Number;
    tipo:String;
    pais:String;
    finca_poblado:String;
    lote_propietario:String;
    latitud: Number;
    longitud: Number;
    estado:Number;
    sincronizado:Number;//1 = sincronizado, 0 = no sincronizado.
}