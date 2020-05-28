export default interface Mantenimiento_Hlb_Guardado{
    id_local:Number;
    id_original:Number;
    pais: String;
    tipo:String;
    finca_poblado:String;
    lote_propietario:String;
    latitud: Number;
    longitud: Number;
    estado:Number;
    sincronizado:Number;//1 = sincronizado, 0 = no sincronizado.
}