'use client';

import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface Chronology {
  id: string;
  method: string;
  date: string;
  interval: string;
  reference: string;
}

const initialChronologies: Chronology[] = [
  { id: '1', method: 'Radiocarbono (AMS)', date: '2450 ± 30 BP', interval: 'Cal 760-680 a.C.', reference: 'Smith et al. 2020' },
  { id: '2', method: 'Termoluminiscencia', date: '3200 ± 100 BP', interval: 'Cal 1400-1200 a.C.', reference: 'García et al. 2018' }
];

const ChronologyPage: React.FC = () => {
  const [chronologies, setChronologies] = useState(initialChronologies);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ method: '', date: '', interval: '', reference: '' });

  const handleAdd = () => {
    setChronologies([
      ...chronologies,
      { id: Date.now().toString(), ...form }
    ]);
    setForm({ method: '', date: '', interval: '', reference: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">⏳ Cronologías Arqueológicas</h1>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nueva Datación</Button>
        </div>
        <table className="w-full text-left border-t border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3">Método</th>
              <th className="py-2 px-3">Fecha</th>
              <th className="py-2 px-3">Intervalo</th>
              <th className="py-2 px-3">Referencia</th>
            </tr>
          </thead>
          <tbody>
            {chronologies.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2 px-3">{c.method}</td>
                <td className="py-2 px-3">{c.date}</td>
                <td className="py-2 px-3">{c.interval}</td>
                <td className="py-2 px-3">{c.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Nueva Datación</h3>
            <div className="space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Método" value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))} />
              <input className="w-full border p-2 rounded" placeholder="Fecha (ej: 2450 ± 30 BP)" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <input className="w-full border p-2 rounded" placeholder="Intervalo calibrado" value={form.interval} onChange={e => setForm(f => ({ ...f, interval: e.target.value }))} />
              <input className="w-full border p-2 rounded" placeholder="Referencia" value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</Button>
              <Button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChronologyPage; 