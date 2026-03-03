import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as XLSX from 'xlsx'
import './App.css'
import { EventCard } from './components/EventCard.jsx'
import { TimelineModal } from './components/TimelineModal.jsx'
import { VerticalTimeline } from './components/VerticalTimeline.jsx'
import { InternetUsageTable } from './components/InternetUsageTable.jsx'
import { ReportInteractive } from './components/ReportInteractive.jsx'
import { useEvents } from './hooks/useEvents.js'
import ReactApexChart from 'react-apexcharts'

const COUNTRY_HEX = {
  Ecuador: '#f59e0b',
  Chile: '#2563eb',
  Canadá: '#ef4444',
  China: '#ef4444',
}

const countryHex = (name) => COUNTRY_HEX[name] || '#06b6d4'
const countryChipClasses = (name) => {
  if (name === 'Ecuador') {
    return 'px-2 py-1 text-xs text-white font-semibold rounded-full border bg-gradient-to-r from-yellow-600 via-blue-500 to-red-600 border-white/40 text-slate-900 shadow-sm'
  }
  if (name === 'Chile') {
    return 'px-2 py-1 text-xs font-semibold rounded-full border bg-gradient-to-r from-blue-700 via-slate-100 to-red-600 border-white/40 text-slate-900 shadow-sm'
  }
  if (name === 'Canadá') {
    return 'px-2 py-1 text-xs font-semibold rounded-full border bg-gradient-to-r from-red-700 via-slate-100 to-red-700 border-white/40 text-slate-900 shadow-sm'
  }
  return 'px-2 py-1 text-xs rounded-full border bg-white/10 border-white/10'
}

const CHART_RESP = {
  responsive: [
    { breakpoint: 1024, options: { legend: { fontSize: '10px' } } },
    { breakpoint: 768, options: { legend: { fontSize: '9px' }, dataLabels: { enabled: false } } },
    { breakpoint: 480, options: { legend: { show: false }, xaxis: { labels: { style: { fontSize: '9px' } } } } },
  ],
}
function EgdiComparisonChart() {
  const series = useMemo(
    () => [
      {
        name: 'EGDI 2024',
        data: [0.7800, 0.8827, 0.8452],
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
      colors: [countryHex('Ecuador'), countryHex('Chile'), countryHex('Canadá')],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 6,
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(4),
        style: {
          fontSize: '11px',
          colors: ['#e5e7eb'],
        },
      },
      xaxis: {
        categories: ['Ecuador', 'Chile', 'Canadá'],
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
        max: 1,
        min: 0,
        tickAmount: 5,
        labels: {
          formatter: (value) => value.toFixed(1),
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
          formatter: (value, { dataPointIndex }) => {
            const countries = ['Ecuador', 'Chile', 'Canadá'];
            return `${countries[dataPointIndex]}: ${value.toFixed(4)}`;
          },
        },
      },
      legend: { show: false },
    }),
    [],
  );

  return (
    <div className="w-full h-64 md:h-72">
      <ReactApexChart options={options} series={series} type="bar" height="100%" />
    </div>
  );
}

function FirmaTopChart({ data }) {
  const categories = useMemo(() => data.map(item => item.system), [data]);
  const series = useMemo(
    () => [
      {
        name: 'Firmas acumuladas',
        data: data.map(item => item.total),
      },
    ],
    [data],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        foreColor: '#94a3b8',
      },
      colors: ['#22c55e'],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '65%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories,
        labels: {
          formatter: (value) => new Intl.NumberFormat('es-EC').format(value),
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
          formatter: (value) => `${new Intl.NumberFormat('es-EC').format(value)} firmas`,
        },
      },
      legend: { show: false },
    }),
    [categories],
  );

  if (!data.length) {
    return (
      <div className="text-xs text-slate-400">
        No se pudo cargar el detalle de sistemas de firma electrónica.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ReactApexChart options={options} series={series} type="bar" height="100%" />
    </div>
  );
}

