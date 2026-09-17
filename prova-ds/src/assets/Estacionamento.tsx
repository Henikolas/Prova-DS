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
import React, { useState } from 'react';

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
interface FormOcupacaoProps {
  vagasLivres: { id: number; identificacao: string }[];
  onOcupar: (vagaId: number, placa: string) => void;
}

export const FormOcupacao: React.FC<FormOcupacaoProps> = ({ vagasLivres, onOcupar }) => {
  const [vagaSelecionada, setVagaSelecionada] = useState<number>(vagasLivres[0]?.id || 0);
  const [placa, setPlaca] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vagaSelecionada || !placa.trim()) return;
    onOcupar(Number(vagaSelecionada), placa.toUpperCase());
    setPlaca('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Registrar Entrada de Veículo</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
        <select value={vagaSelecionada} onChange={(e) => setVagaSelecionada(Number(e.target.value))}>
          <option value={0}>Selecione uma vaga...</option>
          {vagasLivres.map(v => (
            <option key={v.id} value={v.id}>{v.identificacao}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Placa (ex: ABC-1234)" 
          value={placa} 
          onChange={(e) => setPlaca(e.target.value)} 
          required 
        />
        <button type="submit">Ocupar Vaga</button>
      </div>
    </form>
  );
};

const dadosIniciais: Vaga[] = [
  { id: 1, identificacao: 'A-01', setor: 'A', tipo: 'Comum', status: 'Livre' },
  { id: 2, identificacao: 'A-02', setor: 'A', tipo: 'Comum', status: 'Ocupada', placa: 'ABC-1234' },
  { id: 3, identificacao: 'A-03', setor: 'A', tipo: 'PCD', status: 'Livre' },
  { id: 4, identificacao: 'B-01', setor: 'B', tipo: 'Idoso', status: 'Livre' },
  { id: 5, identificacao: 'B-02', setor: 'B', tipo: 'Comum', status: 'Ocupada', placa: 'XYZ-9876' },
];

export default function App() {
  const [vagas, setVagas] = useState<Vaga[]>(dadosIniciais);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');

  const LIMITE_ALERTA_PARAME_9 = 9; // Parâmetro individual de limite/alerta (9 vagas)

  const vagasLivresCount = vagas.filter(v => v.status === 'Livre').length;
  const vagasOcupadasCount = vagas.filter(v => v.status === 'Ocupada').length;

  const adicionarHistorico = (descricao: string, tipo: 'sucesso' | 'erro' | 'alerta') => {
    const novoItem: HistoricoItem = {
      id: Date.now(),
      dataHora: new Date().toLocaleTimeString(),
      descricao,
      tipo
    };
    setHistorico(prev => [novoItem, ...prev]);
  };

  // REGRA CRÍTICA INDIVIDUAL: Não ocupar vaga já usada
  const handleOcupar = (vagaId: number, placa: string) => {
    const vagaAlvo = vagas.find(v => v.id === vagaId);

    if (!vagaAlvo || vagaAlvo.status !== 'Livre') {
      adicionarHistorico(`FALHA: Tentativa de ocupar vaga ${vagaAlvo?.identificacao || vagaId} que já está em uso!`, 'erro');
      alert('ERRO CRÍTICO: Não é possível ocupar uma vaga que já está em uso!');
      return;
    }

    setVagas(vagas.map(v => v.id === vagaId ? { ...v, status: 'Ocupada', placa } : v));
    adicionarHistorico(`Sucesso: Vaga ${vagaAlvo.identificacao} ocupada pelo veículo ${placa}.`, 'sucesso');
  };

  const handleLiberar = (vagaId: number) => {
    const vagaAlvo = vagas.find(v => v.id === vagaId);
    setVagas(vagas.map(v => v.id === vagaId ? { ...v, status: 'Livre', placa: undefined } : v));
    adicionarHistorico(`Saída: Vaga ${vagaAlvo?.identificacao || vagaId} liberada.`, 'sucesso');
  };

  const vagasFiltradas = vagas.filter(v => filtroStatus === 'TODOS' ? true : v.status === filtroStatus);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Header codigoProva="PP-1K3T07C-0H0M3L3" nomeSistema="Controle de Vagas de Estacionamento" />

      {/* Alerta Visual para o Parâmetro 9 */}
      {vagasOcupadasCount >= LIMITE_ALERTA_PARAME_9 && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontWeight: 'bold' }}>
          ⚠️ ALERTA DE CAPACIDADE: O limite de {LIMITE_ALERTA_PARAME_9} vagas ocupadas foi atingido!
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <p><strong>Vagas Libres:</strong> {vagasLivresCount}</p>
        <p><strong>Vagas Ocupadas:</strong> {vagasOcupadasCount}</p>
      </div>

      <FormOcupacao 
        vagasLivres={vagas.filter(v => v.status === 'Livre').map(v => ({ id: v.id, identificacao: v.identificacao }))} 
        onOcupar={handleOcupar} 
      />

      <div style={{ marginBottom: '15px' }}>
        <label>Filtrar por Status: </label>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
          <option value="TODOS">Todos</option>
          <option value="Livre">Livre</option>
          <option value="Ocupada">Ocupada</option>
          <option value="Reservada">Reservada</option>
        </select>
      </div>

      {/* Restrição Técnica: Mensagem de lista vazia ao filtrar */}
      {vagasFiltradas.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#f1f5f9', textAlign: 'center', borderRadius: '6px', color: '#64748b' }}>
          Nenhum registro encontrado para o filtro selecionado.
        </div>
      ) : (
        <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vaga</th>
              <th>Setor</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Placa</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {vagasFiltradas.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.identificacao}</td>
                <td>{v.setor}</td>
                <td>{v.tipo}</td>
                <td>{v.status}</td>
                <td>{v.placa || '-'}</td>
                <td>
                  {v.status === 'Ocupada' && (
                    <button onClick={() => handleLiberar(v.id)}>Registrar Saída</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        <h3>Histórico e Logs de Operações</h3>
        <ul>
          {historico.map(h => (
            <li key={h.id} style={{ color: h.tipo === 'erro' ? 'red' : 'green', marginBottom: '4px' }}>
              [{h.dataHora}] {h.descricao}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}