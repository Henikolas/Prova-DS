//Controle de Vagas de estacionamento PP-1K3T07C-0H0M3L3//

export type StatusVaga = 'Livre' | 'Ocupada' | 'Reservada';

export interface Vaga {
  id: number;
  identificacao: string;
  setor: string;
  tipo: 'Comum' | 'PCD' | 'Idoso';
  status: StatusVaga;
  placa?: string;
}

export interface HistoricoItem {
  id: number;
  dataHora: string;
  descricao: string;
  tipo: 'sucesso' | 'erro' | 'alerta';
}
import React from 'react';

interface HeaderProps {
  codigoProva: string;
  nomeSistema: string;
}

export const Header: React.FC<HeaderProps> = ({ codigoProva, nomeSistema }) => {
  return (
    <header style={{ padding: '16px', backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', marginBottom: '20px' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{nomeSistema}</h1>
      <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
        Código de Verificação: <strong>{codigoProva}</strong> | Aluno: Heloisa Quintino da Silva (2 DS B)
      </p>
    </header>
  );
};