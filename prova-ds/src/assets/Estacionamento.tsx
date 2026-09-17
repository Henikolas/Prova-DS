//Controle de Vagas de estacionamento PP-1K3T07C-0H0M3L3//

export interface Vaga {
    identificacao: string;
    setor: string;
    tipo: string;
    status: 'livre' | 'ocupada' | 'marcada'
}
export interface Props {
    vaga: Vaga;
    onOcupar: (id: number) => void;
}