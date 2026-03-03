import { useState, useEffect } from 'react';

export function useEvents() {
  const [eventsByTab, setEventsByTab] = useState({ timeline: [], reference: [] });
  const [activeTab, setActiveTab] = useState('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [onlyWithSources, setOnlyWithSources] = useState(true);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then(r => r.json())
      .then(json => {
        setEventsByTab({
          timeline: json.timeline_events || [],
          reference: json.reference_events || []
        });
        setMetadata(json);
      })
      .catch(err => console.error('Error loading data:', err));
  }, []);

  const activeEvents = eventsByTab[activeTab] || [];
  const categories = [...new Set(activeEvents.map(e => e.categoria))].sort();
  const countries = [...new Set(activeEvents.map(e => e.pais || 'General'))].sort();

  const filtered = activeEvents
    .filter(e => {
      if (onlyWithSources && (!e.fuentes || e.fuentes.length === 0)) return false;
      if (selectedCategory !== 'all' && e.categoria !== selectedCategory) return false;
      if (selectedCountry !== 'all' && (e.pais || 'General') !== selectedCountry) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const hay = [e.titulo, e.descripcion, e.categoria, e.fecha, e.pais || '', ...(e.fuentes || []).map(f => `${f.label} ${f.url}`)].join(' ').toLowerCase();
        return hay.includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const cmp = (a.fecha || '').localeCompare(b.fecha || '');
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  return {
    eventsByTab,
    activeTab,
    setActiveTab,
    activeEvents,
    filtered,
    categories,
    countries,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCountry,
    setSelectedCountry,
    sortOrder,
    setSortOrder,
    onlyWithSources,
    setOnlyWithSources,
    metadata
  };
}
