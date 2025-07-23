'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  type: 'message' | 'task' | 'reminder' | 'alert';
  title: string;
  content: string;
  date: string;
  read: boolean;
}

const CommunicationPage: React.FC = () => {
  const router = useRouter();
  // Contexto de trabajo
  const [context, setContext] = useState<{ project: string; area: string; site: string }>({ project: '', area: '', site: '' });
  const [siteName, setSiteName] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'medium' as const
  });

  // Datos simulados
  useEffect(() => {
    // Leer contexto de localStorage
    const saved = localStorage.getItem('investigator-context');
    if (saved) {
      const ctx = JSON.parse(saved);
      setContext({ project: ctx.project || '', area: ctx.area || '', site: ctx.site || '' });
    }
  }, []);

  // Sincronizar contexto al recibir foco o volver a la pestaña
  useEffect(() => {
    const syncContext = () => {
      const saved = localStorage.getItem('investigator-context');
      if (saved) {
        const ctx = JSON.parse(saved);
        setContext({ project: ctx.project || '', area: ctx.area || '', site: ctx.site || '' });
      }
    };
    window.addEventListener('focus', syncContext);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncContext();
    });
    return () => {
      window.removeEventListener('focus', syncContext);
      window.removeEventListener('visibilitychange', syncContext);
    };
  }, []);

  useEffect(() => {
    // Simular obtención del nombre del sitio activo
    const sitios = [
      { id: '1', name: 'Sitio Laguna La Brava Norte' },
      { id: '2', name: 'Excavación Arroyo Seco 2' },
      { id: '3', name: 'Monte Hermoso Playa' }
    ];
    const found = sitios.find(s => s.id === context.site);
    setSiteName(found ? found.name : context.site);
  }, [context]);

  // Banner de contexto activo
  const renderContextBanner = () => (
    context.project && context.area && context.site ? (
      <div className="sticky top-0 z-30 w-full bg-blue-50 border-b border-blue-200 py-2 px-4 flex items-center justify-between shadow-sm mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-blue-700 font-semibold">Trabajando en:</span>
          <span className="text-blue-900 font-bold">Proyecto {context.project}</span>
          <span className="text-blue-700">|</span>
          <span className="text-blue-900 font-bold">Área {context.area}</span>
          <span className="text-blue-700">|</span>
          <span className="text-blue-900 font-bold">Sitio {siteName || context.site}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => router.push('/dashboard/researcher')}>Cambiar Contexto</Button>
        </div>
      </div>
    ) : null
  );

  // Si no hay contexto, mostrar mensaje y botón para ir al dashboard
  if (!context.project || !context.area || !context.site) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona tu contexto de trabajo</h3>
          <p className="text-gray-600 mb-4">Para acceder a la comunicación, primero debes seleccionar un proyecto, área y sitio.</p>
          <Button variant="primary" onClick={() => router.push('/dashboard/researcher')}>Ir al Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    const message: Message = {
      id: Date.now().toString(),
      sender: 'Dr. Pérez',
      recipient: newMessage.recipient,
      subject: newMessage.subject,
      content: newMessage.content,
      date: new Date().toLocaleString(),
      read: false,
      priority: newMessage.priority
    };
    setMessages([message, ...messages]);
    setNewMessage({ recipient: '', subject: '', content: '', priority: 'medium' });
    setShowNewMessage(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'task': return '📋';
      case 'reminder': return '⏰';
      case 'alert': return '⚠️';
      default: return '📢';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {renderContextBanner()}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">💬 Comunicación</h1>
        <Button onClick={() => setShowNewMessage(true)}>
          ✉️ Nuevo Mensaje
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mensajes */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">📧 Mensajes</h2>
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    !message.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                          {message.priority === 'high' ? 'Alta' : message.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                        {!message.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                      </div>
                      <h3 className="font-medium text-gray-900 mt-1">{message.subject}</h3>
                      <p className="text-sm text-gray-600">De: {message.sender}</p>
                      <p className="text-sm text-gray-500 mt-1">{message.content.substring(0, 100)}...</p>
                      <p className="text-xs text-gray-400 mt-2">{message.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Notificaciones */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">🔔 Notificaciones</h2>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    !notification.read ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
                    </div>
                    {!notification.read && <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Tablón de Avisos */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">📌 Tablón de Avisos</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📢</span>
              <div>
                <h3 className="font-medium text-gray-900">Reunión General de Proyecto</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Se convoca a todos los miembros del equipo a la reunión general que se llevará a cabo 
                  el próximo viernes a las 10:00 AM en el laboratorio principal.
                </p>
                <p className="text-xs text-gray-500 mt-2">Publicado: 2025-07-22 08:00</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal para nuevo mensaje */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">✉️ Nuevo Mensaje</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Para</label>
                <Input
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                  placeholder="Destinatario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Asunto</label>
                <Input
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Asunto del mensaje"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                <select
                  value={newMessage.priority}
                  onChange={(e) => setNewMessage({...newMessage, priority: e.target.value as any})}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  placeholder="Contenido del mensaje"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowNewMessage(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendMessage}>
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver mensaje */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">📧 Detalles del Mensaje</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">De</label>
                <p className="text-sm text-gray-900">{selectedMessage.sender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Para</label>
                <p className="text-sm text-gray-900">{selectedMessage.recipient}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Asunto</label>
                <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedMessage.priority)}`}>
                  {selectedMessage.priority === 'high' ? 'Alta' : selectedMessage.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                <p className="text-sm text-gray-900 mt-1">{selectedMessage.content}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <p className="text-sm text-gray-900">{selectedMessage.date}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">
                ✉️ Responder
              </Button>
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationPage; 