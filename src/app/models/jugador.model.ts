export interface Jugador {
    id?: string
    nombre: string
    dorsal: number
    enCampo: boolean
    posicion: string
    valoracion?: number,
    minutosJugados: number
    foto?: string;
    titular?: boolean
}