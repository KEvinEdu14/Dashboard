import { useState } from 'react';

export function InternetUsageTable() {
  const [sortBy, setSortBy] = useState('jul-25');

  const data = [
    {
      indicador: 'Comunicaciones y Redes sociales',
      emoji: '💬',
      'jul-22': 73.3,
      'jul-23': 79.2,
      'jul-24': 79.9,
      'jul-25': 76.8,
    },
    {
      indicador: 'Educación y aprendizaje',
      emoji: '📚',
      'jul-22': 12.3,
      'jul-23': 7.7,
      'jul-24': 5.3,
      'jul-25': 6.9,
    },
    {
      indicador: 'Actividades de entretenimiento',
      emoji: '🎮',
      'jul-22': 9.2,
      'jul-23': 9.6,
      'jul-24': 11.8,
      'jul-25': 13.0,
    },
    {
      indicador: 'Por razones de trabajo',
      emoji: '💼',
      'jul-22': 2.9,
      'jul-23': 1.8,
      'jul-24': 1.7,
      'jul-25': 1.9,
    },
    {
      indicador: 'Obtener información',
      emoji: '📰',
      'jul-22': 1.6,
      'jul-23': 1.0,
      'jul-24': 0.9,
      'jul-25': 1.1,
    },
    {
      indicador: 'Otros',
      emoji: '🔧',
      'jul-22': 0.8,
      'jul-23': 0.7,
      'jul-24': 0.4,
      'jul-25': 0.3,
    },
  ];

  const periods = ['jul-22', 'jul-23', 'jul-24', 'jul-25'];

  const getColor = (value) => {
    if (value >= 50) return 'bg-green-500/20 text-green-300';
    if (value >= 20) return 'bg-blue-500/20 text-blue-300';
    if (value >= 10) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-slate-500/20 text-slate-300';
  };

  const getTrendIcon = (old, current) => {
    if (current > old) return '📈';
    if (current < old) return '📉';
    return '→';
  };

  const getTrendColor = (old, current) => {
    if (current > old) return 'text-green-400';
    if (current < old) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="font-bold text-lg">📊 Razones de uso de Internet en Ecuador</h3>
        <p className="text-sm text-slate-400">
          Distribución porcentual — INEC ENEMDU (julio 2022 - julio 2025)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 font-semibold text-slate-300">Indicador</th>
              {periods.map((period) => (
                <th
                  key={period}
                  onClick={() => setSortBy(period)}
                  className={`text-center py-3 px-4 font-semibold cursor-pointer transition ${
                    sortBy === period ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-mono mb-1">{period}</div>
                  <div className="text-xs text-slate-500">Participación %</div>
                </th>
              ))}
              <th className="text-center py-3 px-4 font-semibold text-slate-300">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                <td className="py-4 px-4 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{row.emoji}</span>
                    <span>{row.indicador}</span>
                  </div>
                </td>
                {periods.map((period) => (
                  <td
                    key={period}
                    className={`text-center py-4 px-4 font-semibold rounded-lg ${getColor(
                      row[period]
                    )} ${sortBy === period ? 'ring-1 ring-white/20' : ''}`}
                  >
                    {row[period]}%
                  </td>
                ))}
                <td className="text-center py-4 px-4">
                  <span
                    className={`text-lg ${getTrendColor(
                      row['jul-22'],
                      row['jul-25']
                    )}`}
                  >
                    {getTrendIcon(row['jul-22'], row['jul-25'])}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">
                    {row['jul-25'] > row['jul-22'] ? '+' : ''}
                    {(row['jul-25'] - row['jul-22']).toFixed(1)}pp
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 pt-4 border-t border-white/10">
        <div>
          <p className="font-semibold mb-2">Nota:</p>
          <p>Población de referencia: 5 años y más que utilizaron internet</p>
        </div>
        <div>
          <p className="font-semibold mb-2">Fuente:</p>
          <p>
            <a
              href="https://www.ecuadorencifras.gob.ec/tecnologias-de-la-informacion-y-comunicacion-tic/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              INEC ENEMDU - Julio 2025
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
