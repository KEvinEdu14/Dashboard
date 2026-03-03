import { useState } from 'react';

const tabs = [
  { id: 'conceptos', label: 'Marco conceptual' },
  { id: 'metodologia', label: 'Metodología' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'legal', label: 'Marco legal' },
  { id: 'conclusiones', label: 'Conclusiones' },
];

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10"
      >
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 py-3 text-sm text-slate-300 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function ReportInteractive() {
  const [active, setActive] = useState('conceptos');

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">🧭 Mapa de análisis</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
          Contenido interactivo
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-3 py-1.5 rounded-full border text-xs transition ${
              active === tab.id ? 'bg-white/15 border-white/30' : 'border-white/10 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === 'conceptos' && (
        <div className="space-y-3">
          <AccordionItem title="Digitalización">
            <p>Transformación de procesos y servicios usando tecnologías digitales para mejorar eficiencia, calidad y acceso.</p>
            <p>En gobierno implica rediseño de procesos y servicios centrados en el ciudadano.</p>
          </AccordionItem>
          <AccordionItem title="Gobierno digital">
            <ul className="list-disc pl-5 space-y-1">
              <li>Servicios en línea</li>
              <li>Infraestructura de telecomunicaciones</li>
              <li>Capital humano y alfabetización digital</li>
            </ul>
          </AccordionItem>
          <AccordionItem title="Firma electrónica">
            <p>Elemento habilitante para trámites digitales con validez jurídica.</p>
            <p>Reconocida en Ecuador desde 2002; en Canadá respaldada por PIPEDA.</p>
          </AccordionItem>
          <AccordionItem title="Indicadores de digitalización">
            <ul className="list-disc pl-5 space-y-1">
              <li>EGDI (ONU)</li>
              <li>Acceso y uso de internet</li>
              <li>Número de trámites digitales</li>
              <li>Marco legal habilitante</li>
            </ul>
          </AccordionItem>
        </div>
      )}

      {active === 'metodologia' && (
        <div className="space-y-3">
          <AccordionItem title="Diseño del estudio">
            <p>Enfoque cualitativo–cuantitativo basado en Revisión Sistemática de Literatura (SLR).</p>
          </AccordionItem>
          <AccordionItem title="Protocolo PRISMA">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Identificación de fuentes oficiales</li>
              <li>Cribado de duplicados y fuentes no oficiales</li>
              <li>Evaluación de elegibilidad</li>
              <li>Inclusión final de evidencia relevante</li>
            </ol>
          </AccordionItem>
          <AccordionItem title="Fuentes principales">
            <ul className="list-disc pl-5 space-y-1">
              <li>ONU (EGDI)</li>
              <li>INEC (TIC)</li>
              <li>gob.ec (trámites)</li>
              <li>CRTC y Justice Laws (Canadá)</li>
            </ul>
          </AccordionItem>
        </div>
      )}

      {active === 'resultados' && (
        <div className="space-y-3">
          <AccordionItem title="Ecuador">
            <ul className="list-disc pl-5 space-y-1">
              <li>EGDI 2024: 0,7800 (puesto 67)</li>
              <li>Internet: 71,3% hogares; 80,1% personas (INEC)</li>
              <li>~1600 trámites digitales en gob.ec</li>
              <li>Firma electrónica: adopción en crecimiento</li>
            </ul>
          </AccordionItem>
          <AccordionItem title="Canadá">
            <ul className="list-disc pl-5 space-y-1">
              <li>EGDI 2024: 0,8452 (puesto 47)</li>
              <li>Internet: 96,1% hogares (CRTC)</li>
              <li>Servicios digitales integrados y alta interoperabilidad</li>
              <li>Firma electrónica ampliamente adoptada</li>
            </ul>
          </AccordionItem>
          <AccordionItem title="Comparación rápida">
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="font-semibold mb-2">Ecuador</div>
                <ul className="space-y-1">
                  <li>EGDI: 0,7800 (alto)</li>
                  <li>Brecha digital rural</li>
                  <li>Interoperabilidad parcial</li>
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="font-semibold mb-2">Canadá</div>
                <ul className="space-y-1">
                  <li>EGDI: 0,8452 (muy alto)</li>
                  <li>Conectividad casi universal</li>
                  <li>Interoperabilidad alta</li>
                </ul>
              </div>
            </div>
          </AccordionItem>
        </div>
      )}

      {active === 'legal' && (
        <div className="space-y-3">
          <AccordionItem title="Ecuador">
            <ul className="list-disc pl-5 space-y-1">
              <li>Ley de Comercio Electrónico (2002)</li>
              <li>Reglamento a la Ley (2002)</li>
              <li>LOPDP (2021)</li>
              <li>LOTDA (2023)</li>
              <li>Normativa de interoperabilidad</li>
            </ul>
          </AccordionItem>
          <AccordionItem title="Canadá">
            <ul className="list-disc pl-5 space-y-1">
              <li>PIPEDA</li>
              <li>Políticas de gobierno digital</li>
              <li>Estándares de servicios digitales</li>
            </ul>
          </AccordionItem>
          <AccordionItem title="Brechas clave">
            <ul className="list-disc pl-5 space-y-1">
              <li>Implementación normativa desigual</li>
              <li>Interoperabilidad limitada en Ecuador</li>
              <li>Mayor madurez operativa en Canadá</li>
            </ul>
          </AccordionItem>
        </div>
      )}

      {active === 'conclusiones' && (
        <div className="space-y-3">
          <AccordionItem title="Conclusiones">
            <ul className="list-disc pl-5 space-y-1">
              <li>Ecuador: nivel alto, aún en consolidación.</li>
              <li>Canadá: muy alto, servicios digitales maduros.</li>
              <li>La brecha es técnica y operativa, no solo legal.</li>
            </ul>
          </AccordionItem>
          <AccordionItem title="Recomendaciones">
            <ul className="list-disc pl-5 space-y-1">
              <li>Fortalecer interoperabilidad institucional.</li>
              <li>Invertir en infraestructura digital rural.</li>
              <li>Capacitación y alfabetización digital.</li>
              <li>Acompañamiento técnico en protección de datos.</li>
            </ul>
          </AccordionItem>
        </div>
      )}
    </div>
  );
}
