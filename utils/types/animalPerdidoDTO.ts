export interface CriaAnimalPerdidoDTO {
    nome?: string,
    descricao: string,
    tipoAnuncio:  "PERDI" | 'ENCONTREI',
    localizacao?: string,
    contato?: string,
    especieId: number,
    dataEncontrado: Date | null,
    adotanteId: string,
    
}