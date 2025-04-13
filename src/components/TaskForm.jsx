// ✅ TASKFORM COMPLETO Y MEJORADO PARA MOBILE CON SOPORTE PARA EDICIÓN
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { CalendarDays, PencilLine, AlignLeft } from 'lucide-react';

const TaskForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate?.substring(0, 10) || ''
      });
    } else {
      setForm({ title: '', description: '', dueDate: '' });
    }
  }, [initialData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    if (form.dueDate && form.dueDate < today) {
      toast.error('La fecha límite no puede ser anterior a hoy');
      return;
    }

    try {
      if (initialData && initialData._id) {
        await axios.put(`/tasks/${initialData._id}`, form);
        toast.success('Tarea actualizada');
      } else {
        await axios.post('/tasks', form);
        toast.success('Tarea creada');
        setForm({ title: '', description: '', dueDate: '' });
      }
      onSubmit();
    } catch {
      toast.error('Error al guardar la tarea');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md w-full">
      <h2 className="text-xl font-bold text-gray-800">
        {initialData && initialData._id ? '✏️ Editar tarea' : '🆕 Crear tarea'}
      </h2>

      <div>
        <label htmlFor="title" className="block font-semibold mb-1 flex items-center gap-1">
          <PencilLine size={16} /> Título
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold mb-1 flex items-center gap-1">
          <AlignLeft size={16} /> Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block font-semibold mb-1 flex items-center gap-1">
          <CalendarDays size={16} /> Fecha límite
        </label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={form.dueDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
          Guardar
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-gray-500 hover:underline">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
