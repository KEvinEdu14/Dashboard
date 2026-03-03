import { useEffect, useRef, useState, useMemo } from 'react';
import { Timeline, DataSet } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

function FilterSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (newValue) => {
    onChange(newValue);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="block mb-1 text-xs font-semibold text-slate-400">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex gap-2 justify-between items-center px-3 py-2 w-full text-sm text-white rounded-lg border bg-white/10 border-white/20 hover:border-white/40 focus:outline-none focus:border-white/60 active:border-white/60"
      >
        <span className="truncate">{selected.label}</span>
        <span className="ml-2 text-xs text-slate-300">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border shadow-xl backdrop-blur border-white/15 bg-slate-950/95">
          <ul className="overflow-y-auto py-1 max-h-60 text-sm">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left ${
                    opt.value === value
                      ? 'bg-cyan-500/20 text-cyan-100'
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && <span className="text-xs">✓</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function TimelineModal({ events, isOpen, onClose }) {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const countryMatch = filterCountry === 'all' || e.pais === filterCountry;
      const categoryMatch = filterCategory === 'all' || e.categoria === filterCategory;
      const searchMatch = searchQuery === '' || 
        e.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
      return countryMatch && categoryMatch && searchMatch;
    });
  }, [events, filterCountry, filterCategory, searchQuery]);

  const countries = useMemo(() => {
    return ['all', ...new Set(events.map(e => e.pais).filter(Boolean))];
  }, [events]);

  const categories = useMemo(() => {
    return ['all', ...new Set(filteredEvents.map(e => e.categoria).filter(Boolean))];
  }, [filteredEvents]);

  const formatDate = (iso) => {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '—';
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      timeZone: 'UTC',
    });
  };

  const getCountryItemStyle = (pais) => {
    if (pais === 'Ecuador') {
      return 'background-image: linear-gradient(to right,#facc15 0%,#facc15 20%,#1d4ed8 20%,#1d4ed8 60%,#b91c1c 60%,#b91c1c 100%); border-color: rgba(248,250,252,0.6); color: #020617;';
    }
    if (pais === 'Chile') {
      return 'background-image: linear-gradient(to right,#1d4ed8 0%,#1d4ed8 25%,#f9fafb 25%,#f9fafb 50%,#b91c1c 50%,#b91c1c 100%); border-color: rgba(248,250,252,0.6); color: #020617;';
    }
    if (pais === 'Canadá') {
      return 'background-image: linear-gradient(to right,#b91c1c 0%,#b91c1c 20%,#f9fafb 20%,#f9fafb 80%,#b91c1c 80%,#b91c1c 100%); border-color: rgba(248,250,252,0.6); color: #020617;';
    }
    return 'background-color: rgba(59,130,246,0.18); border-color: #3b82f6; color: #dbeafe;';
  };

  const itemsRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const items = new DataSet(
      filteredEvents.map(e => ({
        id: e.id,
        content: `<div class="px-2 py-1 text-xs font-semibold text-center">${e.titulo}</div>`,
        start: e.fecha || '1900-01-01',
        title: `${e.titulo}\n${e.pais || 'General'} · ${e.categoria}\n${e.fecha || '—'}`,
        className: 'timeline-item',
        style: getCountryItemStyle(e.pais)
      }))
    );

    itemsRef.current = items;

    const options = {
      stack: true,
      zoomMin: 1000 * 60 * 60 * 24 * 30,
      zoomMax: 1000 * 60 * 60 * 24 * 365 * 100,
      moveable: true,
      horizontalScroll: true,
      selectable: true,
      tooltip: { followMouse: true },
      timeAxis: { scale: 'year', step: 5 }
    };

    if (timelineRef.current) {
      timelineRef.current.destroy();
    }

    timelineRef.current = new Timeline(containerRef.current, items, options);
    
    timelineRef.current.on('click', (properties) => {
      if (properties.item) {
        const event = filteredEvents.find(e => e.id === properties.item);
        if (event) setSelectedEvent(event);
      }
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
        timelineRef.current = null;
      }
    };
  }, [filteredEvents, isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-[1000] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-slate-900">
          <div className="flex-1">
            <h2 className="mb-2 text-xl font-bold">Línea de tiempo interactiva</h2>
            <p className="text-xs text-slate-400">Mostrando {filteredEvents.length} de {events.length} eventos</p>
          </div>
          <button
            onClick={handleCloseClick}
            className="flex-shrink-0 p-1 ml-2 text-2xl transition cursor-pointer text-slate-400 hover:text-white active:text-white"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Filtros */}
        <div className="px-4 py-3 space-y-3 border-b bg-slate-800/50 border-white/10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <FilterSelect
              label="País"
              value={filterCountry}
              onChange={setFilterCountry}
              options={countries
                .filter((c) => c === 'all' || !!c)
                .map((c) => ({
                  value: c,
                  label: c === 'all' ? 'Todos los países' : c,
                }))}
            />

            <FilterSelect
              label="Categoría"
              value={filterCategory}
              onChange={setFilterCategory}
              options={categories
                .filter((c) => c === 'all' || !!c)
                .map((c) => ({
                  value: c,
                  label: c === 'all' ? 'Todas las categorías' : c,
                }))}
            />

            <div className="md:col-span-2">
              <label className="block mb-1 text-xs font-semibold text-slate-400">Buscar evento</label>
              <input
                type="text"
                placeholder="Escribe para filtrar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 w-full text-sm text-white rounded-lg border bg-white/10 border-white/20 placeholder-slate-500 hover:border-white/40 focus:outline-none focus:border-white/60 active:border-white/60"
              />
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex gap-4 text-xs">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>🇪🇨 Ecuador</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>🇨🇦 Canadá</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span>🇨🇱 Chile</span>
            </div>
          </div>
        </div>
        
        {/* Timeline y Panel */}
        <div className="flex overflow-hidden flex-col flex-1 gap-4 p-4 lg:flex-row">
          <div ref={containerRef} className="overflow-hidden flex-1 rounded-xl border border-white/10 bg-white/5 min-h-96"></div>
          
          {selectedEvent && (
            <div className="flex overflow-y-auto flex-col gap-3 pr-2 lg:w-96">
              <div className="sticky top-0 p-4 space-y-3 rounded-xl border bg-white/5 border-white/10">
                <div>
                  <h3 className="mb-2 text-base font-semibold">{selectedEvent.titulo}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedEvent.pais && (
                      <span
                        className={
                          `px-3 py-1 rounded-full border text-xs font-semibold ${
                            selectedEvent.pais === 'Canadá'
                              ? 'bg-green-500/20 border-green-500/40 text-green-300'
                              : selectedEvent.pais === 'Chile'
                              ? 'bg-red-500/20 border-red-500/40 text-red-300'
                              : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                          }`
                        }
                      >
                        {selectedEvent.pais === 'Canadá'
                          ? '🇨🇦'
                          : selectedEvent.pais === 'Chile'
                          ? '🇨🇱'
                          : '🇪🇨'}{' '}
                        {selectedEvent.pais}
                      </span>
                    )}
                    <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-white/10 border-white/20">
                      {selectedEvent.categoria}
                    </span>
                  </div>
                  <p className="mb-3 font-mono text-xs text-slate-300">
                    📅 {formatDate(selectedEvent.fecha)}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {selectedEvent.descripcion}
                  </p>
                </div>

                {selectedEvent.imagen && (
                  <div className="overflow-hidden rounded-lg border border-white/10">
                    <img src={selectedEvent.imagen} alt={selectedEvent.titulo} className="w-full h-auto" />
                  </div>
                )}

                {(selectedEvent.fuentes || []).length > 0 && (
                  <div className="pt-3 space-y-2 border-t border-white/10">
                    <h4 className="text-xs font-semibold uppercase text-slate-400">📚 Fuentes</h4>
                    <ul className="space-y-2">
                      {selectedEvent.fuentes.map((f, i) => (
                        <li key={i} className="text-xs">
                          {f.url ? (
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-300 break-words hover:text-cyan-200 hover:underline"
                            >
                              📄 {f.label} ↗
                            </a>
                          ) : (
                            <span className="text-slate-400">
                              📄 {f.label} {f.note && <span className="text-slate-600">({f.note})</span>}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {filteredEvents.length === 0 && (
          <div className="flex flex-1 justify-center items-center text-slate-400">
            <p>No hay eventos que coincidan con los filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}
