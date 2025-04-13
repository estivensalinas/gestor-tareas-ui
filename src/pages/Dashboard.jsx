// ✅ DASHBOARD CON VISTA RESPONSIVE Y UX MEJORADA
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import { LogOut, ListTodo, User } from 'lucide-react';

const estados = ['pendiente', 'en progreso', 'completada'];

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState({ pendiente: [], 'en progreso': [], completada: [] });
  const [filters, setFilters] = useState({ pendiente: '', 'en progreso': '', completada: '' });
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get('/tasks');
    const agrupadas = { pendiente: [], 'en progreso': [], completada: [] };
    res.data.forEach(task => agrupadas[task.status].push(task));
    setTasks(agrupadas);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFilterChange = (status, value) => {
    setFilters(prev => ({ ...prev, [status]: value.toLowerCase() }));
  };

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;

    const origen = source.droppableId;
    const destino = destination.droppableId;
    if (origen === destino) return;

    const movedTask = tasks[origen][source.index];

    if (origen === 'pendiente' && destino !== 'en progreso') return;
    if (origen === 'en progreso' && destino !== 'completada') return;
    if (origen === 'completada') return;

    const nuevasTareas = { ...tasks };
    nuevasTareas[origen] = [...nuevasTareas[origen]];
    nuevasTareas[destino] = [...nuevasTareas[destino]];

    nuevasTareas[origen].splice(source.index, 1);
    nuevasTareas[destino].splice(destination.index, 0, { ...movedTask, status: destino });

    setTasks(nuevasTareas);

    try {
      await axios.put(`/tasks/${movedTask._id}`, { status: destino });
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      fetchTasks();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 p-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ListTodo size={24} /> Mis Tareas
          </h2>
          <div className="flex items-center gap-2 text-gray-600">
            <User size={18} />
            <span>{user?.name}</span>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
              onClick={logout}
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4">
            <TaskForm
              initialData={editingTask}
              onSubmit={() => {
                setEditingTask(null);
                fetchTasks();
              }}
              onCancel={() => setEditingTask(null)}
            />
          </div>

          <div className="flex-1 overflow-x-auto">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex md:grid md:grid-cols-3 gap-4 min-w-[1000px] md:min-w-0">
                {estados.map(status => (
                  <Droppable droppableId={status} key={status}>
                    {(provided) => {
                      const tareasFiltradas = tasks[status].filter(task =>
                        task.title.toLowerCase().includes(filters[status]) ||
                        (task.description?.toLowerCase().includes(filters[status]))
                      );

                      return (
                        <div
                          className="bg-white rounded-xl p-4 shadow-lg min-h-[700px] flex flex-col w-[300px] md:w-auto"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <div className="mb-4">
                            <h3 className="text-xl font-bold capitalize text-indigo-700 mb-2">{status}</h3>
                            <input
                              type="text"
                              placeholder="Buscar..."
                              value={filters[status]}
                              onChange={e => handleFilterChange(status, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300"
                            />
                          </div>

                          <div className="flex-1">
                            {tareasFiltradas.map((task, index) => (
                              <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="mb-3"
                                  >
                                    <TaskCard
                                      task={task}
                                      refresh={fetchTasks}
                                      onEdit={(task) => setEditingTask(task)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      );
                    }}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
