export interface CriaAnimalPerdidoDTO {
    nome?: string,
    descricao: string,
    tipoAnuncio:  "PERDI" | 'ENCONTREI',
    localizacao?: string | null,
    contato?: string,
    especieId: number,
    dataEncontrado: string | null,
    adotanteId: string,
    
}