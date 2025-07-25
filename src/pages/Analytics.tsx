import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  incidents: Incident[];
}

interface Incident {
  id: string;
  type: string;
  date: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

const Analytics: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'count' | 'value'>('count');

  useEffect(() => {
    // Mock data for demonstration
    const mockPlayers: Player[] = [
      {
        id: '1',
        name: 'João Silva',
        position: 'Atacante',
        team: 'Time A',
        incidents: [
          { id: '1', type: 'Atraso', date: '2024-07-20', description: 'Chegou 15 minutos atrasado', severity: 'low' },
          { id: '2', type: 'Cartão Amarelo', date: '2024-07-18', description: 'Falta tática', severity: 'medium' },
        ],
      },
      {
        id: '2',
        name: 'Pedro Souza',
        position: 'Zagueiro',
        team: 'Time B',
        incidents: [
          { id: '3', type: 'Expulsão', date: '2024-07-15', description: 'Conduta antidesportiva', severity: 'high' },
        ],
      },
      {
        id: '3',
        name: 'Lucas Pereira',
        position: 'Meio-campo',
        team: 'Time A',
        incidents: [
          { id: '4', type: 'Atraso', date: '2024-07-19', description: 'Chegou 5 minutos atrasado', severity: 'low' },
          { id: '5', type: 'Multa', date: '2024-07-17', description: 'Não compareceu a evento', severity: 'medium' },
        ],
      },
    ];
    setPlayers(mockPlayers);
  }, []);

  const incidentTypes = players.flatMap(player => player.incidents.map(inc => inc.type));
  const uniqueIncidentTypes = Array.from(new Set(incidentTypes));

  const incidentData = uniqueIncidentTypes.map(type => {
    const count = incidentTypes.filter(t => t === type).length;
    const value = players.reduce((sum, player) => {
      return sum + player.incidents.filter(inc => inc.type === type).length;
    }, 0);
    return { name: type, count, value };
  });

  const severityData = ['low', 'medium', 'high'].map(severity => {
    const count = players.flatMap(player => player.incidents).filter(inc => inc.severity === severity).length;
    const value = count; // For severity, count and value can be the same for simplicity
    return { name: severity, count, value };
  });

  const playerIncidentData = players.map(player => ({
    name: player.name,
    incidentCount: player.incidents.length,
  }));

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Análise Disciplinar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card de Incidentes Totais */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Incidentes Totais</h2>
          <p className="text-4xl font-bold text-red-600">{incidentTypes.length}</p>
        </div>

        {/* Card de Jogadores com Incidentes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Jogadores com Incidentes</h2>
          <p className="text-4xl font-bold text-red-600">{players.filter(p => p.incidents.length > 0).length}</p>
        </div>

        {/* Card de Gravidade Média */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Gravidade Média</h2>
          <p className="text-4xl font-bold text-red-600">{(players.flatMap(p => p.incidents).reduce((sum, inc) => {
            if (inc.severity === 'low') return sum + 1;
            if (inc.severity === 'medium') return sum + 2;
            if (inc.severity === 'high') return sum + 3;
            return sum;
          }, 0) / incidentTypes.length || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Incidentes por Tipo</h2>
        <div className="flex justify-end mb-4">
          <div className="flex bg-gray-200 rounded p-1">
            <button
              onClick={() => setSelectedMetric("count")}
              className={`px-3 py-1 rounded text-sm ${selectedMetric === "count" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >Contagem</button>
            <button
              onClick={() => setSelectedMetric("value")}
              className={`px-3 py-1 rounded text-sm ${selectedMetric === "value" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >Valor</button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incidentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={selectedMetric}
              >
                {incidentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Incidentes por Gravidade</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={severityData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedMetric} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Incidentes por Jogador</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={playerIncidentData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="incidentCount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

