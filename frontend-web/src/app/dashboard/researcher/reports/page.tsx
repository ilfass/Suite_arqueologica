'use client';

import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  author: string;
}

const initialReports: Report[] = [
  { id: '1', title: 'Informe de Excavación - Sitio A', type: 'Excavación', date: '2023-01-15', status: 'Completado', author: 'Dr. Pérez' },
  { id: '2', title: 'Análisis de Materiales', type: 'Laboratorio', date: '2023-02-10', status: 'En Proceso', author: 'Dr. Pérez' }
];

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', type: '', date: '', author: '' });

  const handleAdd = () => {
    setReports([
      ...reports,
      { id: Date.now().toString(), ...form, status: 'Borrador' }
    ]);
    setForm({ title: '', type: '', date: '', author: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">📋 Informes Arqueológicos</h1>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Nuevo Informe</Button>
        </div>
        <table className="w-full text-left border-t border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3">Título</th>
              <th className="py-2 px-3">Tipo</th>
              <th className="py-2 px-3">Fecha</th>
              <th className="py-2 px-3">Estado</th>
              <th className="py-2 px-3">Autor</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="py-2 px-3">{r.title}</td>
                <td className="py-2 px-3">{r.type}</td>
                <td className="py-2 px-3">{r.date}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    r.status === 'Completado' ? 'bg-green-100 text-green-800' : 
                    r.status === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-2 px-3">{r.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Nuevo Informe</h3>
            <div className="space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Título del informe" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <select className="w-full border p-2 rounded" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="">Seleccionar tipo</option>
                <option value="Excavación">Excavación</option>
                <option value="Laboratorio">Laboratorio</option>
                <option value="Prospección">Prospección</option>
                <option value="Análisis">Análisis</option>
              </select>
              <input className="w-full border p-2 rounded" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <input className="w-full border p-2 rounded" placeholder="Autor" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
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

export default ReportsPage; 