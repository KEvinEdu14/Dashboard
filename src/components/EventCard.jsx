export function EventCard({ event, compact = false }) {
  const dateLabel = event.fecha ? `${formatDate(event.fecha)} (${event.fecha})` : '—';
  const srcCount = (event.fuentes || []).length;
  const description = compact && event.descripcion
    ? `${event.descripcion.slice(0, 140)}${event.descripcion.length > 140 ? '…' : ''}`
    : event.descripcion;

  const handleCopyDate = async () => {
    await navigator.clipboard.writeText(event.fecha || '');
    alert('Fecha copiada');
  };

  const handleCopyAPA = async () => {
    const bib = buildAPA(event);
    await navigator.clipboard.writeText(bib);
    alert('APA copiada');
  };

  return (
    <article className={`bg-white/5 border shadow-sm hover:bg-white/10 active:bg-white/10 transition rounded-xl ${compact ? 'p-3' : 'p-4'} ${event.pais === 'Canadá' ? 'border-green-500/30' : 'border-white/10'}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {event.pais && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${event.pais === 'Canadá' ? 'bg-green-500/20 border-green-500/30' : 'bg-blue-500/20 border-blue-500/30'}`}>
            {event.pais}
          </span>
        )}
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 border border-white/10">
          {event.categoria}
        </span>
        <span className="text-xs font-mono px-2 py-1 rounded-full bg-white/10 border border-white/10">
          {dateLabel}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
          {srcCount} fuente{srcCount !== 1 ? 's' : ''}
        </span>
      </div>

      <h4 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} mb-1`}>{event.titulo}</h4>
      <p className={`text-slate-300 ${compact ? 'text-xs' : 'text-sm'} mb-3`}>{description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {(event.fuentes || []).map((f, i) => (
          f.url ? (
            <a
              key={i}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-300 hover:text-cyan-200 hover:underline"
            >
              • {f.label} ↗
            </a>
          ) : (
            <span key={i} className="text-xs text-slate-400">
              • {f.label} <span className="text-slate-600">({f.note})</span>
            </span>
          )
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={handleCopyDate} className="text-xs bg-white/10 hover:bg-white/20 active:bg-white/20 px-2.5 py-1 rounded-md border border-white/10 transition">
          Copiar fecha ISO
        </button>
        <button onClick={handleCopyAPA} className="text-xs bg-white/10 hover:bg-white/20 active:bg-white/20 px-2.5 py-1 rounded-md border border-white/10 transition">
          Copiar APA (evento)
        </button>
      </div>
    </article>
  );
}

function formatDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: '2-digit', timeZone: 'UTC' });
}

function buildAPA(event) {
  const fuentes = Array.isArray(event.fuentes) ? event.fuentes : [];
  if (!fuentes.length) {
    return `${event.titulo}. (${event.fecha || 's. f.'}).`;
  }
  return fuentes
    .map(f => {
      if (!f.url) {
        return `${event.titulo}. (${(event.fecha || '').slice(0, 4) || 's. f.'}). ${f.label}. (Fuente local: documento del usuario).`;
      }
      const org = guessOrg(f.url, f.label);
      const year = (event.fecha || '').slice(0, 4) || 's. f.';
      return `${org}. (${year}). ${f.label}. ${f.url}`;
    })
    .join('\n');
}

function guessOrg(url, label) {
  const host = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  if (host.includes('asambleanacional')) return 'Asamblea Nacional del Ecuador';
  if (host.includes('telecomunicaciones')) return 'Ministerio de Telecomunicaciones';
  if (host.includes('ecuadorencifras')) return 'Instituto Nacional de Estadística y Censos (INEC)';
  if (host.includes('gob.ec')) return 'Gobierno del Ecuador';
  if (host.includes('un.org')) return 'United Nations';
  return label || host;
}
