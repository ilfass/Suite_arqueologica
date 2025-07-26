'use client';

import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface Analysis {
  id: string;
  sampleType: string;
  method: string;
  result: string;
  date: string;
  reference: string;
}

const initialAnalyses: Analysis[] = [
  { id: '1', sampleType: 'Carbón', method: 'Análisis de C14', result: '2450 ± 30 BP', date: '2023-01-15', reference: 'Lab UNAM' },
  { id: '2', sampleType: 'Cerámica', method: 'Petrografía', result: 'Arcilla local', date: '2023-02-10', reference: 'Lab INAH' }
];

const LaboratoryPage: React.FC = () => {
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sampleType: '', method: '', result: '', date: '', reference: '' });

  const handleAdd = () => {
    setAnalyses([
      ...analyses,
      { id: Date.now().toString(), ...form }
    ]);
    setForm({ sampleType: '', method: '', result: '', date: '', reference: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">🔬 Análisis de Laboratorio</h1>
          <Button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Nuevo Análisis</Button>
        </div>
        <table className="w-full text-left border-t border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3">Tipo de Muestra</th>
              <th className="py-2 px-3">Método</th>
              <th className="py-2 px-3">Resultado</th>
              <th className="py-2 px-3">Fecha</th>
              <th className="py-2 px-3">Referencia</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="py-2 px-3">{a.sampleType}</td>
                <td className="py-2 px-3">{a.method}</td>
                <td className="py-2 px-3">{a.result}</td>
                <td className="py-2 px-3">{a.date}</td>
                <td className="py-2 px-3">{a.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Nuevo Análisis de Laboratorio</h3>
            <div className="space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Tipo de muestra" value={form.sampleType} onChange={e => setForm(f => ({ ...f, sampleType: e.target.value }))} />
              <input className="w-full border p-2 rounded" placeholder="Método" value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))} />
              <input className="w-full border p-2 rounded" placeholder="Resultado" value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} />
              <input className="w-full border p-2 rounded" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <input className="w-full border p-2 rounded" placeholder="Referencia" value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</Button>
              <Button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratoryPage; 