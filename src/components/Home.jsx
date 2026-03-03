import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const timelineData = {
  '2002': [
    {
      date: '18 de junio',
      title: 'La Primera Transacción Digital',
      description:
        'Se registra la primera transacción electrónica oficial en la historia del Ecuador por un monto de USD 50. Este evento marcó el inicio técnico de la era digital bancaria.',
      category: 'tech',
    },
    {
      date: 'Abril',
      title: 'Ley de Comercio Electrónico',
      description:
        "Se aprueba la Ley de Comercio Electrónico, estableciendo el marco jurídico con el principio de 'equivalencia funcional', otorgando a la firma electrónica el mismo valor legal que la firma manuscrita.",
      category: 'legal',
    },
  ],
  '2008-2009': [
    {
      date: '2008-2009',
      title: 'Operatividad de la Firma Electrónica',
      description:
        'El Banco Central del Ecuador se acredita como la primera entidad de certificación oficial, permitiendo que la Ley de 2002 cobrara vida real.',
      details: [
        'Agosto 2009: Creación del MINTEL',
        'Mayo 2009: El SRI inicia la emisión de comprobantes electrónicos',
      ],
      category: 'legal',
    },
  ],
  '2014': [
    {
      date: '2014',
      title: 'Nace Payphone',
      description:
        'Una de las primeras fintechs ecuatorianas en operar, pionera en pagos digitales antes del boom de las apps bancarias.',
      category: 'fintech',
    },
  ],
  '2016': [
    {
      date: '2016',
      title: 'Código Ingenios',
      description:
        'Se expide el Código Orgánico de la Economía Social de los Conocimientos. Priorizó el uso de tecnologías libres en el Estado y declaró el acceso a internet como un servicio básico.',
      category: 'legal',
    },
  ],
  '2017': [
    {
      date: '2017',
      title: 'Fundación de Kushki',
      description:
        'Nace la empresa que se convertiría en una de las infraestructuras de pagos más importantes de la región.',
      category: 'fintech',
    },
  ],
  '2019': [
    {
      date: '2019',
      title: 'Desarrollo de App Nativa - Banco Pichincha',
      description:
        'El banco inicia el desarrollo de su aplicativo móvil propio. En ese momento, contaban con aproximadamente 700.000 clientes digitales.',
      category: 'tech',
    },
  ],
  '2020': [
    {
      date: '2 de marzo',
      title: 'Lanzamiento Banca Móvil Pichincha',
      description:
        'Apenas dos semanas antes del confinamiento, Banco Pichincha lanza su nueva aplicación móvil. El lanzamiento fue estratégico y oportuno.',
      category: 'tech',
    },
    {
      date: '16 de marzo',
      title: "El 'Big Bang' Digital - Pandemia",
      description:
        'Con el cierre de agencias y corresponsales, la pandemia actuó como un acelerador forzoso. Entre mayo y septiembre, las transferencias electrónicas crecieron un 35%.',
      category: 'tech',
    },
    {
      date: '2020',
      title: "Lanzamiento de 'DeUna'",
      description:
        "Banco Pichincha lanza la billetera digital 'DeUna' para facilitar pagos sin contacto y sin comisiones. En su primer año, alcanzó 100.000 descargas.",
      category: 'fintech',
    },
    {
      date: '2020',
      title: 'Expansión Banco del Pacífico',
      description:
        "El banco potencia 'Onboard BdP', permitiendo la apertura de cuentas 100% en línea. Se abren 181.000 cuentas de ahorro, logrando un crecimiento del 103% en transacciones.",
      category: 'tech',
    },
  ],
  '2021': [
    {
      date: 'Mayo',
      title: 'Ley de Protección de Datos Personales',
      description:
        "Tras filtraciones masivas de datos (caso Novaestrat), se aprueba esta ley que introduce derechos como el 'derecho al olvido' y la 'portabilidad de datos'.",
      category: 'legal',
    },
    {
      date: 'Julio',
      title: 'Hito Histórico: Digital supera a Físico',
      description:
        'Por primera vez, las transferencias digitales (285 millones) superan a las transacciones físicas en ventanilla (258 millones). El monto transaccionado alcanza USD 135.849 millones, superando en 1,2 veces el PIB del Ecuador.',
      category: 'tech',
    },
    {
      date: '2021',
      title: "Consolidación de 'DeUna'",
      description:
        "La aplicación crece de forma acelerada, alcanzando 680.000 descargas y afiliando a 56.000 negocios a nivel nacional. Se transaccionan USD 35 millones.",
      category: 'fintech',
    },
    {
      date: '2021',
      title: 'Microcrédito Digital',
      description:
        'Banco Pichincha implementa el primer microcrédito 100% digital del Ecuador, colocando USD 2,1 millones en su primer año.',
      category: 'fintech',
    },
  ],
  '2022': [
    {
      date: 'Febrero',
      title: 'Ley de Defensa al Cliente Financiero',
      description:
        'Se aprueba la ley que obliga a las entidades financieras a disponer de canales electrónicos y físicos eficientes para reclamos.',
      category: 'legal',
    },
    {
      date: 'Junio',
      title: 'Primer Unicornio Ecuatoriano',
      description:
        'Kushki alcanza una valoración de USD 1.500 millones, marcando un hito en la historia financiera del país.',
      category: 'fintech',
    },
    {
      date: 'Junio',
      title: "Relaunch 'be Produbanco'",
      description: 'Produbanco relanza su app enfocada en experiencias digitales.',
      category: 'tech',
    },
    {
      date: 'Noviembre',
      title: 'Facturación Electrónica Obligatoria',
      description:
        'La obligatoriedad impuesta por el SRI impulsa la emisión masiva de firmas electrónicas, que pasan de 1,4 millones a más de 2 millones al cierre de 2024.',
      category: 'legal',
    },
    {
      date: 'Diciembre',
      title: 'Ley Fintech',
      description:
        'Se publica la Ley para el Desarrollo y Control de los Servicios Financieros Tecnológicos, regulando por primera vez a las empresas tecnológicas financieras.',
      category: 'legal',
    },
    {
      date: '2022',
      title: 'DeUna supera el millón de descargas',
      description:
        'La aplicación supera el 1 millón de descargas y logra incluir en el sistema financiero digital a 180.000 microempresarios.',
      category: 'fintech',
    },
    {
      date: '2022',
      title: 'Integración en Banco del Pacífico',
      description:
        "El banco migra las funcionalidades de 'Onboard BdP' hacia su Banca Móvil principal para unificar la experiencia del usuario, cerrando el año con 172 millones de transacciones móviles.",
      category: 'tech',
    },
  ],
  '2023': [
    {
      date: 'Febrero',
      title: 'Ley de Transformación Digital y Audiovisual',
      description:
        'Normativa que ofrece incentivos tributarios para inversiones en el sector audiovisual y tecnológico. Facilita la constitución de empresas 100% digitales.',
      category: 'legal',
    },
    {
      date: '2023',
      title: 'PeiGo - Tarjeta Visa Virtual',
      description:
        'Banco Guayaquil lanza su tarjeta Visa Virtual, atacando el mercado de personas no bancarizadas.',
      category: 'fintech',
    },
    {
      date: '2023',
      title: 'DeUna: Líder en micro-pagos',
      description:
        'DeUna supera el millón de usuarios activos y se consolida como líder en micro-pagos.',
      category: 'fintech',
    },
  ],
  '2024': [
    {
      date: 'Septiembre',
      title: 'Norma de Medios y Sistemas de Pago',
      description:
        'Se emite la norma que regula los medios y sistemas de pago, aterrizando la Ley Fintech en reglas operativas.',
      category: 'legal',
    },
  ],
  '2025': [
    {
      date: 'Enero',
      title: 'Alianza CNT y Google Cloud',
      description:
        'CNT y Google Cloud establecen una alianza para impulsar la transformación digital en el Ecuador.',
      category: 'tech',
    },
    {
      date: '8 de abril',
      title: 'Agenda de Transformación Digital 2025-2030',
      description:
        'El MINTEL publica la Agenda orientada a reducir la brecha digital, fortalecer el sector público y promover una cultura digital.',
      category: 'legal',
    },
  ],
  '2026': [
    {
      date: '2026',
      title: 'Integración de IA y Ciberseguridad',
      description:
        'Se proyecta la integración amplia de ecosistemas de inteligencia artificial en la banca y la ciberseguridad nacional. El 100% de los contribuyentes activos poseen firma electrónica.',
      category: 'tech',
    },
  ],
};