function InclusionFinancieraSectionView() {
  return (
    <div className="p-4 rounded-2xl border bg-white/5 border-white/10">
      <div className="flex gap-3 justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold">Inclusión financiera — créditos, tarjetas y transacciones</h4>
          <p className="text-xs text-slate-400">Boletín Trimestral de Inclusión Financiera (sep 2025)</p>
        </div>
        <span className={countryChipClasses('Ecuador')}>Ecuador</span>
      </div>

      <div className="grid gap-3 mb-4 indicator-charts md:grid-cols-5">
        <div className="p-3 rounded-xl border bg-white/5 border-white/10">
          <div className="text-xs text-slate-400">Transacciones (ene-sep 2025)</div>
          <div className="text-xl font-semibold">4,343 millones</div>
          <div className="text-xs text-emerald-300">+14,3% anual</div>
        </div>
        <div className="p-3 rounded-xl border bg-white/5 border-white/10">
          <div className="text-xs text-slate-400">Canales electrónicos</div>
          <div className="text-xl font-semibold">76,7%</div>
          <div className="text-xs text-emerald-300">+17,8% anual</div>
        </div>
        <div className="p-3 rounded-xl border bg-white/5 border-white/10">
          <div className="text-xs text-slate-400">Banca móvil</div>
          <div className="text-xl font-semibold">+32,5%</div>
          <div className="text-xs text-slate-500">Incremento anual</div>
        </div>
        <div className="p-3 rounded-xl border bg-white/5 border-white/10">
          <div className="text-xs text-slate-400">Banca electrónica</div>
          <div className="text-xl font-semibold">-0,1%</div>
          <div className="text-xs text-rose-300">Decrecimiento anual</div>
        </div>
        <div className="p-3 rounded-xl border bg-white/5 border-white/10">
          <div className="text-xs text-slate-400">Participación física</div>
          <div className="text-xl font-semibold">23,3%</div>
          <div className="text-xs text-slate-500">Sep 2025</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4 mb-4">
        <div className="p-4 rounded-xl border indicator-charts bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Participación por tipo de canal (sep 2025)</div>
          <ReactApexChart
            type="donut"
            height={260}
            series={[49.4, 23.22, 9.87, 7.08, 6.29, 3.75]}
            options={{
              chart: { type: 'donut', foreColor: '#94a3b8', toolbar: { show: false } },
              labels: [
                'Banca celular',
                'Oficina',
                'Internet',
                'Datáfono POS',
                'Cajeros automáticos',
                'Corresponsal no bancario',
              ],
              legend: { position: 'bottom', fontSize: '10px' },
              dataLabels: { enabled: false },
              colors: ['#3b82f6', '#f59e0b', '#22c55e', '#06b6d4', '#a855f7', '#ec4899'],
              plotOptions: { pie: { donut: { size: '65%' } } },
            }}
          />
        </div>
        <div className="p-4 rounded-xl border indicator-tables bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Transacciones por tipo de canal</div>
          <table className="w-full text-xs text-slate-300">
            <thead>
              <tr className="border-b text-slate-400 border-white/10">
                <th className="py-1 pr-2 text-left">Canal</th>
                <th className="py-1 pr-2 text-left">Sep 2024</th>
                <th className="py-1 pr-2 text-left">Sep 2025</th>
                <th className="py-1 text-left">Part. 2025</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Electrónico</td>
                <td className="py-1 pr-2">2.829</td>
                <td className="py-1 pr-2">3.331</td>
                <td className="py-1">76,7%</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Físico</td>
                <td className="py-1 pr-2">972</td>
                <td className="py-1 pr-2">1.011</td>
                <td className="py-1">23,3%</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">Total</td>
                <td className="py-1 pr-2">3.801</td>
                <td className="py-1 pr-2">4.343</td>
                <td className="py-1">100%</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 mb-2 text-xs text-slate-400">Transacciones por canal</div>
          <table className="w-full text-xs text-slate-300">
            <thead>
              <tr className="border-b text-slate-400 border-white/10">
                <th className="py-1 pr-2 text-left">Canal</th>
                <th className="py-1 pr-2 text-left">Sep 2024</th>
                <th className="py-1 pr-2 text-left">Sep 2025</th>
                <th className="py-1 text-left">Part. 2025</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Internet</td>
                <td className="py-1 pr-2">428</td>
                <td className="py-1 pr-2">429</td>
                <td className="py-1">9,9%</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Oficina</td>
                <td className="py-1 pr-2">968</td>
                <td className="py-1 pr-2">1.008</td>
                <td className="py-1">23,2%</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Banca celular</td>
                <td className="py-1 pr-2">1.620</td>
                <td className="py-1 pr-2">2.145</td>
                <td className="py-1">49,4%</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Otros</td>
                <td className="py-1 pr-2">785</td>
                <td className="py-1 pr-2">760</td>
                <td className="py-1">17,5%</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">Total</td>
                <td className="py-1 pr-2">3.801</td>
                <td className="py-1 pr-2">4.343</td>
                <td className="py-1">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 mb-4 indicator-charts lg:grid-cols-2 xl:grid-cols-3">
        <div className="p-4 rounded-xl border bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Adultos con tarjeta de crédito</div>
          <ReactApexChart
            type="donut"
            height={190}
            series={[30.9, 69.1]}
            options={{
              chart: { type: 'donut', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
              labels: ['Tiene', 'No tiene'],
              legend: { position: 'bottom', fontSize: '10px' },
              dataLabels: { enabled: false },
              colors: ['#3b82f6', '#f59e0b'],
              plotOptions: { pie: { donut: { size: '70%' } } },
            }}
          />
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-slate-300">
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Tiene: 30,9%</div>
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>No tiene: 69,1%</div>
          </div>
          <div className="mb-2 text-xs text-slate-400">Por sexo</div>
          <ReactApexChart
            type="bar"
            height={190}
            series={[
              { name: 'Hombres', data: [34.86] },
              { name: 'Mujeres', data: [27.11] },
            ]}
            options={{
              chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, stacked: false },
              plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
              dataLabels: { enabled: false },
              xaxis: { categories: ['Tarjeta de crédito'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
              yaxis: { labels: { formatter: (val) => `${val.toFixed(0)}%` } },
              legend: { position: 'bottom', fontSize: '10px' },
              colors: ['#3b82f6', '#ec4899'],
              tooltip: {
                theme: 'dark',
                y: {
                  formatter: (val, { seriesIndex }) => {
                    const label = seriesIndex === 0 ? 'Hombres' : 'Mujeres';
                    return `${label}: ${val.toFixed(2)}%`;
                  },
                },
              },
            }}
          />
          <div className="mt-4 mb-2 text-xs text-slate-400">Por edad (participación)</div>
          <ReactApexChart
            type="radar"
            height={310}
            series={[
              { name: 'Hombres', data: [4.6, 49.3, 35.0, 11.1] },
              { name: 'Mujeres', data: [4.2, 50.9, 34.3, 10.6] },
            ]}
            options={{
              chart: { type: 'radar', foreColor: '#94a3b8', toolbar: { show: false } },
              xaxis: { categories: ['≤24', '25–44', '45–64', '65+'], labels: { style: { fontSize: '10px' } } },
              yaxis: { show: true, labels: { formatter: (val) => `${val.toFixed(0)}%` } },
              stroke: { width: 2 },
              fill: { opacity: 0.2 },
              colors: ['#3b82f6', '#ec4899'],
              legend: { position: 'bottom', fontSize: '10px' },
            }}
          />
        </div>
        <div className="p-4 rounded-xl border bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Consumo — adultos con crédito</div>
          <div className="w-full h-40 sm:h-44 md:h-52 lg:h-60">
            <ReactApexChart
              type="polarArea"
              height="100%"
              series={[11.0, 89.0]}
              options={{
                chart: { type: 'polarArea', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                labels: ['Tiene', 'No tiene'],
                legend: { show: false },
                dataLabels: { enabled: false },
                stroke: { width: 1, colors: ['#0f172a'] },
                fill: { opacity: 0.75 },
                colors: ['#3b82f6', '#f59e0b'],
                responsive: CHART_RESP.responsive,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3 text-xs text-slate-300">
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Tiene: 11,0%</div>
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>No tiene: 89,0%</div>
          </div>
          <div className="mb-1 text-xs text-slate-400">Por sexo</div>
          <ReactApexChart
            type="bar"
            height={190}
            series={[
              { name: 'Hombres', data: [11.66] },
              { name: 'Mujeres', data: [10.33] },
            ]}
            options={{
              chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, stacked: false },
              plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
              dataLabels: { enabled: false },
              xaxis: { categories: ['Consumo'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
              yaxis: { labels: { formatter: (val) => `${val.toFixed(0)}%` } },
              legend: { position: 'bottom', fontSize: '10px' },
              colors: ['#3b82f6', '#ec4899'],
              tooltip: {
                theme: 'dark',
                y: {
                  formatter: (val, { seriesIndex }) => {
                    const label = seriesIndex === 0 ? 'Hombres' : 'Mujeres';
                    return `${label}: ${val.toFixed(2)}%`;
                  },
                },
              },
            }}
          />
          <div className="mt-3 mb-1 text-xs text-slate-400">Por edad</div>
          <div className="w-full h-44 sm:h-48 md:h-56 lg:h-64">
            <ReactApexChart
              type="radar"
              height={310}
              series={[
                { name: 'Hombres', data: [10.3, 56.0, 29.6, 4.1] },
                { name: 'Mujeres', data: [8.5, 60.4, 27.8, 3.2] },
              ]}
              options={{
                chart: { type: 'radar', foreColor: '#94a3b8', toolbar: { show: false } },
                xaxis: { categories: ['≤24', '25–44', '45–64', '65+'], labels: { style: { fontSize: '10px' } } },
                yaxis: { show: true, labels: { formatter: (val) => `${val.toFixed(0)}%` } },
                stroke: { width: 2 },
                fill: { opacity: 0.2 },
                colors: ['#3b82f6', '#ec4899'],
                legend: { position: 'bottom', fontSize: '10px' },
              }}
            />
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Microcréditos — adultos con crédito</div>
          <div className="w-full h-40 sm:h-44 md:h-52 lg:h-60">
            <ReactApexChart
              type="polarArea"
              height="100%"
              series={[3.8, 96.2]}
              options={{
                chart: { type: 'polarArea', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                labels: ['Tiene', 'No tiene'],
                legend: { show: false },
                dataLabels: { enabled: false },
                stroke: { width: 1, colors: ['#0f172a'] },
                fill: { opacity: 0.75 },
                colors: ['#3b82f6', '#f59e0b'],
                responsive: CHART_RESP.responsive,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3 text-xs text-slate-300">
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Tiene: 3,8%</div>
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>No tiene: 96,2%</div>
          </div>
          <div className="mb-1 text-xs text-slate-400">Por sexo</div>
          <ReactApexChart
            type="bar"
            height={190}
            series={[
              { name: 'Hombres', data: [4.70] },
              { name: 'Mujeres', data: [2.89] },
            ]}
            options={{
              chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, stacked: false },
              plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
              dataLabels: { enabled: false },
              xaxis: { categories: ['Microcréditos'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
              yaxis: { labels: { formatter: (val) => `${val.toFixed(0)}%` } },
              legend: { position: 'bottom', fontSize: '10px' },
              colors: ['#3b82f6', '#ec4899'],
              tooltip: {
                theme: 'dark',
                y: {
                  formatter: (val, { seriesIndex }) => {
                    const label = seriesIndex === 0 ? 'Hombres' : 'Mujeres';
                    return `${label}: ${val.toFixed(2)}%`;
                  },
                },
              },
            }}
          />
          <div className="mt-3 mb-1 text-xs text-slate-400">Por edad</div>
          <ReactApexChart
            type="radar"
            height={310}
            series={[
              { name: 'Hombres', data: [14.2, 47.3, 32.5, 6.1] },
              { name: 'Mujeres', data: [11.7, 51.5, 32.1, 4.8] },
            ]}
            options={{
              chart: { type: 'radar', foreColor: '#94a3b8', toolbar: { show: false } },
              xaxis: { categories: ['≤24', '25–44', '45–64', '65+'], labels: { style: { fontSize: '10px' } } },
              yaxis: { show: true, labels: { formatter: (val) => `${val.toFixed(0)}%` } },
              stroke: { width: 2 },
              fill: { opacity: 0.2 },
              colors: ['#3b82f6', '#ec4899'],
              legend: { position: 'bottom', fontSize: '10px' },
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 mb-4 indicator-charts md:grid-cols-2">
        <div className="p-4 rounded-xl border bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Tarjetas de débito</div>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>10,6 millones</span>
            <span className="text-emerald-300">+9,6% anual</span>
          </div>
          <div className="flex overflow-hidden h-3 rounded-full bg-white/10">
            <div className="h-full bg-blue-500" style={{ width: '50.8%' }} title="Hombres 50,8%"></div>
            <div className="h-full bg-pink-400" style={{ width: '49.2%' }} title="Mujeres 49,2%"></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-slate-300">
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Hombres: 50,8%</div>
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-pink-400 rounded-full"></span>Mujeres: 49,2%</div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Tarjetas de crédito</div>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>4,2 millones</span>
            <span className="text-emerald-300">+6,1% anual</span>
          </div>
          <div className="flex overflow-hidden h-3 rounded-full bg-white/10">
            <div className="h-full bg-blue-500" style={{ width: '55.2%' }} title="Hombres 55,2%"></div>
            <div className="h-full bg-pink-400" style={{ width: '44.8%' }} title="Mujeres 44,8%"></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-slate-300">
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Hombres: 55,2%</div>
            <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-pink-400 rounded-full"></span>Mujeres: 44,8%</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400">
        Fuente:
        <a
          href="https://www.superbancos.gob.ec/estadisticas/portalestudios/estudios-y-analisis/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-cyan-300 hover:underline"
        >
          Superintendencia de Bancos — Boletín Trimestral de Inclusión Financiera (sep 2025)
        </a>
      </div>
    </div>
  );
}

function PresenciaFinancieraSectionView() {
  return (
    <div className="p-4 rounded-2xl border bg-white/5 border-white/10">
      <div className="space-y-4 indicator-charts">
        <div className="flex gap-3 justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold">Presencia financiera — Superintendencia de Bancos</h4>
            <p className="text-xs text-slate-400">Boletín de Inclusión Financiera (sep 2025)</p>
          </div>
          <span className={countryChipClasses('Ecuador')}>Ecuador</span>
        </div>

        <div className="grid gap-3 mb-4 md:grid-cols-5">
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Puntos de atención</div>
            <div className="text-xl font-semibold">179.275</div>
            <div className="text-xs text-emerald-300">+8,7% anual</div>
          </div>
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Oficinas</div>
            <div className="text-xl font-semibold">1.374</div>
            <div className="text-xs text-rose-300">-2,3% anual</div>
          </div>
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Cajeros automáticos</div>
            <div className="text-xl font-semibold">5.022</div>
            <div className="text-xs text-emerald-300">+2,8% anual</div>
          </div>
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Corresponsales</div>
            <div className="text-xl font-semibold">48.536</div>
            <div className="text-xs text-emerald-300">+6,8% anual</div>
          </div>
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Datáfonos y cajas</div>
            <div className="text-xl font-semibold">124.343</div>
            <div className="text-xs text-emerald-300">+10,6% anual</div>
          </div>
        </div>

        <div className="grid gap-4 mb-4 md:grid-cols-2">
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="flex justify-between items-center mb-2 text-xs text-slate-400">
              <span>Puntos de atención por 10.000 adultos</span>
              <span>Total: 133,3 (+7,35%)</span>
            </div>
            <ReactApexChart
              type="bar"
            height={260}
              series={[{ name: 'Puntos por 10.000 adultos', data: [1.0, 3.7, 36.1, 71.7, 20.8] }]}
              options={{
                chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
                dataLabels: { enabled: false },
                xaxis: { categories: ['Oficinas', 'Cajeros', 'Corresponsales', 'Datáfonos', 'Cajas'], axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '10px' } } },
                yaxis: { labels: { formatter: (val) => val.toFixed(1) } },
                colors: ['#22c55e'],
                grid: { borderColor: 'rgba(148,163,184,0.3)' },
              }}
            />
          </div>
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="flex justify-between items-center mb-2 text-xs text-slate-400">
              <span>Puntos de atención por 1.000 km2</span>
              <span>Total: 4,8 a 339,9</span>
            </div>
            <ReactApexChart
              type="bar"
              height={220}
              series={[{ name: 'Puntos por 1.000 km²', data: [4.8, 17.7, 171.2, 339.9, 98.6] }]}
              options={{
                chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
                dataLabels: { enabled: false },
                xaxis: { categories: ['Oficinas', 'Cajeros', 'Corresponsales', 'Datáfonos', 'Cajas'], axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '10px' } } },
                yaxis: { labels: { formatter: (val) => val.toFixed(1) } },
                colors: ['#38bdf8'],
                grid: { borderColor: 'rgba(148,163,184,0.3)' },
              }}
            />
          </div>
        </div>

        <div className="grid gap-4 mb-4 md:grid-cols-2">
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Cajeros automáticos por ubicación</div>
            <div className="flex overflow-hidden h-3 rounded-full bg-white/10">
              <div className="h-full bg-blue-500" style={{ width: '40.6%' }} title="En oficina 40,6%"></div>
              <div className="h-full bg-slate-300" style={{ width: '59.4%' }} title="Fuera de oficina 59,4%"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-slate-300">
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>En oficina: 40,6%</div>
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 rounded-full bg-slate-300"></span>Fuera de oficina: 59,4%</div>
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Corresponsales no bancarios por ubicación</div>
            <div className="flex flex-col justify-center items-center">
              <div className="w-full h-56">
                <ReactApexChart
                  type="radialBar"
                  height="100%"
                  series={[24.9, 16.9, 9.4, 8.7, 7.8, 32.2]}
                  options={{
                    chart: { type: 'radialBar', foreColor: '#94a3b8', toolbar: { show: false } },
                    labels: ['Fábrica / Industria', 'Tienda', 'Bazar', 'Minimarket', 'Salud y afines', 'Otros'],
                    plotOptions: { radialBar: { hollow: { size: '25%' }, track: { background: 'rgba(15,23,42,0.9)' }, dataLabels: { name: { fontSize: '10px' }, value: { show: false }, total: { show: true, label: 'Participación', color: '#e2e8f0', formatter: () => '100%' } } } },
                    stroke: { lineCap: 'round' },
                    legend: { show: true, position: 'bottom', fontSize: '10px', markers: { width: 8, height: 8, radius: 999 } },
                    colors: ['#3b82f6', '#f59e0b', '#a855f7', '#22c55e', '#06b6d4', '#cbd5f5'],
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 mb-4 rounded-xl border bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Cobertura territorial por región (puntos por 10.000 adultos)</div>
          <div className="grid gap-4 md:grid-cols-[1.4fr_1.3fr]">
            <div className="relative aspect-[4/3] rounded-xl bg-slate-950/70 border border-white/10 overflow-hidden">
              <div className="absolute inset-x-3 top-2 flex justify-between text-[11px] text-slate-400">
                <span>Mapa esquemático de regiones</span>
                <span>Puntos 2025</span>
              </div>
              <div className="absolute left-3 top-8 bottom-10 w-[22%] rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-300/80 flex flex-col items-center justify-center text-[11px] font-semibold shadow-lg shadow-emerald-500/30">
                <span className="text-slate-950">Costa</span>
                <span className="text-slate-900/80 text-[10px]">118,5</span>
              </div>
              <div className="absolute left-[28%] right-[32%] top-6 bottom-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-300/80 flex flex-col items-center justify-center text-[11px] font-semibold shadow-lg shadow-sky-500/30">
                <span className="text-slate-950">Sierra</span>
                <span className="text-slate-900/80 text-[10px]">158,3</span>
              </div>
              <div className="absolute right-3 top-10 bottom-6 w-[26%] rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-300/80 flex flex-col items-center justify-center text-[11px] font-semibold shadow-lg shadow-indigo-500/30">
                <span className="text-slate-950">Oriente</span>
                <span className="text-slate-900/80 text-[10px]">73,2</span>
              </div>
              <div className="absolute left-5 bottom-3 w-[20%] h-[18%] rounded-lg bg-gradient-to-br from-blue-500 to-fuchsia-500 flex flex-col items-center justify-center text-[10px] font-semibold shadow-lg shadow-fuchsia-500/40">
                <span className="text-slate-50">Galápagos</span>
                <span className="text-slate-100 text-[10px]">355,0</span>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Costa o Litoral', v2024: 105.3, v2025: 118.5 },
                { label: 'Sierra o Interandina', v2024: 158.1, v2025: 158.3 },
                { label: 'Oriental o Amazónica', v2024: 40.9, v2025: 73.2 },
                { label: 'Insular o Galápagos', v2024: 91.2, v2025: 355.0 },
              ].map(region => (
                <div key={region.label} className="flex justify-between items-center">
                  <span>{region.label}</span>
                  <span className="text-slate-400">
                    {region.v2024}{' '}
                    <span className="mx-1 text-slate-500">→</span>
                    <span className="font-semibold text-white">{region.v2025}</span>
                  </span>
                </div>
              ))}
              <div className="pt-1 text-[11px] text-slate-500">
                La intensidad del color indica mayor cantidad de puntos por 10.000 adultos (2025).
              </div>
            </div>
          </div>
        </div>

        <div className="indicator-tables">
          <div className="grid gap-4 mb-4 md:grid-cols-2">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-2 text-xs text-slate-400">Densidad por 10.000 adultos (sep 2024 → sep 2025)</div>
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b text-slate-400 border-white/10">
                    <th className="py-1 pr-2 text-left">Tipo</th>
                    <th className="py-1 pr-2 text-left">2024</th>
                    <th className="py-1 pr-2 text-left">2025</th>
                    <th className="py-1 text-left">Δ%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10"><td className="py-1 pr-2">Oficinas</td><td className="py-1 pr-2">1,1</td><td className="py-1 pr-2">1,0</td><td className="py-1 text-rose-300">-3,6%</td></tr>
                  <tr className="border-b border-white/10"><td className="py-1 pr-2">Cajeros automáticos</td><td className="py-1 pr-2">3,7</td><td className="py-1 pr-2">3,7</td><td className="py-1 text-emerald-300">+1,0%</td></tr>
                  <tr className="border-b border-white/10"><td className="py-1 pr-2">Corresponsales</td><td className="py-1 pr-2">34,6</td><td className="py-1 pr-2">36,1</td><td className="py-1 text-emerald-300">+4,4%</td></tr>
                  <tr className="border-b border-white/10"><td className="py-1 pr-2">POS</td><td className="py-1 pr-2">65,8</td><td className="py-1 pr-2">71,7</td><td className="py-1 text-emerald-300">+8,9%</td></tr>
                  <tr><td className="py-1 pr-2">Cajas</td><td className="py-1 pr-2">19,1</td><td className="py-1 pr-2">20,8</td><td className="py-1 text-emerald-300">+9,0%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-2 text-xs text-slate-400">Densidad por 1.000 km2 (sep 2024 → sep 2025)</div>
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b text-slate-400 border-white/10">
                    <th className="py-1 pr-2 text-left">Tipo</th>
                    <th className="py-1 pr-2 text-left">2024</th>
                    <th className="py-1 pr-2 text-left">2025</th>
                    <th className="py-1 text-left">Δ%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10"><td className="py-1 pr-2">Oficinas</td><td className="py-1 pr-2">5,0</td><td className="py-1 pr-2">4,8</td><td className="py-1 text-rose-300">-2,3%</td></tr>
                  <tr className="border-b border-white/10"><td className="py-1 pr-2">Cajeros automáticos</td><td className="py-1 pr-2">17,3</td><td className="py-1 pr-2">17,7</td><td className="py-1 text-emerald-300">+2,3%</td></tr>
                  <tr className="border-b border-white/10"><td className="py-1 pr-2">Corresponsales</td><td className="py-1 pr-2">161,9</td><td className="py-1 pr-2">171,2</td><td className="py-1 text-emerald-300">+5,8%</td></tr>
                  <tr className="border-b border-white/10"><td className="py-1 pr-2">POS</td><td className="py-1 pr-2">308,1</td><td className="py-1 pr-2">339,9</td><td className="py-1 text-emerald-300">+10,3%</td></tr>
                  <tr><td className="py-1 pr-2">Cajas</td><td className="py-1 pr-2">89,4</td><td className="py-1 pr-2">98,6</td><td className="py-1 text-emerald-300">+10,4%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Fuente:
          <a
            href="https://www.superbancos.gob.ec/estadisticas/portalestudios/estudios-y-analisis/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-cyan-300 hover:underline"
          >
            Superintendencia de Bancos — Estudios y análisis (Boletines de Inclusión Financiera)
          </a>
        </div>
      </div>
    </div>
  );
}

function EventosView({
  stats,
  activeTab,
  setActiveTab,
  showEvents,
  setShowEvents,
  compactView,
  filtered,
  onOpenTimeline,
  onToggleVerticalTimeline,
}) {
  return (
    <section id="eventos-section" className="space-y-4 scroll-mt-28">
      <div className="flex flex-col gap-3 p-4 rounded-2xl border bg-white/5 border-white/10">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <h3 className="font-semibold">Línea de tiempo</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={onOpenTimeline}
              className="bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-full text-sm"
            >
              Visualizar timeline
            </button>
            <button
              onClick={onToggleVerticalTimeline}
              className="bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-full text-sm"
            >
              Comparativa
            </button>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
              {stats.shown} resultados
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 rounded-full text-xs border ${
                activeTab === 'timeline' ? 'bg-white/15 border-white/30' : 'border-white/10 hover:bg-white/10'
              }`}
            >
              Línea de tiempo (hitos)
            </button>
            <button
              onClick={() => setActiveTab('reference')}
              className={`px-3 py-1 rounded-full text-xs border ${
                activeTab === 'reference' ? 'bg-white/15 border-white/30' : 'border-white/10 hover:bg-white/10'
              }`}
            >
              Marco legal y estadísticas
            </button>
          </div>
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`px-3 py-1 rounded-full text-xs border transition ${
              showEvents ? 'bg-white/15 border-white/30' : 'bg-white/5 border-white/10'
            }`}
            title={showEvents ? 'Ocultar eventos' : 'Mostrar eventos'}
          >
            {showEvents ? '👁️ Ocultar eventos' : '👁️‍🗨️ Mostrar eventos'}
          </button>
        </div>
      </div>

      {showEvents && (
        <>
          {filtered.length === 0 ? (
            <div className="p-6 rounded-2xl border bg-white/5 border-white/10 text-slate-300">
              No hay eventos que coincidan con los filtros actuales.
            </div>
          ) : (
            <div className={`grid ${compactView ? 'gap-3' : 'gap-4'}`}>
              {filtered.map(event => (
                <EventCard
                  key={event.id || `${event.titulo}-${event.fecha}`}
                  event={event}
                  compact={compactView}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function IndicadoresView({
  indicatorQuery,
  setIndicatorQuery,
  indicatorCategory,
  setIndicatorCategory,
  indicatorCategories,
  indicatorShowAll,
  setIndicatorShowAll,
  filteredIndicatorSections,
  getIndicatorView,
}) {
  return (
    <section id="indicadores-section" className="space-y-4 scroll-mt-28">
      <div className="p-4 rounded-2xl border bg-white/5 border-white/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold">Panel de indicadores</h4>
            <p className="text-xs text-slate-400">Filtra por tema o busca una gráfica específica.</p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:flex-row lg:w-auto">
            <div className="w-full sm:w-72">
              <label className="text-xs text-slate-400">Buscar indicador</label>
              <input
                value={indicatorQuery}
                onChange={e => setIndicatorQuery(e.target.value)}
                placeholder="Ej: EGDI, FirmaEC, transacciones, M2..."
                className="px-3 py-2 mt-1 w-full text-sm rounded-xl border bg-white/5 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="w-full sm:w-56">
              <label className="text-xs text-slate-400">Categoría</label>
              <select
                value={indicatorCategory}
                onChange={e => setIndicatorCategory(e.target.value)}
                className="px-3 py-2 mt-1 w-full text-sm text-white rounded-xl border bg-white/5 border-white/10"
              >
                {indicatorCategories.map(cat => (
                  <option key={cat} value={cat} className="bg-white text-slate-900">
                    {cat === 'all' ? 'Todas' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex gap-2 items-center text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={indicatorShowAll}
                  onChange={e => setIndicatorShowAll(e.target.checked)}
                />
                Mostrar todas las vistas
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {indicatorCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setIndicatorCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                indicatorCategory === cat ? 'bg-white/20 border-white/30' : 'bg-white/5 border-white/10'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>

        <div className="grid gap-3 mt-4 md:grid-cols-3">
          {filteredIndicatorSections.map(section => (
            <button
              key={section.id}
              onClick={() =>
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              title={section.summary}
              className="p-3 text-left rounded-xl border transition bg-white/5 border-white/10 hover:border-cyan-400/50"
            >
              <div className="text-xs text-slate-400">{section.category}</div>
              <div className="mt-1 text-sm font-semibold text-white">{section.title}</div>
              <div className="overflow-hidden mt-3 h-1 rounded-full bg-white/10">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400" style={{ width: '60%' }}></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {filteredIndicatorSections.length === 0 ? (
        <div className="p-6 rounded-2xl border bg-white/5 border-white/10 text-slate-300">
          No se encontraron indicadores con los filtros actuales.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredIndicatorSections.map(section => {
            const view = indicatorShowAll ? 'full' : getIndicatorView(section.id);
            return (
              <section
                key={section.id}
                id={section.id}
                className={`space-y-4 scroll-mt-24 indicator-view-${view}`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">{section.title}</h4>
                    <p className="text-xs text-slate-400">{section.category}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-2 py-1 text-xs rounded-full border bg-white/10 border-white/10">
                      {section.category}
                    </span>
                  </div>
                </div>
                {section.content}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}

function InformeView() {
  return (
    <section id="informe-section" className="space-y-4 scroll-mt-28">
      <ReportInteractive />
    </section>
  );
}

function SintesisView({ digitalizacionSummaryContent }) {
  return (
    <section id="sintesis-section" className="space-y-4 scroll-mt-28">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">¿Qué tan digitalizado está Ecuador?</h3>
          <p className="text-xs text-slate-400">
            Síntesis con base en EGDI, conectividad y servicios digitales.
          </p>
        </div>
        <span className="px-2 py-1 text-xs rounded-full border bg-white/10 border-white/10">Síntesis</span>
      </div>
      {digitalizacionSummaryContent}
    </section>
  );
}

function BibliografiaView({ showBibliography, setShowBibliography, filtered, buildAPA }) {
  return (
    <section
      id="bibliografia-section"
      className="p-4 rounded-2xl border bg-white/5 border-white/10 scroll-mt-28"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Bibliografía</h3>
        <button
          onClick={() => setShowBibliography(prev => !prev)}
          className="px-2 py-1 text-xs rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
          title={showBibliography ? 'Ocultar bibliografía' : 'Mostrar bibliografía'}
        >
          {showBibliography ? '▲' : '▼'}
        </button>
      </div>
      {showBibliography && (
        <div className="p-3 mt-3 text-xs whitespace-pre-wrap rounded-xl border bg-slate-950/60 border-white/10 text-slate-300">
          {filtered.map(buildAPA).filter(Boolean).join('\n\n') || '—'}
        </div>
      )}
    </section>
  );
}

function SidebarIcon({ id, active }) {
  const cls = `w-5 h-5 ${active ? 'text-cyan-300' : 'text-slate-400'}`;
  if (id === 'eventos') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 16l8-8" />
      </svg>
    );
  }
  if (id === 'indicadores') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="4" y="10" width="3" height="8" rx="1" />
        <rect x="10" y="6" width="3" height="12" rx="1" />
        <rect x="16" y="12" width="3" height="6" rx="1" />
      </svg>
    );
  }
  if (id === 'informe') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 4h12l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
        <path d="M16 4v6h6" />
      </svg>
    );
  }
  if (id === 'conclusiones') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2a7 7 0 0 1 7 7c0 5-4 8-7 13-3-5-7-8-7-13a7 7 0 0 1 7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function SidebarNav({ activeTopic, onItemClick }) {
  const groups = [
    {
      title: 'Análisis',
      items: [
        { id: 'eventos', label: 'Eventos', description: 'Línea de tiempo' },
        { id: 'indicadores', label: 'Indicadores', description: 'Panel de datos' },
        { id: 'informe', label: 'Análisis', description: 'Marco teórico' },
      ],
    },
    {
      title: 'Otros',
      items: [
        { id: 'conclusiones', label: 'Síntesis', description: 'Conclusiones' },
        { id: 'bibliografia', label: 'Bibliografía', description: 'Fuentes' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.title} className="space-y-2">
          <div className="px-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500">
            {group.title}
          </div>
          <div className="flex flex-col gap-1.5 text-[13px]">
            {group.items.map(topic => {
              const isActive = activeTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onItemClick(topic.id)}
                  className={`flex w-full items-center gap-3 rounded-xl mx-4 px-4 py-2 text-xs transition ${
                    isActive ? 'ring-1 bg-white/10 ring-cyan-400/40' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-center items-center w-7 h-7 rounded-lg border border-white/10 bg-white/5">
                    <SidebarIcon id={topic.id} active={isActive} />
                  </div>
                  <div className="flex-1">
                    <div className={`text-[11px] font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {topic.label}
                    </div>
                    <div className="text-[11px] text-slate-500">{topic.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const {
    activeTab,
    setActiveTab,
    activeEvents,
    filtered,
    metadata,
  } = useEvents();

  const location = useLocation();
  const hash = (location.hash || '').replace('#', '');
  const sidebarTopics = ['eventos', 'indicadores', 'informe', 'conclusiones', 'bibliografia'];
  const initialTopic = sidebarTopics.includes(hash) ? hash : 'eventos';
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isVerticalTimelineOpen, setIsVerticalTimelineOpen] = useState(false);
  const [compactView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEvents, setShowEvents] = useState(true);
  const [showBibliography, setShowBibliography] = useState(true);
  const [activeTopic, setActiveTopic] = useState(initialTopic);
  const [indicatorQuery, setIndicatorQuery] = useState('');
  const [indicatorCategory, setIndicatorCategory] = useState('all');
  const [indicatorViews, setIndicatorViews] = useState({});
  const [indicatorShowAll, setIndicatorShowAll] = useState(false);
  const [firmaStats, setFirmaStats] = useState([]);
  const [firmaTotal, setFirmaTotal] = useState(0);

  const stats = useMemo(() => {
    const total = activeEvents.length;
    const shown = filtered.length;
    const withSources = filtered.filter(e => (e.fuentes || []).length > 0).length;
    return { total, shown, withSources };
  }, [activeEvents, filtered]);

  useEffect(() => {
    const parseFirmaLine = (line) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('"')) {
        const end = trimmed.indexOf('",');
        if (end !== -1) {
          const system = trimmed.slice(1, end);
          const totalStr = trimmed.slice(end + 2);
          const total = Number(totalStr.replace(/[^0-9]/g, ''));
          if (!system || Number.isNaN(total)) return null;
          return { system, total };
        }
      }
      const [system, totalStr] = trimmed.split(',');
      if (!system || !totalStr) return null;
      const total = Number(totalStr.replace(/[^0-9]/g, ''));
      if (Number.isNaN(total)) return null;
      return { system, total };
    };

    fetch(`${import.meta.env.BASE_URL}Estad%C3%ADsticas%20FirmaEC_FirmaEC%20Escritorio_Tabla.csv`)
      .then(res => res.text())
      .then(text => {
        const lines = text.split(/\r?\n/).slice(1);
        const rows = lines.map(parseFirmaLine).filter(Boolean);
        setFirmaStats(rows);
        const total = rows.reduce((sum, item) => sum + item.total, 0);
        setFirmaTotal(total);
      })
      .catch(() => {
        setFirmaStats([]);
        setFirmaTotal(0);
      });
  }, []);

  // Eliminado efecto que cambiaba sincronamente el estado según location.hash.
  // El estado inicial ahora se deriva de location.hash y el usuario puede cambiarlo después.

  const firmaTop = useMemo(() => {
    return [...firmaStats]
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [firmaStats]);

  const firmaMax = useMemo(() => {
    if (!firmaTop.length) return 1;
    return Math.max(...firmaTop.map(item => item.total));
  }, [firmaTop]);

  const title = metadata?.title || 'Nivel de Digitalización en Ecuador';
  const document = metadata?.document;

  const formatNumber = useCallback((value) => {
    return new Intl.NumberFormat('es-EC').format(value || 0);
  }, []);

  const getIndicatorView = (id) => indicatorViews[id] || 'full';
  const setIndicatorView = (id, view) => {
    setIndicatorViews(prev => ({ ...prev, [id]: view }));
  };

  const digitalizacionSummaryContent = useMemo(() => (
    <div className="space-y-6">
      <div className="p-5 space-y-3 rounded-2xl border bg-white/5 border-white/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs tracking-wide uppercase text-slate-400">Síntesis narrativa</div>
            <h3 className="text-lg font-semibold">De la primera transacción digital al ecosistema regional</h3>
          </div>
          <div className="inline-flex gap-2 items-center px-3 py-1 text-xs rounded-full border bg-slate-900/80 border-white/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span>2002 → 2026 · Ecuador como laboratorio de transformación bancaria</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-2xl border bg-slate-900/80 border-violet-500/40">
            <div className="mb-1 text-xs font-semibold text-violet-300">Etapa 1 · Fundamentos legales</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Entre 2002 y 2016 se consolida el marco legal: Ley de Comercio Electrónico,
              operatividad de la firma electrónica, Código Ingenios y leyes de protección
              de datos. Esta capa normativa habilita todo lo que viene después.
            </p>
          </div>
          <div className="p-4 rounded-2xl border bg-slate-900/80 border-cyan-500/40">
            <div className="mb-1 text-xs font-semibold text-cyan-300">Etapa 2 · Innovación fintech</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Entre 2014 y 2022 aparecen PayPhone, Kushki, DeUna y PeiGo. El sistema
              financiero pasa de ver la tecnología como canal de apoyo a convertirla en
              el corazón del modelo de negocio.
            </p>
          </div>
          <div className="p-4 rounded-2xl border bg-slate-900/80 border-emerald-500/40">
            <div className="mb-1 text-xs font-semibold text-emerald-300">Etapa 3 · Masificación digital</div>
            <p className="text-xs leading-relaxed text-slate-300">
              La pandemia, la obligatoriedad de la facturación electrónica y las nuevas
              leyes (Fintech, Transformación Digital) provocan que las transacciones
              digitales superen a las físicas y que la firma electrónica sea masiva.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 rounded-2xl border bg-white/5 border-white/10">
        <div className="flex gap-3 justify-between items-center">
          <div>
            <div className="text-xs tracking-wide uppercase text-slate-400">Resumen visual</div>
            <h3 className="text-sm font-semibold">Línea de tiempo condensada: hitos clave por etapa</h3>
          </div>
          <div className="text-[10px] text-slate-400 hidden md:block">
            Basado en los mismos eventos que la línea de tiempo interactiva
          </div>
        </div>
        <div className="overflow-x-auto relative">
          <div className="min-w-[600px]">
            <div className="relative mb-6 h-1 rounded-full bg-slate-700">
              <div className="absolute inset-y-0 left-0 right-[35%] bg-gradient-to-r from-violet-500/70 via-cyan-500/70 to-emerald-500/70 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-xs">
              <div className="space-y-3">
                <div className="inline-flex gap-2 items-center px-2 py-1 text-violet-200 rounded-full border bg-violet-500/10 border-violet-500/40">
                  <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                  <span>2002–2010 · Marco jurídico</span>
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li>• Ley de Comercio Electrónico y firma electrónica.</li>
                  <li>• Banco Central como primera entidad certificadora.</li>
                  <li>• Nace MINTEL y empiezan comprobantes electrónicos.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="inline-flex gap-2 items-center px-2 py-1 text-cyan-200 rounded-full border bg-cyan-500/10 border-cyan-500/40">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>2014–2019 · Plataformas</span>
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li>• Surgen PayPhone y Kushki como infraestructura de pagos.</li>
                  <li>• Bancos migran a apps nativas y canales digitales.</li>
                  <li>• Código Ingenios empuja software libre y conectividad.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="inline-flex gap-2 items-center px-2 py-1 text-emerald-200 rounded-full border bg-emerald-500/10 border-emerald-500/40">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>2020–2026 · Dominio digital</span>
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li>• Pandemia acelera el uso: digital supera a físico en 2021.</li>
                  <li>• Ley Fintech, Transformación Digital y normas de pago dan estabilidad.</li>
                  <li>• Se proyecta integración de IA y ciberseguridad como estándar.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 rounded-2xl border bg-white/5 border-white/10">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div>
            <div className="text-xs tracking-wide uppercase text-slate-400">Indicadores ancla</div>
            <h3 className="text-sm font-semibold">Qué tan preparado está el país para lo que viene</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/40">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> EGDI 2024
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/40">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span> Internet hogares
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Firma electrónica
            </span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-gradient-to-br rounded-2xl border from-blue-600/20 to-blue-600/5 border-blue-500/30">
            <div className="text-xs font-semibold text-blue-300">EGDI Ecuador (2024)</div>
            <div className="text-3xl font-bold text-blue-300">0,7800</div>
            <p className="text-xs text-slate-400">Nivel ALTO · Puesto 67</p>
          </div>
          <div className="p-4 bg-gradient-to-br rounded-2xl border from-cyan-600/20 to-cyan-600/5 border-cyan-500/30">
            <div className="text-xs font-semibold text-cyan-300">Internet en hogares (EC)</div>
            <div className="text-3xl font-bold text-cyan-300">71,3%</div>
            <p className="text-xs text-slate-400">ENEMDU 2025</p>
          </div>
          <div className="p-4 bg-gradient-to-br rounded-2xl border from-emerald-600/20 to-emerald-600/5 border-emerald-500/30">
            <div className="text-xs font-semibold text-emerald-300">Firma electrónica acumulada</div>
            <div className="text-2xl font-bold text-emerald-300">{formatNumber(firmaTotal)} firmas</div>
            <p className="mt-1 text-xs text-slate-400">Sistema líder: {firmaTop[0]?.system || '—'}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div className="p-4 rounded-2xl border bg-slate-950/60 border-white/10">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-slate-400">Comparación rápida EGDI 2024</div>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/10">
                Ecuador vs Chile y Canadá
              </span>
            </div>
            <EgdiComparisonChart />
          </div>
          <div className="p-4 rounded-2xl border bg-slate-950/60 border-white/10">
            <div className="mb-2 text-xs text-slate-400">Top sistemas de FirmaEC (muestra principal)</div>
            <FirmaTopChart data={firmaTop.slice(0, 5)} />
          </div>
        </div>

        <div className="p-4 text-sm rounded-xl border bg-slate-950/60 border-white/10 text-slate-300">
          <p><span className="font-semibold">Conclusión:</span> Con un EGDI de 0,7800 (nivel alto), Ecuador ya muestra madurez en gobierno digital. Esto se refleja en la oferta de servicios: Gob.ec concentra miles de trámites y, en el sistema financiero, el canal electrónico ya representa 76,7% de las transacciones (sep 2025). Además, el uso de firma electrónica es transversal, con un volumen alto de firmas en sistemas públicos y privados. La brecha con Canadá se explica principalmente por conectividad: 71,3% de hogares con internet en Ecuador frente a 96,1% en Canadá, lo que limita el alcance real de los servicios. En síntesis, el país tiene una base normativa y operativa fuerte, pero su impacto depende de ampliar cobertura y fortalecer la interoperabilidad institucional.</p>
        </div>
      </div>

      <div className="indicator-tables">
        <div className="p-4 rounded-xl border bg-white/5 border-white/10">
          <div className="mb-3 text-xs text-slate-400">Síntesis de indicadores clave</div>
          <table className="w-full text-xs text-slate-300">
            <thead>
              <tr className="border-b text-slate-400 border-white/10">
                <th className="py-1 pr-2 text-left">Indicador</th>
                <th className="py-1 pr-2 text-left">Ecuador</th>
                <th className="py-1 text-left">Comparación</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">EGDI 2024</td>
                <td className="py-1 pr-2">0,7800 (ALTO)</td>
                <td className="py-1">Canadá 0,8452</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Internet hogares</td>
                <td className="py-1 pr-2">71,3%</td>
                <td className="py-1">Canadá 96,1%</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Canal electrónico</td>
                <td className="py-1 pr-2">76,7%</td>
                <td className="py-1">Físico 23,3%</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-1 pr-2">Trámites Gob.ec</td>
                <td className="py-1 pr-2">7000</td>
                <td className="py-1">Cobertura nacional</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">FirmaEC</td>
                <td className="py-1 pr-2">{formatNumber(firmaTotal)} firmas</td>
                <td className="py-1">Uso transversal</td>
              </tr>
            </tbody>
          </table>
        </div>
 
      </div>
    </div>
  ), [firmaTotal, firmaTop, formatNumber]);

  function handleTopicClick(topicId) {
    const nextHash = `#${topicId}`;
    window.history.replaceState(null, '', nextHash);

    if (topicId === 'resumen') {
      setActiveTopic('resumen');
      window.requestAnimationFrame(() => {
        const el = document.getElementById('resumen');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    setActiveTopic(topicId);
    window.requestAnimationFrame(() => {
      const sectionId = `${topicId}-section`;
      const el = document.getElementById(sectionId) || document.getElementById('contenido-principal');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function InclusionFinancieraSection() {
    return (
      <div className="p-4 rounded-2xl border bg-white/5 border-white/10">
        <div className="flex gap-3 justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold">Inclusión financiera — créditos, tarjetas y transacciones</h4>
            <p className="text-xs text-slate-400">Boletín Trimestral de Inclusión Financiera (sep 2025)</p>
          </div>
          <span className={countryChipClasses('Ecuador')}>Ecuador</span>
        </div>

        <div className="grid gap-3 mb-4 indicator-charts md:grid-cols-5">
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Transacciones (ene-sep 2025)</div>
            <div className="text-xl font-semibold">4,343 millones</div>
            <div className="text-xs text-emerald-300">+14,3% anual</div>
          </div>
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Canales electrónicos</div>
            <div className="text-xl font-semibold">76,7%</div>
            <div className="text-xs text-emerald-300">+17,8% anual</div>
          </div>
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Banca móvil</div>
            <div className="text-xl font-semibold">+32,5%</div>
            <div className="text-xs text-slate-500">Incremento anual</div>
          </div>
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Banca electrónica</div>
            <div className="text-xl font-semibold">-0,1%</div>
            <div className="text-xs text-rose-300">Decrecimiento anual</div>
          </div>
          <div className="p-3 rounded-xl border bg-white/5 border-white/10">
            <div className="text-xs text-slate-400">Participación física</div>
            <div className="text-xl font-semibold">23,3%</div>
            <div className="text-xs text-slate-500">Sep 2025</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4 mb-4">
          <div className="p-4 rounded-xl border indicator-charts bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Participación por tipo de canal (sep 2025)</div>
            <ReactApexChart
              type="donut"
              height={260}
              series={[49.4, 23.22, 9.87, 7.08, 6.29, 3.75]}
              options={{
                chart: { type: 'donut', foreColor: '#94a3b8', toolbar: { show: false } },
                labels: [
                  'Banca celular',
                  'Oficina',
                  'Internet',
                  'Datáfono POS',
                  'Cajeros automáticos',
                  'Corresponsal no bancario',
                ],
                legend: { position: 'bottom', fontSize: '10px' },
                dataLabels: { enabled: false },
                colors: ['#3b82f6', '#f59e0b', '#22c55e', '#06b6d4', '#a855f7', '#ec4899'],
                plotOptions: { pie: { donut: { size: '65%' } } },
              }}
            />
          </div>
          <div className="p-4 rounded-xl border indicator-tables bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Transacciones por tipo de canal</div>
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr className="border-b text-slate-400 border-white/10">
                  <th className="py-1 pr-2 text-left">Canal</th>
                  <th className="py-1 pr-2 text-left">Sep 2024</th>
                  <th className="py-1 pr-2 text-left">Sep 2025</th>
                  <th className="py-1 text-left">Part. 2025</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-1 pr-2">Electrónico</td>
                  <td className="py-1 pr-2">2.829</td>
                  <td className="py-1 pr-2">3.331</td>
                  <td className="py-1">76,7%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-1 pr-2">Físico</td>
                  <td className="py-1 pr-2">972</td>
                  <td className="py-1 pr-2">1.011</td>
                  <td className="py-1">23,3%</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2">Total</td>
                  <td className="py-1 pr-2">3.801</td>
                  <td className="py-1 pr-2">4.343</td>
                  <td className="py-1">100%</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 mb-2 text-xs text-slate-400">Transacciones por canal</div>
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr className="border-b text-slate-400 border-white/10">
                  <th className="py-1 pr-2 text-left">Canal</th>
                  <th className="py-1 pr-2 text-left">Sep 2024</th>
                  <th className="py-1 pr-2 text-left">Sep 2025</th>
                  <th className="py-1 text-left">Part. 2025</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-1 pr-2">Internet</td>
                  <td className="py-1 pr-2">428</td>
                  <td className="py-1 pr-2">429</td>
                  <td className="py-1">9,9%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-1 pr-2">Oficina</td>
                  <td className="py-1 pr-2">968</td>
                  <td className="py-1 pr-2">1.008</td>
                  <td className="py-1">23,2%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-1 pr-2">Banca celular</td>
                  <td className="py-1 pr-2">1.620</td>
                  <td className="py-1 pr-2">2.145</td>
                  <td className="py-1">49,4%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-1 pr-2">Otros</td>
                  <td className="py-1 pr-2">785</td>
                  <td className="py-1 pr-2">760</td>
                  <td className="py-1">17,5%</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2">Total</td>
                  <td className="py-1 pr-2">3.801</td>
                  <td className="py-1 pr-2">4.343</td>
                  <td className="py-1">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 mb-4 indicator-charts lg:grid-cols-2 xl:grid-cols-3">
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Adultos con tarjeta de crédito</div>
            <ReactApexChart
              type="donut"
              height={190}
              series={[30.9, 69.1]}
              options={{
                chart: { type: 'donut', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                labels: ['Tiene', 'No tiene'],
                legend: { position: 'bottom', fontSize: '10px' },
                dataLabels: { enabled: false },
                colors: ['#3b82f6', '#f59e0b'],
                plotOptions: { pie: { donut: { size: '70%' } } },
              }}
            />
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-slate-300">
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Tiene: 30,9%</div>
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>No tiene: 69,1%</div>
            </div>
            <div className="mb-2 text-xs text-slate-400">Por sexo</div>
            <ReactApexChart
              type="bar"
              height={150}
              series={[
                { name: 'Hombres', data: [34.86] },
                { name: 'Mujeres', data: [27.11] },
              ]}
              options={{
                chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, stacked: false },
                plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
                dataLabels: { enabled: false },
                xaxis: { categories: ['Tarjeta de crédito'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { formatter: (val) => `${val.toFixed(0)}%` } },
                legend: { position: 'bottom', fontSize: '10px' },
                colors: ['#3b82f6', '#ec4899'],
              }}
            />
            <div className="mt-4 mb-2 text-xs text-slate-400">Por edad (participación)</div>
            <ReactApexChart
              type="radar"
              height={210}
              series={[
                { name: 'Hombres', data: [4.6, 49.3, 35.0, 11.1] },
                { name: 'Mujeres', data: [4.2, 50.9, 34.3, 10.6] },
              ]}
              options={{
                chart: { type: 'radar', foreColor: '#94a3b8', toolbar: { show: false } },
                xaxis: { categories: ['≤24', '25–44', '45–64', '65+'], labels: { style: { fontSize: '10px' } } },
                yaxis: { show: true, labels: { formatter: (val) => `${val.toFixed(0)}%` } },
                stroke: { width: 2 },
                fill: { opacity: 0.2 },
                colors: ['#3b82f6', '#ec4899'],
                legend: { position: 'bottom', fontSize: '10px' },
              }}
            />
          </div>
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Consumo — adultos con crédito</div>
            <div className="w-full h-40 sm:h-44 md:h-52 lg:h-60">
              <ReactApexChart
                type="polarArea"
                height="100%"
                series={[11.0, 89.0]}
                options={{
                  chart: { type: 'polarArea', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                  labels: ['Tiene', 'No tiene'],
                  legend: { show: false },
                  dataLabels: { enabled: false },
                  stroke: { width: 1, colors: ['#0f172a'] },
                  fill: { opacity: 0.75 },
                  colors: ['#3b82f6', '#f59e0b'],
                  responsive: CHART_RESP.responsive,
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs text-slate-300">
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Tiene: 11,0%</div>
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>No tiene: 89,0%</div>
            </div>
            <div className="mb-1 text-xs text-slate-400">Por sexo</div>
            <ReactApexChart
              type="bar"
              height={150}
              series={[
                { name: 'Hombres', data: [11.66] },
                { name: 'Mujeres', data: [10.33] },
              ]}
              options={{
                chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, stacked: false },
                plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
                dataLabels: { enabled: false },
                xaxis: { categories: ['Consumo'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { formatter: (val) => `${val.toFixed(0)}%` } },
                legend: { position: 'bottom', fontSize: '10px' },
                colors: ['#3b82f6', '#ec4899'],
              }}
            />
            <div className="mt-3 mb-1 text-xs text-slate-400">Por edad</div>
            <div className="w-full h-44 sm:h-48 md:h-56 lg:h-64">
              <ReactApexChart
                type="radar"
                height="100%"
                series={[
                  { name: 'Hombres', data: [8.0, 58.2, 28.2, 5.6] },
                  { name: 'Mujeres', data: [5.9, 56.6, 31.2, 6.3] },
                ]}
                options={{
                  chart: { type: 'radar', foreColor: '#94a3b8', toolbar: { show: false } },
                  xaxis: { categories: ['≤24', '25–44', '45–64', '65+'], labels: { style: { fontSize: '10px' } } },
                  yaxis: { show: true, labels: { formatter: (val) => `${val.toFixed(0)}%` } },
                  stroke: { width: 2 },
                  fill: { opacity: 0.2 },
                  colors: ['#3b82f6', '#ec4899'],
                  legend: { position: 'bottom', fontSize: '10px' },
                  responsive: CHART_RESP.responsive,
                }}
              />
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Microcréditos — adultos con crédito</div>
            <div className="w-full h-40 sm:h-44 md:h-52 lg:h-60">
              <ReactApexChart
                type="polarArea"
                height="100%"
                series={[3.8, 96.2]}
                options={{
                  chart: { type: 'polarArea', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                  labels: ['Tiene', 'No tiene'],
                  legend: { show: false },
                  dataLabels: { enabled: false },
                  stroke: { width: 1, colors: ['#0f172a'] },
                  fill: { opacity: 0.75 },
                  colors: ['#3b82f6', '#f97316'],
                  responsive: CHART_RESP.responsive,
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs text-slate-300">
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Tiene: 3,8%</div>
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>No tiene: 96,2%</div>
            </div>
            <div className="mb-1 text-xs text-slate-400">Por sexo</div>
            <ReactApexChart
              type="bar"
              height={150}
              series={[
                { name: 'Hombres', data: [4.70] },
                { name: 'Mujeres', data: [2.89] },
              ]}
              options={{
                chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, stacked: false },
                plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
                dataLabels: { enabled: false },
                xaxis: { categories: ['Microcréditos'], labels: { style: { fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { labels: { formatter: (val) => `${val.toFixed(0)}%` } },
                legend: { position: 'bottom', fontSize: '10px' },
                colors: ['#3b82f6', '#ec4899'],
              }}
            />
            <div className="mt-3 mb-1 text-xs text-slate-400">Por edad</div>
            <ReactApexChart
              type="radar"
              height={210}
              series={[
                { name: 'Hombres', data: [14.2, 47.3, 32.5, 6.1] },
                { name: 'Mujeres', data: [11.7, 51.5, 32.1, 4.8] },
              ]}
              options={{
                chart: { type: 'radar', foreColor: '#94a3b8', toolbar: { show: false } },
                xaxis: { categories: ['≤24', '25–44', '45–64', '65+'], labels: { style: { fontSize: '10px' } } },
                yaxis: { show: true, labels: { formatter: (val) => `${val.toFixed(0)}%` } },
                stroke: { width: 2 },
                fill: { opacity: 0.2 },
                colors: ['#3b82f6', '#ec4899'],
                legend: { position: 'bottom', fontSize: '10px' },
              }}
            />
          </div>
        </div>

        <div className="grid gap-4 mb-4 indicator-charts md:grid-cols-2">
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Tarjetas de débito</div>
            <div className="flex justify-between items-center mb-2 text-sm">
              <span>10,6 millones</span>
              <span className="text-emerald-300">+9,6% anual</span>
            </div>
            <div className="flex overflow-hidden h-3 rounded-full bg-white/10">
              <div className="h-full bg-blue-500" style={{ width: '50.8%' }} title="Hombres 50,8%"></div>
              <div className="h-full bg-pink-400" style={{ width: '49.2%' }} title="Mujeres 49,2%"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-slate-300">
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Hombres: 50,8%</div>
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-pink-400 rounded-full"></span>Mujeres: 49,2%</div>
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Tarjetas de crédito</div>
            <div className="flex justify-between items-center mb-2 text-sm">
              <span>4,2 millones</span>
              <span className="text-emerald-300">+6,1% anual</span>
            </div>
            <div className="flex overflow-hidden h-3 rounded-full bg-white/10">
              <div className="h-full bg-blue-500" style={{ width: '55.2%' }} title="Hombres 55,2%"></div>
              <div className="h-full bg-pink-400" style={{ width: '44.8%' }} title="Mujeres 44,8%"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-slate-300">
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>Hombres: 55,2%</div>
              <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-pink-400 rounded-full"></span>Mujeres: 44,8%</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Fuente:
          <a
            href="https://www.superbancos.gob.ec/estadisticas/portalestudios/estudios-y-analisis/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-cyan-300 hover:underline"
          >
            Superintendencia de Bancos — Boletín Trimestral de Inclusión Financiera (sep 2025)
          </a>
        </div>
      </div>
    );
  }

  function PresenciaFinancieraSection() {
    return (
      <div className="p-4 rounded-2xl border bg-white/5 border-white/10">
        <div className="space-y-4 indicator-charts">
          <div className="flex gap-3 justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold">Presencia financiera — Superintendencia de Bancos</h4>
              <p className="text-xs text-slate-400">Boletín de Inclusión Financiera (sep 2025)</p>
            </div>
            <span className={countryChipClasses('Ecuador')}>Ecuador</span>
          </div>

          <div className="grid gap-3 mb-4 md:grid-cols-5">
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Puntos de atención</div>
              <div className="text-xl font-semibold">179.275</div>
              <div className="text-xs text-emerald-300">+8,7% anual</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Oficinas</div>
              <div className="text-xl font-semibold">1.374</div>
              <div className="text-xs text-rose-300">-2,3% anual</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Cajeros automáticos</div>
              <div className="text-xl font-semibold">5.022</div>
              <div className="text-xs text-emerald-300">+2,8% anual</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Corresponsales</div>
              <div className="text-xl font-semibold">48.536</div>
              <div className="text-xs text-emerald-300">+6,8% anual</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Datáfonos y cajas</div>
              <div className="text-xl font-semibold">124.343</div>
              <div className="text-xs text-emerald-300">+10,6% anual</div>
            </div>
          </div>

          <div className="grid gap-4 mb-4 md:grid-cols-2">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="flex justify-between items-center mb-2 text-xs text-slate-400">
                <span>Puntos de atención por 10.000 adultos</span>
                <span>Total: 133,3 (+7,35%)</span>
              </div>
              <ReactApexChart
                type="bar"
                height={220}
                series={[{ name: 'Puntos por 10.000 adultos', data: [1.0, 3.7, 36.1, 71.7, 20.8] }]}
                options={{
                  chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                  plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
                  dataLabels: { enabled: false },
                  xaxis: { categories: ['Oficinas', 'Cajeros', 'Corresponsales', 'Datáfonos', 'Cajas'], axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '10px' } } },
                  yaxis: { labels: { formatter: (val) => val.toFixed(1) } },
                  colors: ['#22c55e'],
                  grid: { borderColor: 'rgba(148,163,184,0.3)' },
                  tooltip: {
                    theme: 'dark',
                    y: {
                      formatter: (val) => `${val.toFixed(1)} puntos por 10.000 adultos`,
                    },
                  },
                }}
              />
            </div>
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="flex justify-between items-center mb-2 text-xs text-slate-400">
                <span>Puntos de atención por 1.000 km2</span>
                <span>Total: 4,8 a 339,9</span>
              </div>
              <ReactApexChart
                type="bar"
            height={260}
                series={[{ name: 'Puntos por 1.000 km²', data: [4.8, 17.7, 171.2, 339.9, 98.6] }]}
                options={{
                  chart: { type: 'bar', foreColor: '#94a3b8', toolbar: { show: false }, sparkline: { enabled: true } },
                  plotOptions: { bar: { horizontal: false, borderRadius: 6, columnWidth: '45%' } },
                  dataLabels: { enabled: false },
                  xaxis: { categories: ['Oficinas', 'Cajeros', 'Corresponsales', 'Datáfonos', 'Cajas'], axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '10px' } } },
                  yaxis: { labels: { formatter: (val) => val.toFixed(1) } },
                  colors: ['#38bdf8'],
                  grid: { borderColor: 'rgba(148,163,184,0.3)' },
                  tooltip: {
                    theme: 'dark',
                    y: {
                      formatter: (val) => `${val.toFixed(1)} puntos por 1.000 km²`,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 mb-4 md:grid-cols-2">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Cajeros automáticos por ubicación</div>
              <div className="flex overflow-hidden h-3 rounded-full bg-white/10">
                <div className="h-full bg-blue-500" style={{ width: '40.6%' }} title="En oficina 40,6%"></div>
                <div className="h-full bg-slate-300" style={{ width: '59.4%' }} title="Fuera de oficina 59,4%"></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-slate-300">
                <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>En oficina: 40,6%</div>
                <div className="flex gap-2 items-center"><span className="inline-block w-2 h-2 rounded-full bg-slate-300"></span>Fuera de oficina: 59,4%</div>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Corresponsales no bancarios por ubicación</div>
              <div className="flex flex-col justify-center items-center">
                <div className="w-full h-56">
                  <ReactApexChart
                    type="radialBar"
                    height="100%"
                    series={[24.9, 16.9, 9.4, 8.7, 7.8, 32.2]}
                    options={{
                      chart: { type: 'radialBar', foreColor: '#94a3b8', toolbar: { show: false } },
                      labels: ['Fábrica / Industria', 'Tienda', 'Bazar', 'Minimarket', 'Salud y afines', 'Otros'],
                      plotOptions: { radialBar: { hollow: { size: '25%' }, track: { background: 'rgba(15,23,42,0.9)' }, dataLabels: { name: { fontSize: '10px' }, value: { show: false }, total: { show: true, label: 'Participación', color: '#e2e8f0', formatter: () => '100%' } } } },
                      stroke: { lineCap: 'round' },
                      legend: { show: true, position: 'bottom', fontSize: '10px', markers: { width: 8, height: 8, radius: 999 } },
                      colors: ['#3b82f6', '#f59e0b', '#a855f7', '#22c55e', '#06b6d4', '#cbd5f5'],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 mb-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Cobertura territorial por región (puntos por 10.000 adultos)</div>
            <div className="grid gap-4 md:grid-cols-[1.4fr_1.3fr]">
              <div className="relative aspect-[4/3] rounded-xl bg-slate-950/70 border border-white/10 overflow-hidden">
                <div className="absolute inset-x-3 top-2 flex justify-between text-[11px] text-slate-400">
                  <span>Mapa esquemático de regiones</span>
                  <span>Puntos 2025</span>
                </div>
                <div className="absolute left-3 top-8 bottom-10 w-[22%] rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-300/80 flex flex-col items-center justify-center text-[11px] font-semibold shadow-lg shadow-emerald-500/30">
                  <span className="text-slate-950">Costa</span>
                  <span className="text-slate-900/80 text-[10px]">118,5</span>
                </div>
                <div className="absolute left-[28%] right-[32%] top-6 bottom-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-300/80 flex flex-col items-center justify-center text-[11px] font-semibold shadow-lg shadow-sky-500/30">
                  <span className="text-slate-950">Sierra</span>
                  <span className="text-slate-900/80 text-[10px]">158,3</span>
                </div>
                <div className="absolute right-3 top-10 bottom-6 w-[26%] rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-300/80 flex flex-col items-center justify-center text-[11px] font-semibold shadow-lg shadow-indigo-500/30">
                  <span className="text-slate-950">Oriente</span>
                  <span className="text-slate-900/80 text-[10px]">73,2</span>
                </div>
                <div className="absolute left-5 bottom-3 w-[20%] h-[18%] rounded-lg bg-gradient-to-br from-blue-500 to-fuchsia-500 flex flex-col items-center justify-center text-[10px] font-semibold shadow-lg shadow-fuchsia-500/40">
                  <span className="text-slate-50">Galápagos</span>
                  <span className="text-slate-100 text-[10px]">355,0</span>
                </div>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Costa o Litoral', v2024: 105.3, v2025: 118.5 },
                  { label: 'Sierra o Interandina', v2024: 158.1, v2025: 158.3 },
                  { label: 'Oriental o Amazónica', v2024: 40.9, v2025: 73.2 },
                  { label: 'Insular o Galápagos', v2024: 91.2, v2025: 355.0 },
                ].map(region => (
                  <div key={region.label} className="flex justify-between items-center">
                    <span>{region.label}</span>
                    <span className="text-slate-400">
                      {region.v2024}{' '}
                      <span className="mx-1 text-slate-500">→</span>
                      <span className="font-semibold text-white">{region.v2025}</span>
                    </span>
                  </div>
                ))}
                <div className="pt-1 text-[11px] text-slate-500">
                  La intensidad del color indica mayor cantidad de puntos por 10.000 adultos (2025).
                </div>
              </div>
            </div>
          </div>

          <div className="indicator-tables">
            <div className="grid gap-4 mb-4 md:grid-cols-2">
              <div className="p-4 rounded-xl border bg-white/5 border-white/10">
                <div className="mb-2 text-xs text-slate-400">Densidad por 10.000 adultos (sep 2024 → sep 2025)</div>
                <table className="w-full text-xs text-slate-300">
                  <thead>
                    <tr className="border-b text-slate-400 border-white/10">
                      <th className="py-1 pr-2 text-left">Tipo</th>
                      <th className="py-1 pr-2 text-left">2024</th>
                      <th className="py-1 pr-2 text-left">2025</th>
                      <th className="py-1 text-left">Δ%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10"><td className="py-1 pr-2">Oficinas</td><td className="py-1 pr-2">1,1</td><td className="py-1 pr-2">1,0</td><td className="py-1 text-rose-300">-3,6%</td></tr>
                    <tr className="border-b border-white/10"><td className="py-1 pr-2">Cajeros automáticos</td><td className="py-1 pr-2">3,7</td><td className="py-1 pr-2">3,7</td><td className="py-1 text-emerald-300">+1,0%</td></tr>
                    <tr className="border-b border-white/10"><td className="py-1 pr-2">Corresponsales</td><td className="py-1 pr-2">34,6</td><td className="py-1 pr-2">36,1</td><td className="py-1 text-emerald-300">+4,4%</td></tr>
                    <tr className="border-b border-white/10"><td className="py-1 pr-2">POS</td><td className="py-1 pr-2">65,8</td><td className="py-1 pr-2">71,7</td><td className="py-1 text-emerald-300">+8,9%</td></tr>
                    <tr><td className="py-1 pr-2">Cajas</td><td className="py-1 pr-2">19,1</td><td className="py-1 pr-2">20,8</td><td className="py-1 text-emerald-300">+9,0%</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 rounded-xl border bg-white/5 border-white/10">
                <div className="mb-2 text-xs text-slate-400">Densidad por 1.000 km2 (sep 2024 → sep 2025)</div>
                <table className="w-full text-xs text-slate-300">
                  <thead>
                    <tr className="border-b text-slate-400 border-white/10">
                      <th className="py-1 pr-2 text-left">Tipo</th>
                      <th className="py-1 pr-2 text-left">2024</th>
                      <th className="py-1 pr-2 text-left">2025</th>
                      <th className="py-1 text-left">Δ%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10"><td className="py-1 pr-2">Oficinas</td><td className="py-1 pr-2">5,0</td><td className="py-1 pr-2">4,8</td><td className="py-1 text-rose-300">-2,3%</td></tr>
                    <tr className="border-b border-white/10"><td className="py-1 pr-2">Cajeros automáticos</td><td className="py-1 pr-2">17,3</td><td className="py-1 pr-2">17,7</td><td className="py-1 text-emerald-300">+2,3%</td></tr>
                    <tr className="border-b border-white/10"><td className="py-1 pr-2">Corresponsales</td><td className="py-1 pr-2">161,9</td><td className="py-1 pr-2">171,2</td><td className="py-1 text-emerald-300">+5,8%</td></tr>
                    <tr className="border-b border-white/10"><td className="py-1 pr-2">POS</td><td className="py-1 pr-2">308,1</td><td className="py-1 pr-2">339,9</td><td className="py-1 text-emerald-300">+10,3%</td></tr>
                    <tr><td className="py-1 pr-2">Cajas</td><td className="py-1 pr-2">89,4</td><td className="py-1 pr-2">98,6</td><td className="py-1 text-emerald-300">+10,4%</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Fuente:
            <a href="https://www.superbancos.gob.ec/estadisticas/portalestudios/estudios-y-analisis/" target="_blank" rel="noopener noreferrer" className="ml-1 text-cyan-300 hover:underline">
              Superintendencia de Bancos — Estudios y análisis (Boletines de Inclusión Financiera)
            </a>
          </div>
        </div>
      </div>
    );
  }

  const indicatorSections = useMemo(() => ([
    {
      id: 'internet-uso',
      title: 'Uso de internet (ENEMDU)',
      category: 'Conectividad',
      tags: ['inec', 'enemdu', 'internet', 'hogares', 'personas'],
      summary: 'Muestra qué tanto usan internet los hogares y las personas, para medir conectividad digital.',
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border indicator-charts bg-white/5 border-white/10">
            <div className="text-sm font-semibold">Resumen ENEMDU</div>
            <p className="mt-1 text-xs text-slate-400">Esta sección se visualiza en la vista de tablas.</p>
          </div>
          <div className="indicator-tables">
            <InternetUsageTable />
          </div>
        </div>
      ),
    },
    {
      id: 'egdi',
      title: 'Indicador principal: EGDI (ONU)',
      category: 'Gobierno digital',
      tags: ['egdi', 'onu', 'gobierno digital', 'comparación internacional'],
      summary: 'Compara qué tan avanzado está el gobierno digital (servicios en línea, infraestructura y talento).',
      content: (
        <div className="p-5 space-y-4 rounded-2xl border bg-white/5 border-white/10">
          <div className="space-y-4 indicator-charts">
            <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">📊 Indicador Principal: EGDI</h3>
              <p className="text-sm text-slate-400">E-Government Development Index (ONU)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/10">Estándar internacional</span>
            </div>

          <div className="p-4 rounded-2xl border bg-white/5 border-white/10">
            <div className="flex justify-between items-center mb-3 text-xs text-slate-400">
              <span>Escala 0 – 1.0</span>
              <span>Comparación EGDI 2024</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-300">🇪🇨 Ecuador</span>
                  <span className="font-semibold text-blue-300">0,7800</span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-white/10">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '78.00%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-300">🇨🇱 Chile</span>
                  <span className="font-semibold text-red-300">0,8827</span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-white/10">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '88.27%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-300">🇨🇦 Canadá</span>
                  <span className="font-semibold text-green-300">0,8452</span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-white/10">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '84.52%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br rounded-2xl border from-blue-600/20 to-blue-600/5 border-blue-500/30">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">🇪🇨 Ecuador</h4>
                <span className="px-2 py-1 text-xs rounded-full border bg-blue-500/20 border-blue-500/30">Nivel ALTO</span>
              </div>
              <div className="mt-3 text-4xl font-bold text-blue-300">0,7800</div>
              <p className="mt-2 text-sm text-slate-400">Puesto 67 mundial</p>
            </div>
            <div className="p-4 bg-gradient-to-br rounded-2xl border from-red-600/20 to-red-600/5 border-red-500/30">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">🇨🇱 Chile</h4>
                <span className="px-2 py-1 text-xs rounded-full border bg-red-500/20 border-red-500/30">Nivel MUY ALTO</span>
              </div>
              <div className="mt-3 text-4xl font-bold text-red-300">0,8827</div>
              <p className="mt-2 text-sm text-slate-400">Puesto 31 (top 50)</p>
            </div>
            <div className="p-4 bg-gradient-to-br rounded-2xl border from-green-600/20 to-green-600/5 border-green-500/30">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">🇨🇦 Canadá</h4>
                <span className="px-2 py-1 text-xs rounded-full border bg-green-500/20 border-green-500/30">Nivel MUY ALTO</span>
              </div>
              <div className="mt-3 text-4xl font-bold text-green-300">0,8452</div>
              <p className="mt-2 text-sm text-slate-400">Puesto 47 (top 50)</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <h5 className="mb-2 text-sm font-semibold">¿Por qué es el indicador principal?</h5>
              <ul className="pl-5 space-y-1 text-xs list-disc text-slate-300">
                <li>Estándar internacional de la ONU para medir gobierno digital.</li>
                <li>Integra servicios en línea, infraestructura TIC y capital humano.</li>
                <li>Comparación objetiva entre 193 países.</li>
                <li>Usado en investigaciones académicas y políticas públicas.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <h5 className="mb-2 text-sm font-semibold">Otros indicadores considerados</h5>
              <ul className="pl-5 space-y-1 text-xs list-disc text-slate-300">
                <li>Acceso a internet (hogares y personas).</li>
                <li>Número de trámites digitales disponibles.</li>
                <li>Adopción de firma electrónica (certificados emitidos).</li>
                <li>Existencia de marcos legales habilitantes.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 text-xs rounded-xl border bg-slate-950/60 border-white/10 text-slate-300">
            <p className="mb-2"><span className="font-semibold">¿0,7800 es un buen puntaje?</span> Sí. Es nivel ALTO (rangos ONU: bajo &lt; 0.50, medio 0.50–0.75, alto 0.75–1.0).</p>
            <p>Puesto 67 de 193 países (tercio superior). Persisten brechas frente a “muy alto” (&gt; 0.85) donde están Chile y Canadá.</p>
          </div>
          </div>

          <div className="indicator-tables">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Resumen EGDI 2024</div>
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b text-slate-400 border-white/10">
                    <th className="py-1 pr-2 text-left">País</th>
                    <th className="py-1 pr-2 text-left">EGDI</th>
                    <th className="py-1 pr-2 text-left">Nivel</th>
                    <th className="py-1 text-left">Puesto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-1 pr-2">Ecuador</td>
                    <td className="py-1 pr-2">0,7800</td>
                    <td className="py-1 pr-2">ALTO</td>
                    <td className="py-1">67</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-1 pr-2">Chile</td>
                    <td className="py-1 pr-2">0,8827</td>
                    <td className="py-1 pr-2">MUY ALTO</td>
                    <td className="py-1">31</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-2">Canadá</td>
                    <td className="py-1 pr-2">0,8452</td>
                    <td className="py-1 pr-2">MUY ALTO</td>
                    <td className="py-1">47</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Fuente:
            <a
              href={`${import.meta.env.BASE_URL}Technical%20Appendix%20(Web%20version)%2030102024.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-cyan-300 hover:underline"
            >
              UN E-Government Survey 2024 — Technical Appendix (PDF)
            </a>
          </div>
        </div>
      ),
    },
    {
      id: 'operativos',
      title: 'Indicadores operativos (Gob.ec y SRI)',
      category: 'Servicios digitales',
      tags: ['gob.ec', 'sri', 'trámites', 'servicios'],
      summary: 'Indica cuántos trámites digitales hay y por qué canales se usan (Gob.ec y SRI).',
      content: (
        <div className="p-4 rounded-2xl border bg-white/5 border-white/10">
          <div className="space-y-4 indicator-charts">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Indicadores operativos (Ecuador)</h4>
            <span className="px-2 py-1 text-xs rounded-full border bg-white/10 border-white/10">Fuentes oficiales</span>
          </div>
          <div className="grid gap-3 mb-4 md:grid-cols-4">
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Trámites (Gob.ec)</div>
              <div className="text-xl font-semibold">7000</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Visitas</div>
              <div className="text-xl font-semibold">67.91M</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Regulaciones</div>
              <div className="text-xl font-semibold">2761</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Instituciones</div>
              <div className="text-xl font-semibold">379</div>
            </div>
          </div>
          <div className="p-4 mb-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Gob.ec — métricas destacadas</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span>Trámites</span>
                  <span className="font-semibold">7000</span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-white/10">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span>Regulaciones</span>
                  <span className="font-semibold">2761</span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-white/10">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: '27.61%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span>Instituciones</span>
                  <span className="font-semibold">379</span>
                </div>
                <div className="overflow-hidden h-2 rounded-full bg-white/10">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '3.79%' }}></div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Fuente: Gob.ec (Trámites más visitados).</p>
          </div>
          <div className="p-4 mb-4 rounded-xl border bg-white/5 border-white/10">
            <div className="flex justify-between items-center mb-3 text-xs text-slate-400">
              <span>SRI — distribución de trámites electrónicos</span>
              <span>Total: 256 trámites</span>
            </div>
            <div className="flex overflow-hidden h-3 rounded-full bg-white/10">
              <div className="h-full bg-blue-500" style={{ width: '92.97%' }} title="SRI en Línea 92,97%"></div>
              <div className="h-full bg-amber-500" style={{ width: '5.08%' }} title="GOB.ec 5,08%"></div>
              <div className="h-full bg-purple-500" style={{ width: '1.95%' }} title="Quipux 1,95%"></div>
            </div>
            <div className="grid gap-3 mt-3 text-xs md:grid-cols-3 text-slate-300">
              <div className="flex gap-2 items-center">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                SRI en Línea: 238 (92,97%)
              </div>
              <div className="flex gap-2 items-center">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                GOB.ec: 13 (5,08%)
              </div>
              <div className="flex gap-2 items-center">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                Quipux: 5 (1,95%)
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Fuente: SRI — Trámites electrónicos.</p>
          </div>
          </div>
          <div className="indicator-tables">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs border-b text-slate-400 border-white/10">
                  <th className="py-2 pr-4 text-left">Indicador</th>
                  <th className="py-2 pr-4 text-left">Dato</th>
                  <th className="py-2 text-left">Fuente</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4">Número de trámites (Gob.ec)</td>
                  <td className="py-2 pr-4">7000 trámites</td>
                  <td className="py-2">
                    <a
                      href="https://www.gob.ec/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      Portal Gob.ec
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4">SRI Servicios y Trámites</td>
                  <td className="py-2 pr-4">2600 servicios y trámites</td>
                  <td className="py-2">
                    <a
                      href="https://www.sri.gob.ec/servicios-y-tramites"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      SRI — Servicios y Trámites
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4">SRI en Línea (trámites electrónicos)</td>
                  <td className="py-2 pr-4">238 trámites (92,97%)</td>
                  <td className="py-2">
                    <a
                      href="https://www.sri.gob.ec/sri-tramites-electronicos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      SRI — Trámites electrónicos
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4">GOB.ec (SRI)</td>
                  <td className="py-2 pr-4">13 trámites (5,08%)</td>
                  <td className="py-2">
                    <a
                      href="https://www.sri.gob.ec/sri-tramites-electronicos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      SRI — Trámites electrónicos
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4">Quipux (SRI)</td>
                  <td className="py-2 pr-4">5 trámites (1,95%)</td>
                  <td className="py-2">
                    <a
                      href="https://www.sri.gob.ec/sri-tramites-electronicos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      SRI — Trámites electrónicos
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 pr-4">Firma electrónica</td>
                  <td className="py-2 pr-4">Habilitante legal y uso en trámites</td>
                  <td className="py-2">
                    <a
                      href="https://www.firmadigital.gob.ec/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      FirmaDigital.gob.ec
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Créditos (consumo y microcréditos)</td>
                  <td className="py-2 pr-4">Adultos con crédito: consumo 11,0% · microcrédito 3,8%</td>
                  <td className="py-2">
                    <a
                      href="https://www.superbancos.gob.ec/estadisticas/portalestudios/estudios-y-analisis/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      Boletín Trimestral de Inclusión Financiera (sep 2025)
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>
      ),
    },
    {
      id: 'firmaec',
      title: 'FirmaEC — firmas electrónicas por sistema',
      category: 'Identidad digital',
      tags: ['firmaec', 'firma electrónica', 'certificados', 'sistemas'],
      summary: 'Mide el uso de firma electrónica por sistema como señal de identidad digital.',
      content: (
        <div className="p-4 rounded-2xl border bg-white/5 border-white/10">
          <div className="space-y-4 indicator-charts">
          <div className="flex gap-3 justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold">FirmaEC — firmas electrónicas por sistema</h4>
              <p className="text-xs text-slate-400">Datos consolidados del panel oficial (CSV)</p>
            </div>
            <span className="px-2 py-1 text-xs rounded-full border bg-white/10 border-white/10">FirmaEC</span>
          </div>

          <div className="grid gap-3 mb-4 md:grid-cols-3">
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Total de firmas</div>
              <div className="text-xl font-semibold">{formatNumber(firmaTotal)}</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Sistema líder</div>
              <div className="text-sm font-semibold text-white">{firmaTop[0]?.system || '—'}</div>
            </div>
            <div className="p-3 rounded-xl border bg-white/5 border-white/10">
              <div className="text-xs text-slate-400">Sistemas con firmas</div>
              <div className="text-xl font-semibold">{formatNumber(firmaStats.length)}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-3 text-xs text-slate-400">Top 10 sistemas por volumen de firmas</div>
            {firmaTop.length === 0 ? (
              <div className="text-xs text-slate-300">Cargando datos del CSV…</div>
            ) : (
              <div className="space-y-2 text-xs">
                {firmaTop.map(item => (
                  <div key={item.system}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-200">{item.system}</span>
                      <span className="font-semibold">{formatNumber(item.total)}</span>
                    </div>
                    <div className="overflow-hidden h-2 rounded-full bg-white/10">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${Math.max((item.total / firmaMax) * 100, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          </div>

          <div className="indicator-tables">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Top 10 sistemas por volumen de firmas</div>
              {firmaTop.length === 0 ? (
                <div className="text-xs text-slate-300">Cargando datos del CSV…</div>
              ) : (
                <table className="w-full text-xs text-slate-300">
                  <thead>
                    <tr className="border-b text-slate-400 border-white/10">
                      <th className="py-1 pr-2 text-left">Sistema</th>
                      <th className="py-1 text-left">Firmas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firmaTop.map(item => (
                      <tr key={item.system} className="border-b border-white/10">
                        <td className="py-1 pr-2">{item.system}</td>
                        <td className="py-1">{formatNumber(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-400">
            Fuente:
            <a
              href="https://lookerstudio.google.com/u/0/reporting/824a3ec0-8acc-4f88-8378-6f47119ea2b6/page/H0iLD?s=r4mCJYK5ziU"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-cyan-300 hover:underline"
            >
              Looker Studio — Estadísticas FirmaEC
            </a>
          </div>
        </div>
      ),
    },
    {
      id: 'bce',
      title: 'Indicadores macroeconómicos — BCE',
      category: 'Economía',
      tags: ['bce', 'inflación', 'tasas', 'liquidez', 'm2', 'remesas'],
      summary: 'Da el contexto económico que puede afectar la adopción digital.',
      content: (
        <div className="p-4 rounded-2xl border bg-slate-950/85 border-white/10">
          <div className="space-y-4 indicator-charts">
            <div className="flex gap-3 justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">Indicadores macroeconómicos — BCE</h4>
                <p className="text-xs text-slate-400">Contenido económico financiero actualizado.</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['#bce', '#inflación', '#tasas', '#liquidez', '#m2', '#remesas'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[11px] rounded-full border bg-white/5 border-white/10 text-slate-300">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px]">Economía</span>
                <span className={countryChipClasses('Ecuador')}>Ecuador</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-white/10 shadow-[0_0_60px_rgba(16,185,129,0.28)]">
              <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-slate-950/90">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Tablero Macroeconómico</div>
                  <p className="text-xs text-slate-300">Precios · Empleo · Liquidez · Tasas · Remesas</p>
                </div>
                <div className="inline-flex rounded-full border border-white/10 bg-slate-900/80 p-0.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/90 text-slate-950 font-semibold">EC</span>
                  <span className="px-2 py-0.5 text-slate-200">CL</span>
                  <span className="px-2 py-0.5 text-slate-200">CA</span>
                </div>
              </div>

              <div className="grid gap-3 p-4 md:grid-cols-3">
                <div className="p-3 bg-gradient-to-tr rounded-2xl border from-amber-500/20 via-amber-500/10 to-slate-900 border-amber-400/40">
                  <div className="text-xs text-amber-100">Inflación mensual</div>
                  <div className="text-xl font-semibold text-amber-100">0,37%</div>
                  <div className="text-xs text-slate-300">Ene 2026</div>
                </div>
                <div className="p-3 bg-gradient-to-tr rounded-2xl border from-rose-500/20 via-rose-500/10 to-slate-900 border-rose-400/40">
                  <div className="text-xs text-rose-100">Desempleo nacional</div>
                  <div className="text-xl font-semibold text-rose-100">2,61%</div>
                  <div className="text-xs text-slate-300">Dic 2025</div>
                </div>
                <div className="p-3 bg-gradient-to-tr rounded-2xl border from-cyan-500/20 via-cyan-500/10 to-slate-900 border-cyan-400/40">
                  <div className="text-xs text-cyan-100">Liquidez total M2</div>
                  <div className="text-xl font-semibold text-cyan-100">100.311 M</div>
                  <div className="text-xs text-slate-300">Millones USD · Dic 2025</div>
                </div>
                <div className="p-3 bg-gradient-to-tr rounded-2xl border from-sky-500/20 via-sky-500/10 to-slate-900 border-sky-400/40">
                  <div className="text-xs text-sky-100">Tasa activa referencial</div>
                  <div className="text-xl font-semibold text-sky-100">7,54%</div>
                  <div className="text-xs text-slate-300">Feb 2026</div>
                </div>
                <div className="p-3 bg-gradient-to-tr rounded-2xl border from-emerald-500/20 via-emerald-500/10 to-slate-900 border-emerald-400/50">
                  <div className="text-xs text-emerald-100">Tasa pasiva referencial</div>
                  <div className="text-xl font-semibold text-emerald-100">5,61%</div>
                  <div className="text-xs text-slate-300">Feb 2026</div>
                </div>
                <div className="p-3 bg-gradient-to-tr rounded-2xl border from-violet-500/20 via-violet-500/10 to-slate-900 border-violet-400/40">
                  <div className="text-xs text-violet-100">Remesas</div>
                  <div className="text-xl font-semibold text-violet-100">$ 2.012 M</div>
                  <div className="text-xs text-slate-300">III trimestre 2025</div>
                </div>
              </div>
            </div>

          <div className="grid gap-4 mt-4 md:grid-cols-3">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Precios y empleo (escala 0–5%)</div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Inflación mensual</span>
                    <span className="font-semibold">0,37%</span>
                  </div>
                  <div className="overflow-hidden h-2 rounded-full bg-white/10">
                    <div className="h-full bg-amber-400" style={{ width: '7.4%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Desempleo nacional</span>
                    <span className="font-semibold">2,61%</span>
                  </div>
                  <div className="overflow-hidden h-2 rounded-full bg-white/10">
                    <div className="h-full bg-rose-400" style={{ width: '52.2%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Tasas referenciales (escala 0–10%)</div>
              <ReactApexChart
                type="bar"
            height={230}
                series={[
                  { name: 'Tasa activa', data: [7.54] },
                  { name: 'Tasa pasiva', data: [5.61] },
                ]}
                options={{
                  chart: {
                    type: 'bar',
                    stacked: true,
                    foreColor: '#94a3b8',
                    toolbar: { show: false },
                    sparkline: { enabled: true },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: '40%',
                      borderRadius: 6,
                    },
                  },
                  dataLabels: { enabled: false },
                  xaxis: {
                    categories: ['Tasa referencial'],
                    labels: { show: false },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                  },
                  yaxis: {
                    max: 10,
                    min: 0,
                    labels: {
                      formatter: (val) => `${val.toFixed(0)}%`,
                    },
                  },
                  legend: {
                    show: true,
                    position: 'bottom',
                    fontSize: '11px',
                  },
                  colors: ['#60a5fa', '#22c55e'],
                  grid: { borderColor: 'rgba(148,163,184,0.3)' },
                  tooltip: {
                    theme: 'dark',
                    shared: false,
                    intersect: false,
                    y: {
                      formatter: (val, { seriesIndex }) => {
                        const label = seriesIndex === 0 ? 'Tasa activa' : 'Tasa pasiva';
                        return `${label}: ${val.toFixed(2)}%`;
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Sector externo (escala 0–4.000 millones USD)</div>
              <ReactApexChart
                type="donut"
                height={190}
                series={[3402.42, 744.17, 2012.71]}
                options={{
                  chart: {
                    type: 'donut',
                    foreColor: '#94a3b8',
                    toolbar: { show: false },
                  },
                  labels: ['Exportaciones', 'Saldo comercial', 'Remesas'],
                  legend: {
                    position: 'bottom',
                    fontSize: '11px',
                  },
                  dataLabels: { enabled: false },
                  colors: ['#22d3ee', '#6366f1', '#a855f7'],
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '60%',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Finanzas públicas (escala 0–5% del PIB)</div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Ingresos SPNF</span>
                    <span className="font-semibold">2,94%</span>
                  </div>
                  <div className="overflow-hidden h-2 rounded-full bg-white/10">
                    <div className="h-full bg-emerald-400" style={{ width: '58.8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Erogaciones SPNF</span>
                    <span className="font-semibold">3,03%</span>
                  </div>
                  <div className="overflow-hidden h-2 rounded-full bg-white/10">
                    <div className="h-full bg-rose-400" style={{ width: '60.6%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Deuda y PIB (escala 0–130.000 millones USD)</div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Deuda pública interna</span>
                    <span className="font-semibold">36.294,00</span>
                  </div>
                  <div className="overflow-hidden h-2 rounded-full bg-white/10">
                    <div className="h-full bg-orange-400" style={{ width: '27.9%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>PIB nominal</span>
                    <span className="font-semibold">124.676,1</span>
                  </div>
                  <div className="overflow-hidden h-2 rounded-full bg-white/10">
                    <div className="h-full bg-blue-400" style={{ width: '95.9%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-2 text-xs text-slate-400">Actividad y sector externo</div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex justify-between items-center">
                  <span>Saldo balanza comercial</span>
                  <span className="font-semibold">744,17 (nov 2025)</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Exportaciones de bienes</span>
                  <span className="font-semibold">3.402,42 (nov 2025)</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Producción petrolera nacional</span>
                  <span className="font-semibold">467.574,55 (05-02-2026)</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>PIB nominal</span>
                  <span className="font-semibold">124.676,1 (2024 prel.)</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-2 text-xs text-slate-400">Finanzas públicas y mercados</div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex justify-between items-center">
                  <span>Total ingresos SPNF</span>
                  <span className="font-semibold">2,94% PIB (oct 2025)</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Total erogaciones SPNF</span>
                  <span className="font-semibold">3,03% PIB (oct 2025)</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Saldo deuda pública interna</span>
                  <span className="font-semibold">36.294,00 (oct 2025)</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Riesgo país</span>
                  <span className="font-semibold">454 (08-02-2026)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 mt-4 rounded-xl border bg-white/5 border-white/10">
            <div className="mb-2 text-xs text-slate-400">Mercados internacionales</div>
            <div className="grid gap-3 text-xs md:grid-cols-3 text-slate-300">
              <div className="flex justify-between items-center">
                <span>Índice Dow Jones</span>
                <span className="font-semibold">50.115,67 (08-02-2026)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Precio del oro (Fixing PM)</span>
                <span className="font-semibold">4.948,00 (08-02-2026)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bonos soberanos (USD)</span>
                <span className="font-semibold">2030 98,76 · 2034 100,97 · 2035 91,10 · 2039 102,38 · 2040 82,34</span>
              </div>
            </div>
          </div>
          </div>

          <div className="indicator-tables">
            <div className="p-4 rounded-xl border bg-white/5 border-white/10">
              <div className="mb-3 text-xs text-slate-400">Resumen de indicadores BCE</div>
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b text-slate-400 border-white/10">
                    <th className="py-1 pr-2 text-left">Indicador</th>
                    <th className="py-1 text-left">Dato</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-1 pr-2">Inflación mensual</td>
                    <td className="py-1">0,37% (ene 2026)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-1 pr-2">Desempleo nacional</td>
                    <td className="py-1">2,61% (dic 2025)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-1 pr-2">Liquidez total M2</td>
                    <td className="py-1">100.311,92 (millones USD)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-1 pr-2">Tasa activa referencial</td>
                    <td className="py-1">7,54% (feb 2026)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-1 pr-2">Tasa pasiva referencial</td>
                    <td className="py-1">5,61% (feb 2026)</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-2">Remesas</td>
                    <td className="py-1">2.012,71 (millones USD)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Fuente:
            <a
              href="https://contenido.bce.fin.ec/documentos/informacioneconomica/MonetarioFinanciero/ix_MonetariasFinancierasPrin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-cyan-300 hover:underline"
            >
              Banco Central del Ecuador — Indicadores monetarios y financieros
            </a>
          </div>
        </div>
      ),
    },
    {
      id: 'presencia-financiera',
      title: 'Presencia financiera — Superintendencia de Bancos',
      category: 'Inclusión financiera',
      tags: ['puntos de atención', 'cajeros', 'corresponsales', 'datáfonos'],
      summary: 'Mide cuántos puntos de atención hay y qué tan cerca están de la gente.',
      content: <PresenciaFinancieraSectionView />,
    },
    {
      id: 'inclusion-financiera',
      title: 'Inclusión financiera — créditos, tarjetas y transacciones',
      category: 'Inclusión financiera',
      tags: ['créditos', 'tarjetas', 'transacciones', 'canales', 'banca móvil'],
      summary: 'Muestra el uso de créditos, tarjetas y canales digitales en finanzas.',
      content: <InclusionFinancieraSectionView />,
    },
  ]), [firmaMax, firmaStats.length, firmaTop, firmaTotal]);

  const indicatorCategories = useMemo(() => {
    const unique = Array.from(new Set(indicatorSections.map(section => section.category)));
    return ['all', ...unique];
  }, [indicatorSections]);

  const filteredIndicatorSections = useMemo(() => {
    const normalizedQuery = indicatorQuery.trim().toLowerCase();
    return indicatorSections.filter(section => {
      const matchesCategory = indicatorCategory === 'all' || section.category === indicatorCategory;
      if (!normalizedQuery) return matchesCategory;
      const haystack = `${section.title} ${section.category} ${(section.tags || []).join(' ')}`.toLowerCase();
      return matchesCategory && haystack.includes(normalizedQuery);
    });
  }, [indicatorSections, indicatorQuery, indicatorCategory]);

  const buildAPA = (event) => {
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
  };

  const handleCopyAPAAll = async () => {
    const apa = filtered.map(buildAPA).filter(Boolean).join('\n\n');
    await navigator.clipboard.writeText(apa || '');
    alert('APA copiada');
  };

  const handleExportExcel = () => {
    const rows = filtered.map(e => ({
      id: e.id || '',
      pais: e.pais || '',
      categoria: e.categoria || '',
      titulo: e.titulo || '',
      fecha: e.fecha || '',
      descripcion: e.descripcion || '',
      fuentes: (e.fuentes || []).map(f => `${f.label}${f.url ? ` (${f.url})` : ''}`).join(' | '),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Eventos');

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `digitalizacion_${activeTab}_${date}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_10%_-10%,rgba(34,211,238,0.15),transparent),radial-gradient(800px_circle_at_90%_0%,rgba(99,102,241,0.12),transparent)] bg-slate-950 text-white">
      {isSidebarOpen && (
        <div className="flex fixed inset-0 z-40 lg:hidden">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="w-64 border-l border-white/10 bg-slate-950">
            <nav className="px-4 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                    Contenido
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Navega por el análisis
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Cerrar
                </button>
              </div>
              <SidebarNav
                activeTopic={activeTopic}
                onItemClick={(id) => {
                  handleTopicClick(id);
                  setIsSidebarOpen(false);
                }}
              />
            </nav>
          </aside>
        </div>
      )}

      <div className="flex">
        <aside className="hidden fixed inset-y-0 left-0 z-30 w-64 border-r lg:flex border-white/10 bg-slate-950/95">
          <nav className="flex overflow-y-auto flex-col px-4 py-6 space-y-4 h-full">
            <div className="flex gap-2 justify-between items-center">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                  Contenido
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Navega por el análisis
                </div>
              </div>
            </div>
            <SidebarNav
              activeTopic={activeTopic}
              onItemClick={handleTopicClick}
            />
          </nav>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="z-10 border-b backdrop-blur md:sticky md:top-0 border-white/10 bg-slate-950/80">
            <div className="flex flex-col gap-4 px-3 py-3 mx-auto max-w-6xl md:px-4 md:py-4 md:gap-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                <Link
                  to="/"
                  className="flex gap-3 items-center transition hover:opacity-90"
                  aria-label="Ir al inicio"
                >
                  <div className="flex overflow-hidden justify-center items-center p-1 w-12 h-12 rounded-full border bg-white/90 border-white/20">
                    <img
                      src={`${import.meta.env.BASE_URL}logo3.png`}
                      alt="Universidad Central del Ecuador"
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <h1 className="text-base font-semibold tracking-wide">GRUPO 4</h1>
                    <p className="text-xs text-slate-400">Universidad Central del Ecuador</p>
                  </div>
                </Link>
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <span>☰</span>
                    <span>Contenido</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-sm"
                  >
                    Imprimir
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-sm"
                  >
                    Exportar Excel
                  </button>
                  <button
                    onClick={handleCopyAPAAll}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-4 py-1.5 rounded-full text-sm"
                  >
                    Copiar APA 7
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold leading-tight md:text-4xl">{title}</h2>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 mx-auto max-w-6xl">
            <div className="space-y-6">
              {activeTopic === 'eventos' && (
                <EventosView
                  stats={stats}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  showEvents={showEvents}
                  setShowEvents={setShowEvents}
                  compactView={compactView}
                  filtered={filtered}
                  onOpenTimeline={() => setIsTimelineOpen(true)}
                  onToggleVerticalTimeline={() =>
                    setIsVerticalTimelineOpen(prev => !prev)
                  }
                />
              )}

              {activeTopic === 'indicadores' && (
                <IndicadoresView
                  indicatorQuery={indicatorQuery}
                  setIndicatorQuery={setIndicatorQuery}
                  indicatorCategory={indicatorCategory}
                  setIndicatorCategory={setIndicatorCategory}
                  indicatorCategories={indicatorCategories}
                  indicatorShowAll={indicatorShowAll}
                  setIndicatorShowAll={setIndicatorShowAll}
                  filteredIndicatorSections={filteredIndicatorSections}
                  getIndicatorView={getIndicatorView}
                  setIndicatorView={setIndicatorView}
                />
              )}

              {activeTopic === 'informe' && <InformeView />}

              {activeTopic === 'conclusiones' && (
                <SintesisView
                  digitalizacionSummaryContent={digitalizacionSummaryContent}
                />
              )}

              {activeTopic === 'bibliografia' && (
                <BibliografiaView
                  showBibliography={showBibliography}
                  setShowBibliography={setShowBibliography}
                  filtered={filtered}
                  buildAPA={buildAPA}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <TimelineModal
        events={filtered}
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
      />

      {isVerticalTimelineOpen && (
        <div className="overflow-y-auto fixed inset-0 z-50 backdrop-blur-sm bg-black/50">
          <div className="py-8 min-h-screen">
            <div className="m-4 mx-auto max-w-5xl bg-white rounded-2xl shadow-2xl dark:bg-slate-900">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold">Línea de Tiempo Comparativa</h2>
                <button
                  onClick={() => setIsVerticalTimelineOpen(false)}
                  className="text-2xl hover:opacity-60"
                >
                  ✕
                </button>
              </div>
              <div className="p-8 dark:bg-slate-950">
                <VerticalTimeline events={filtered} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App

function guessOrg(url, label) {
  const host = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  if (host.includes('asambleanacional')) return 'Asamblea Nacional del Ecuador';
  if (host.includes('telecomunicaciones')) return 'Ministerio de Telecomunicaciones';
  if (host.includes('ecuadorencifras')) return 'Instituto Nacional de Estadística y Censos (INEC)';
  if (host.includes('gob.ec')) return 'Gobierno del Ecuador';
  if (host.includes('un.org')) return 'United Nations';
  return label || host;
}
