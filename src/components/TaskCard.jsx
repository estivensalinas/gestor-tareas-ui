import axios from '../api/axios';
import { Trash2, ArrowRight, PencilLine } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const TaskCard = ({ task, refresh, onEdit }) => {
  const diasRestantes = task.dueDate
    ? dayjs(task.dueDate).diff(dayjs(), 'day')
    : null;

  const cambiarEstado = async () => {
    const next = {
      pendiente: 'en progreso',
      'en progreso': 'completada',
    };
    if (!next[task.status]) return;
    await axios.put(`/tasks/${task._id}`, { status: next[task.status] });
    refresh();
  };

  const eliminarTarea = async () => {
    if (task.status !== 'completada') return;
    if (confirm('¿Eliminar esta tarea?')) {
      await axios.delete(`/tasks/${task._id}`);
      refresh();
    }
  };

  const bgColor = (() => {
    if (!task.dueDate) return 'bg-gray-100 border-gray-300';
    if (task.status === 'completada') return 'bg-green-100 border-green-300';
    if (task.status === 'en progreso') {
      if (diasRestantes < 0) return 'bg-gray-200 border-gray-400';
      if (diasRestantes <= 2) return 'bg-red-100 border-red-300';
      return 'bg-yellow-100 border-yellow-300';
    }
    return 'bg-blue-100 border-blue-300';
  })();

  return (
    <div className={`rounded-lg border-l-8 p-4 shadow-md ${bgColor}`}>
      <h4 className="text-lg font-bold">{task.title}</h4>
      {task.description && <p className="text-gray-700">{task.description}</p>}

      {task.dueDate && task.status === 'en progreso' && (
        <p className="text-sm text-gray-600 mt-2">
          ⏳ {diasRestantes >= 0
            ? `${diasRestantes} día${diasRestantes === 1 ? '' : 's'} restantes`
            : 'Vencida'}{' '}
          ({dayjs(task.dueDate).format('DD/MM/YYYY')})
        </p>
      )}

      <div className="flex justify-between mt-3 text-sm text-indigo-600">
        {task.status !== 'completada' && (
          <button onClick={cambiarEstado} className="flex items-center gap-1 hover:underline">
            <ArrowRight size={16} />
            <span>Estado</span>
          </button>
        )}

        {(task.status === 'pendiente' || task.status === 'en progreso') && (
          <button onClick={() => onEdit(task)} className="flex items-center gap-1 hover:underline">
            <PencilLine size={16} />
            <span>Editar</span>
          </button>
        )}

        <button onClick={eliminarTarea} className="flex items-center gap-1 text-red-600 hover:underline">
          <Trash2 size={16} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