const orderedYears = [
  '2002',
  '2008-2009',
  '2014',
  '2016',
  '2017',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
];

const getCategoryName = (category) => {
  if (category === 'legal') return 'Legal';
  if (category === 'tech') return 'Tecnología';
  if (category === 'fintech') return 'Fintech';
  return category;
};

function DigitalGrowthChart() {
  const series = useMemo(
    () => [
      {
        name: 'Transacciones digitales',
        data: [0.05, 2, 15, 35, 120, 210, 285, 380, 450, 520, 600, 680],
      },
      {
        name: 'Transacciones físicas',
        data: [500, 480, 450, 420, 380, 320, 258, 200, 150, 100, 60, 30],
      },
    ],
    [],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        foreColor: '#94a3b8',
      },
      colors: ['#a855f7', '#06b6d4'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.7,
          opacityFrom: 0.25,
          opacityTo: 0.02,
          stops: [0, 50, 100],
        },
      },
      xaxis: {
        categories: ['2002', '2008', '2014', '2016', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => `${value}M`,
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      grid: {
        borderColor: 'rgba(148, 163, 184, 0.25)',
        strokeDashArray: 4,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: { colors: '#e2e8f0' },
        fontSize: '12px',
        fontFamily: 'Inter, system-ui, sans-serif',
        markers: { radius: 12 },
      },
      tooltip: {
        theme: 'dark',
        x: { show: true },
        y: {
          formatter: (value) => `${value}M`,
        },
      },
    }),
    [],
  );

  return (
    <div className="w-full h-72 md:h-80">
      <ReactApexChart options={options} series={series} type="area" height="100%" />
    </div>
  );
}

function DigitalizationGauge() {
  const digitalizationLevel = 70;

  const series = useMemo(() => [digitalizationLevel], [digitalizationLevel]);

  const options = useMemo(
    () => ({
      chart: {
        type: 'radialBar',
        foreColor: '#94a3b8',
        sparkline: { enabled: true },
      },
      colors: ['#a855f7'],
      stroke: {
        lineCap: 'round',
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            size: '60%',
            background: '#020617',
          },
          track: {
            background: '#020617',
            strokeWidth: '100%',
            margin: 0,
          },
          dataLabels: {
            name: {
              show: true,
              offsetY: 10,
              color: '#cbd5e1',
              fontSize: '11px',
              formatter: () => '',
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 700,
              color: '#e5e7eb',
              offsetY: -10,
              formatter: (val) => `${Math.round(val)}%`,
            },
          },
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: () => `${digitalizationLevel}%`,
        },
      },
    }),
    [digitalizationLevel],
  );

  return (
    <div className="mx-auto w-full max-w-xs h-64">
      <ReactApexChart options={options} series={series} type="radialBar" height="100%" />
    </div>
  );
}

function EcommerceEvolutionChart() {
  const series = useMemo(
    () => [
      {
        name: 'Ventas nacionales',
        data: [2857, 3300],
      },
      {
        name: 'Ventas internacionales',
        data: [1761, 2100],
      },
    ],
    [],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        foreColor: '#94a3b8',
      },
      colors: ['#a855f7', '#06b6d4'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 6,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['2024', '2025 (proyección)'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value}M`,
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      grid: {
        borderColor: 'rgba(148, 163, 184, 0.25)',
        strokeDashArray: 4,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: { colors: '#e2e8f0' },
        fontSize: '12px',
        fontFamily: 'Inter, system-ui, sans-serif',
        markers: { radius: 12 },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value, { seriesIndex }) => {
            const label = seriesIndex === 0 ? 'Ventas nacionales' : 'Ventas internacionales';
            return `${label}: $${value}M USD`;
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="w-full h-72 md:h-80">
      <ReactApexChart options={options} series={series} type="bar" height="100%" />
    </div>
  );
}

function DemographicsChart() {
  const categories = [
    '0-4 años',
    '5-12 años',
    '13-17 años',
    '18-24 (Gen Z)',
    '25-34 (Millennials)',
    '35-44 años',
    '45-54 años',
    '55-64 años',
    '65+ años',
  ];

  const series = useMemo(
    () => [
      {
        name: 'Porcentaje de población',
        data: [8.1, 13.5, 8.7, 12, 16.7, 14.1, 10.8, 7.9, 8.2],
      },
    ],
    [],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        foreColor: '#94a3b8',
        toolbar: { show: false },
      },
      colors: ['#a855f7'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories,
        max: 20,
        labels: {
          formatter: (value) => `${value}%`,
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      grid: {
        borderColor: 'rgba(148, 163, 184, 0.25)',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: 'dark',
        x: { show: true },
        y: {
          formatter: (value) => `${value}% de la población`,
        },
      },
      legend: { show: false },
    }),
    [],
  );

  return (
    <div className="w-full h-72 md:h-80">
      <ReactApexChart options={options} series={series} type="bar" height="100%" />
    </div>
  );
}

function PaymentMethodsChart() {
  const series = useMemo(() => [74, 16, 6, 3, 1], []);
  const labels = [
    'Tarjeta de crédito',
    'Tarjeta de débito',
    'Billeteras digitales',
    'Transferencia bancaria',
    'Efectivo',
  ];

  const options = useMemo(
    () => ({
      chart: {
        type: 'donut',
        foreColor: '#94a3b8',
      },
      labels,
      colors: ['#a855f7', '#06b6d4', '#3b82f6', '#22c55e', '#fbbf24'],
      dataLabels: { enabled: false },
      legend: {
        position: 'bottom',
        labels: { colors: '#e2e8f0' },
        fontSize: '11px',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value, { seriesIndex }) => `${labels[seriesIndex]}: ${value}%`,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="w-full h-72 md:h-80">
      <ReactApexChart options={options} series={series} type="donut" height="100%" />
    </div>
  );
}

function ConsumptionCategoriesChart() {
  const labels = [
    'Servicios digitales',
    'Bienes personales',
    'Alimentos y bebidas',
    'Entretenimiento',
    'Tecnología',
  ];

  const series = useMemo(
    () => [
      {
        name: 'Usuarios que compran',
        data: [87, 78, 73, 59, 56],
      },
    ],
    [],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        foreColor: '#94a3b8',
        toolbar: { show: false },
      },
      colors: ['#22c55e'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: labels,
        max: 100,
        labels: {
          formatter: (value) => `${value}%`,
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      grid: {
        borderColor: 'rgba(148, 163, 184, 0.25)',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value) => `${value}% de usuarios compran`,
        },
      },
      legend: { show: false },
    }),
    [],
  );

  return (
    <div className="w-full h-72 md:h-80">
      <ReactApexChart options={options} series={series} type="bar" height="100%" />
    </div>
  );
}

function CountryComparisonChart() {
  const series = useMemo(
    () => [
      {
        name: 'Nivel de digitalización',
        data: [95, 80, 70],
      },
    ],
    [],
  );

  const COUNTRY_HEX = {
    China: '#ef4444',
    Chile: '#2563eb',
    Ecuador: '#f59e0b',
  };

  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        foreColor: '#94a3b8',
        toolbar: { show: false },
      },
      colors: ['China', 'Chile', 'Ecuador'].map((c) => COUNTRY_HEX[c]),
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 6,
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['China', 'Chile', 'Ecuador'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      yaxis: {
        max: 100,
        labels: {
          formatter: (value) => `${value}%`,
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
      grid: {
        borderColor: 'rgba(148, 163, 184, 0.25)',
        strokeDashArray: 4,
      },
      legend: { show: false },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value) => `Digitalización: ${value}%`,
        },
      },
    }),
    [],
  );

  return (
    <div className="w-full h-72 md:h-80">
      <ReactApexChart options={options} series={series} type="bar" height="100%" />
    </div>
  );
}

function DigitalizationRadarChart() {
  const series = useMemo(
    () => [
      {
        name: 'Ecuador',
        data: [78, 80.6, 99, 85, 75],
      },
    ],
    [],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: 'radar',
        foreColor: '#94a3b8',
        toolbar: { show: false },
      },
      colors: ['#a855f7'],
      labels: ['Usuarios internet', 'Cobertura 4G', 'Facturación E.', 'Firmas E.', 'E-commerce'],
      markers: {
        size: 4,
      },
      stroke: {
        width: 2,
      },
      fill: {
        opacity: 0.25,
      },
      yaxis: {
        max: 100,
        tickAmount: 5,
        labels: {
          formatter: (value) => `${value}%`,
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value) => `${value.toFixed(1)}%`,
        },
      },
      legend: {
        position: 'top',
        labels: { colors: '#e2e8f0' },
        fontSize: '12px',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    }),
    [],
  );

  return (
    <div className="w-full h-72 md:h-80">
      <ReactApexChart options={options} series={series} type="radar" height="100%" />
    </div>
  );
}

function WorldMapComparison() {
  const countries = [
    { code: 'EC', name: 'Ecuador', score: 78.0, x: '48%', y: '67%', color: 'bg-cyan-500' },
    { code: 'CL', name: 'Chile', score: 88.27, x: '51%', y: '82%', color: 'bg-red-500' },
    { code: 'CA', name: 'Canadá', score: 84.52, x: '27%', y: '23%', color: 'bg-green-500' },
  ];

  return (
    <div className="p-4 rounded-xl border border-white/10 bg-slate-950/70">
      <h3 className="text-sm font-semibold md:text-base">Mapa comparado de digitalización</h3>
      <p className="mt-1 text-xs text-slate-400 md:text-sm">
        Ubicación aproximada y nivel sintético de digitalización para Ecuador, Chile y Canadá.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 aspect-[16/9]">
          <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.25),transparent),radial-gradient(circle_at_65%_75%,rgba(52,211,153,0.25),transparent)]" />
          <div className="absolute inset-[10%] rounded-[2.5rem] border border-slate-700/50" />
          <div className="absolute inset-[18%] opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(148,163,184,0.15),transparent),radial-gradient(circle_at_70%_60%,rgba(148,163,184,0.12),transparent)]" />
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              style={{ left: country.x, top: country.y }}
              className="flex absolute flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-white/20 shadow-lg ${country.color}`}
              >
                <span className="text-xs font-semibold text-slate-900">{country.code}</span>
              </span>
              <span className="mt-1 text-[10px] font-semibold text-slate-200 group-hover:text-white">
                {country.score}%
              </span>
            </button>
          ))}
        </div>
        <div className="space-y-2 text-xs md:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Rango de referencia</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              Índice sintético
            </span>
          </div>
          <ul className="space-y-1.5">
            <li>• <span className="font-semibold text-cyan-300">Ecuador</span> EGDI 0,7800 · 78,00%</li>
            <li>• <span className="font-semibold text-red-300">Chile</span> EGDI 0,8827 · 88,27%</li>
            <li>• <span className="font-semibold text-green-300">Canadá</span> EGDI 0,8452 · 84,52%</li>
          </ul>
          <p className="mt-1 text-[11px] text-slate-500">
            Los porcentajes son indicadores integrados a partir de EGDI, conectividad y oferta de servicios digitales.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const [homeTab, setHomeTab] = useState('timeline');
  const [modalYear, setModalYear] = useState(null);
  const [modalEvents, setModalEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const openTimelineModal = (year) => {
    const events = timelineData[year] || [];
    setModalYear(year);
    setModalEvents(events);
    setIsModalOpen(true);
  };

  const closeTimelineModal = () => {
    setIsModalOpen(false);
    setModalYear(null);
    setModalEvents([]);
  };

  const getCategoryChipClasses = (category) => {
    if (category === 'legal') {
      return 'bg-amber-500/10 text-amber-300 border border-amber-500/40';
    }
    if (category === 'tech') {
      return 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40';
    }
    if (category === 'fintech') {
      return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40';
    }
    return 'bg-slate-700/40 text-slate-200 border border-slate-500/40';
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_10%_-10%,rgba(34,211,238,0.15),transparent),radial-gradient(800px_circle_at_90%_0%,rgba(99,102,241,0.12),transparent)] bg-slate-950 text-white">
      <main className="px-4 py-10 mx-auto space-y-12 max-w-6xl">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-400/40 text-[11px] uppercase tracking-[0.24em] text-cyan-200">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fintech & Gobierno Digital · Ecuador</span>
            </div>
            <h1 className="text-3xl font-semibold leading-tight md:text-[2.9rem] md:leading-tight">
              Un laboratorio de transformación digital en banca y servicios del Estado
            </h1>
            <p className="max-w-xl text-sm text-slate-300 md:text-base">
              Visualiza cómo Ecuador pasó de la primera transacción electrónica a un ecosistema donde
              leyes, fintechs y plataformas públicas conviven, comparado con Chile y Canadá usando
              datos oficiales.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/app"
                className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/30 hover:bg-emerald-300"
              >
                Abrir visor de datos
              </Link>
              <Link
                to="/app#indicadores"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/5"
              >
                Ver indicadores clave
              </Link>
            </div>
            <div className="grid gap-3 text-xs sm:text-sm sm:grid-cols-3">
              <div className="p-3 rounded-2xl border bg-slate-950/80 border-emerald-400/40">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">EGDI 2024</div>
                <div className="mt-1 text-xl font-semibold text-emerald-300">0,7800</div>
                <p className="mt-1 text-[11px] text-slate-400">Ecuador · Puesto 67 · Alto</p>
              </div>
              <div className="p-3 rounded-2xl border bg-slate-950/80 border-cyan-400/40">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Conectividad</div>
                <div className="mt-1 text-xl font-semibold text-emerald-300">71,3%</div>
                <p className="mt-1 text-[11px] text-slate-400">Hogares con internet (INEC 2025)</p>
              </div>
              <div className="p-3 rounded-2xl border bg-slate-950/80 border-sky-400/40">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Hitos analizados</div>
                <div className="mt-1 text-xl font-semibold text-sky-300">24</div>
                <p className="mt-1 text-[11px] text-slate-400">Legal · Tech · Fintech · Gobierno digital</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-12 -right-8 w-48 h-48 rounded-full blur-3xl bg-emerald-400/30" />
            <div className="absolute bottom-0 -left-6 w-40 h-40 rounded-full blur-3xl bg-cyan-500/25" />
            <div className="relative flex flex-col gap-4">
              <div className="overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.35)]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/90">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      Tablero transaccional
                    </div>
                    <p className="text-xs text-slate-300">Firmas electrónicas · pagos digitales · EGDI</p>
                  </div>
                  <div className="inline-flex rounded-full bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300 border border-white/10">
                    Live · Ecuador
                  </div>
                </div>
                <div className="grid gap-3 p-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-emerald-500/5 to-slate-900 border border-emerald-400/60">
                      <div className="flex items-center justify-between text-[11px] text-emerald-100">
                        <span>Firmas electrónicas</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-950/60 text-[10px]">
                          +18% anual
                        </span>
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-emerald-100">
                        2,0M
                      </div>
                      <div className="mt-2 h-10 w-full rounded-md bg-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.6)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200">
                      <div className="p-2 rounded-xl border bg-slate-950/70 border-white/15">
                        <div className="text-[10px] text-slate-400">Canales electrónicos</div>
                        <div className="text-lg font-semibold text-emerald-300">76,7%</div>
                        <div className="text-[10px] text-slate-500">Transacciones 2025</div>
                      </div>
                      <div className="p-2 rounded-xl border bg-slate-950/70 border-white/15">
                        <div className="text-[10px] text-slate-400">Internet hogares</div>
                        <div className="text-lg font-semibold text-cyan-300">71,3%</div>
                        <div className="text-[10px] text-slate-500">INEC 2025</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl border bg-slate-950/80 border-white/15">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Comparativa EGDI 2024</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          ONU
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-slate-200">
                        <div className="rounded-lg bg-slate-900/70 border border-emerald-400/50 p-2">
                          <div className="text-[10px] text-slate-400">Ecuador</div>
                          <div className="text-lg font-semibold text-emerald-300">0,7800</div>
                          <div className="text-[10px] text-slate-500">Puesto 67</div>
                        </div>
                        <div className="rounded-lg bg-slate-900/70 border border-sky-400/50 p-2">
                          <div className="text-[10px] text-slate-400">Canadá</div>
                          <div className="text-lg font-semibold text-sky-300">0,8452</div>
                          <div className="text-[10px] text-slate-500">Puesto 47</div>
                        </div>
                        <div className="rounded-lg bg-slate-900/70 border border-red-400/50 p-2">
                          <div className="text-[10px] text-slate-400">Chile</div>
                          <div className="text-lg font-semibold text-red-300">0,8827</div>
                          <div className="text-[10px] text-slate-500">Puesto 31</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl border bg-slate-950/80 border-white/15">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span>Activación por país</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-white/10">
                          Timeline 2002–2026
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-200">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          EC
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          CL
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          CA
                        </span>
                      </div>
                      <div className="mt-2 h-12 w-full rounded-lg bg-[linear-gradient(to_right,rgba(16,185,129,0.5)_0%,rgba(16,185,129,0.2)_35%,rgba(248,113,113,0.4)_35%,rgba(248,113,113,0.2)_65%,rgba(56,189,248,0.4)_65%,rgba(56,189,248,0.2)_100%)]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-end w-full max-w-xs p-3 rounded-2xl border bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-slate-950 border-emerald-400/60">
                <div className="flex items-center justify-between text-[11px] text-emerald-100">
                  <span>Perfil país</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-950/70 border border-white/10">
                    Modo presentación
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-[1.2fr_1fr] gap-2 text-[10px] text-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-300">Ecuador · banca y Estado</div>
                    <div className="mt-1 text-xs text-slate-300">
                      Hitos legales, inclusión financiera y uso de canales digitales con foco en
                      experiencia de usuario.
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <span className="rounded-full bg-slate-950/70 border border-white/15 px-2 py-0.5">
                      Fintech · GovTech
                    </span>
                    <span className="rounded-full bg-slate-950/70 border border-emerald-400/40 px-2 py-0.5">
                      24 eventos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-5 space-y-6 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold md:text-lg">
                Transformación digital y comercio electrónico (2002–2026)
              </h2>
              <p className="mt-1 text-xs text-slate-300 md:text-sm">
                Línea de tiempo completa de hitos legales, tecnológicos y fintech, junto con un
                tablero de indicadores de uso digital, facturación electrónica y comparación
                internacional.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-between items-center">
            <div className="inline-flex rounded-full border border-white/10 bg-slate-900/80 p-1 text-[11px] md:text-xs">
              <button
                type="button"
                onClick={() => setHomeTab('timeline')}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  homeTab === 'timeline'
                    ? 'bg-cyan-500 text-slate-900 shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Línea de tiempo y resumen
              </button>
              <button
                type="button"
                onClick={() => setHomeTab('dashboard')}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  homeTab === 'dashboard'
                    ? 'bg-cyan-500 text-slate-900 shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Dashboard de indicadores
              </button>
            </div>
            <p className="hidden text-[11px] text-slate-400 md:block">
              Cambia de pestaña para ver la narrativa histórica o el tablero numérico.
            </p>
          </div>

          {homeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold md:text-base">
                    De la primera transacción a un ecosistema digital regulado
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                    El recorrido inicia en 2002 con la primera transacción electrónica registrada y la
                    aprobación de la Ley de Comercio Electrónico. A partir de 2008 la firma electrónica
                    se vuelve operativa con el Banco Central, permitiendo que el Estado y el sistema
                    financiero migren progresivamente a procesos digitales.
                  </p>
                  <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                    Entre 2014 y 2019 aparecen las primeras fintechs locales, se consolida la
                    facturación electrónica y la banca tradicional comienza a desarrollar apps móviles
                    propias. La pandemia en 2020 acelera el cambio de hábitos: el uso de canales
                    digitales se dispara y en 2021 las transacciones electrónicas superan por primera
                    vez a las físicas.
                  </p>
                  <p className="text-xs leading-relaxed text-slate-300 md:text-sm">
                    A partir de 2022 el marco normativo se refuerza con la Ley Fintech, la obligatoriedad
                    de la facturación electrónica y la Agenda de Transformación Digital 2025–2030. Para
                    2026 se proyecta un ecosistema donde casi toda la población económicamente activa
                    opera con firma digital y servicios financieros en línea.
                  </p>
                </div>
                <div className="p-4 space-y-3 rounded-xl border border-cyan-500/40 bg-slate-900/60">
                  <h3 className="text-sm font-semibold text-cyan-300">
                    Facturación electrónica y firma digital
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-200 md:text-sm">
                    <li>• 2002: se reconoce legalmente la firma electrónica en la Ley de Comercio Electrónico.</li>
                    <li>• 2008–2009: el BCE se acredita como entidad certificadora y la firma se vuelve operativa.</li>
                    <li>• 2016: el Código Ingenios declara el internet como servicio básico y refuerza el uso de TIC.</li>
                    <li>• 2022: la facturación electrónica se vuelve obligatoria para casi todos los contribuyentes.</li>
                  </ul>
                  <p className="text-[11px] text-slate-400">
                    Al cierre de 2024 se registran más de 2 millones de certificados de firma electrónica
                    y más del 99% de las facturas emitidas en el país son electrónicas.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 justify-between items-center">
                  <h3 className="text-sm font-semibold md:text-base">Línea de tiempo interactiva</h3>
                  <span className="text-[11px] text-slate-400">
                    Toca un año para ver sus eventos clave.
                  </span>
                </div>
                <div className="overflow-x-auto relative px-4 py-3 rounded-full border border-white/10 bg-slate-950/70">
                  <div className="flex gap-3 items-center min-w-max">
                    {orderedYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => openTimelineModal(year)}
                        className="group relative flex flex-col items-center gap-1 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
                      >
                        <span>{year}</span>
                        <span className="flex gap-1">
                          {['legal', 'tech', 'fintech'].map(
                            (category) =>
                              (timelineData[year] || []).some((e) => e.category === category) && (
                                <span
                                  key={category}
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    category === 'legal'
                                      ? 'bg-amber-400'
                                      : category === 'tech'
                                        ? 'bg-cyan-400'
                                        : 'bg-emerald-400'
                                  }`}
                                />
                              ),
                          )}
                        </span>
                        <span className="absolute inset-0 rounded-full opacity-0 transition bg-cyan-500/0 group-hover:bg-cyan-500/10 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  La línea de tiempo organiza los hitos en tres capas: normativa (legal), adopción
                  tecnológica (tech) y aparición de nuevos actores de pagos (fintech).
                </p>
              </div>

              <div className="grid gap-4 text-xs md:grid-cols-3 md:text-sm">
                <div className="p-4 rounded-xl border border-violet-500/40 bg-slate-900/70">
                  <div className="mb-1 text-[11px] font-semibold text-violet-300">
                    Etapa 1 · Fundamentos legales
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Ley de Comercio Electrónico y firma electrónica (2002).</li>
                    <li>• Operatividad de la firma digital con el BCE (2008–2009).</li>
                    <li>• Código Ingenios e internet como servicio básico (2016).</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-slate-900/70">
                  <div className="mb-1 text-[11px] font-semibold text-cyan-300">
                    Etapa 2 · Innovación fintech
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Aparición de PayPhone y Kushki como infraestructuras de pagos.</li>
                    <li>• Bancos migran a apps móviles y onboarding 100% digital.</li>
                    <li>• Surgen billeteras y medios de pago especializados en microtransacciones.</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-slate-900/70">
                  <div className="mb-1 text-[11px] font-semibold text-emerald-300">
                    Etapa 3 · Dominio de lo digital
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• La pandemia acelera el uso masivo de canales digitales.</li>
                    <li>• Las transacciones electrónicas superan a las físicas en 2021.</li>
                    <li>• Ley Fintech, normas de pagos y agenda digital 2025–2030.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {homeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-xl border border-white/10 bg-slate-900/70">
                  <div className="text-[11px] font-semibold text-slate-300">Firmas electrónicas</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-300">2M+</div>
                  <p className="mt-1 text-[11px] text-slate-400">Certificados emitidos hasta 2024.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-slate-900/70">
                  <div className="text-[11px] font-semibold text-slate-300">Facturas digitales</div>
                  <div className="mt-1 text-2xl font-bold text-cyan-300">99%</div>
                  <p className="mt-1 text-[11px] text-slate-400">De los comprobantes emitidos son electrónicos.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-slate-900/70">
                  <div className="text-[11px] font-semibold text-slate-300">
                    Transacciones digitales 2021
                  </div>
                  <div className="mt-1 text-2xl font-bold text-violet-300">135.849M</div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Monto transaccionado, equivalente a 1,2 veces el PIB.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-slate-900/70">
                  <div className="text-[11px] font-semibold text-slate-300">Nivel digitalización</div>
                  <div className="mt-1 text-2xl font-bold text-amber-300">70%</div>
                  <p className="mt-1 text-[11px] text-slate-400">Índice sintético estimado para 2024.</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="p-4 rounded-xl border border-white/10 bg-slate-950/70">
                  <h3 className="text-sm font-semibold md:text-base">
                    Transacciones digitales vs físicas (2002–2026)
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 md:text-sm">
                    La curva digital crece de forma exponencial mientras las operaciones físicas se reducen a
                    un rol residual de atención.
                  </p>
                  <div className="mt-3">
                    <DigitalGrowthChart />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-slate-950/70">
                    <h3 className="text-sm font-semibold md:text-base">
                      Nivel de digitalización del ecosistema
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 md:text-sm">
                      Indicador sintético basado en uso de internet, e-government, pagos digitales y
                      facturación electrónica.
                    </p>
                    <div className="mt-3">
                      <DigitalizationGauge />
                    </div>
                  </div>
                  <div className="p-4 text-xs rounded-xl border border-emerald-500/40 bg-emerald-500/5 text-slate-200 md:text-sm">
                    <p>
                      El salto clave se observa en 2020–2022, cuando la combinación de pandemia,
                      obligatoriedad de facturación electrónica y regulación Fintech consolida el uso
                      cotidiano de canales digitales para pagos y servicios del Estado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="p-4 rounded-xl border border-white/10 bg-slate-950/70">
                  <h3 className="text-sm font-semibold md:text-base">
                    Evolución del e-commerce ecuatoriano
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 md:text-sm">
                    Ventas nacionales e internacionales en millones de USD (2024 y proyección 2025),
                    según datos de la Cámara Ecuatoriana de Comercio Electrónico.
                  </p>
                  <div className="mt-3">
                    <EcommerceEvolutionChart />
                  </div>
                </div>
                <div className="p-4 space-y-3 text-xs rounded-xl border border-white/10 bg-slate-900/70 text-slate-200 md:text-sm">
                  <h3 className="text-sm font-semibold md:text-base">
                    Lectura rápida del mercado digital
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      • El mercado nacional sigue siendo el núcleo del e-commerce, pero las ventas
                      internacionales crecen de manera sostenida.
                    </li>
                    <li>
                      • La mayoría de compras digitales se concentra en servicios digitales, bienes
                      personales y alimentos, con alta participación de Millennials y Gen Z.
                    </li>
                    <li>
                      • El uso intensivo de tarjetas y billeteras digitales reduce el peso del efectivo
                      en compras en línea.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="p-4 rounded-xl border border-white/10 bg-slate-950/70">
                  <h3 className="text-sm font-semibold md:text-base">
                    Perfil demográfico del consumidor digital
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 md:text-sm">
                    Distribución por edad de la población ecuatoriana, destacando los segmentos con
                    mayor propensión al gasto digital.
                  </p>
                  <div className="mt-3">
                    <DemographicsChart />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-slate-950/70">
                    <h3 className="text-sm font-semibold md:text-base">
                      Categorías de consumo en línea
                    </h3>
                    <div className="mt-3">
                      <ConsumptionCategoriesChart />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-slate-950/70">
                    <h3 className="text-sm font-semibold md:text-base">Métodos de pago preferidos</h3>
                    <div className="mt-3">
                      <PaymentMethodsChart />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                  <div className="p-4 rounded-xl border border-white/10 bg-slate-950/70">
                    <h3 className="text-sm font-semibold md:text-base">
                      Comparación internacional del nivel de digitalización
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 md:text-sm">
                      Ecuador se ubica en un punto intermedio entre China (modelo altamente digitalizado) y
                      Chile (referente OCDE en la región).
                    </p>
                    <div className="mt-3">
                      <CountryComparisonChart />
                    </div>
                  </div>
                  <div className="p-4 space-y-3 rounded-xl border border-white/10 bg-slate-950/70">
                    <h3 className="text-sm font-semibold md:text-base">
                      Índice multidimensional de digitalización
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 md:text-sm">
                      Radar construido con cinco dimensiones: usuarios de internet, cobertura 4G, facturación
                      electrónica, firmas electrónicas y madurez del e-commerce.
                    </p>
                    <div className="mt-3">
                      <DigitalizationRadarChart />
                    </div>
                  </div>
                </div>
                <WorldMapComparison />
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="flex fixed inset-0 z-40 justify-center items-center backdrop-blur-sm bg-black/60">
              <div className="relative p-5 w-full max-w-lg rounded-2xl border shadow-xl border-white/10 bg-slate-950">
                <button
                  type="button"
                  onClick={closeTimelineModal}
                  className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Cerrar
                </button>
                <h3 className="mb-1 text-base font-semibold md:text-lg">
                  Eventos clave {modalYear ? `· ${modalYear}` : ''}
                </h3>
                <p className="mb-3 text-[11px] text-slate-400 md:text-xs">
                  Extraído de timeline.html: cada evento se clasifica según su naturaleza legal, tecnológica
                  o fintech.
                </p>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {modalEvents.map((event) => (
                    <div
                      key={`${event.title}-${event.date}`}
                      className="p-3 text-xs rounded-xl border border-white/10 bg-slate-900/80 text-slate-200 md:text-sm"
                    >
                      <div className="flex gap-2 justify-between items-center">
                        <span className="text-[11px] font-semibold text-slate-300">{event.date}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getCategoryChipClasses(event.category)}`}
                        >
                          {getCategoryName(event.category)}
                        </span>
                      </div>
                      <div className="mt-1 text-[13px] font-semibold text-slate-100">{event.title}</div>
                      <p className="mt-1 text-[11px] text-slate-300">{event.description}</p>
                      {Array.isArray(event.details) && event.details.length > 0 && (
                        <ul className="mt-1 space-y-0.5 text-[11px] text-slate-400">
                          {event.details.map((detail) => (
                            <li key={detail}>• {detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {modalEvents.length === 0 && (
                    <p className="text-[11px] text-slate-400">
                      No se encontraron eventos para este año en timelineData.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="p-5 rounded-2xl border bg-white/5 border-white/10">
            <h3 className="mb-2 font-semibold">Eventos y línea de tiempo</h3>
            <p className="text-sm text-slate-300">Explora los hitos históricos y comparativos de Ecuador, Canadá y Chile.</p>
          </div>
          <div className="p-5 rounded-2xl border bg-white/5 border-white/10">
            <h3 className="mb-2 font-semibold">Indicadores oficiales</h3>
            <p className="text-sm text-slate-300">EGDI, ENEMDU y métricas clave con fuentes verificadas.</p>
          </div>
          <div className="p-5 rounded-2xl border bg-white/5 border-white/10">
            <h3 className="mb-2 font-semibold">Análisis interactivo</h3>
            <p className="text-sm text-slate-300">Secciones dinámicas para metodología, resultados y conclusiones.</p>
          </div>
        </section>

        <section className="flex justify-center">
          <div className="flex justify-center items-center p-3 w-44 h-44 rounded-full border-4 shadow-lg md:h-52 md:w-52 bg-white/90 border-white/20">
            <img
              src={`${import.meta.env.BASE_URL}logo3.png`}
              alt="Universidad Central del Ecuador"
              className="object-contain w-full h-full"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
