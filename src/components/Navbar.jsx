import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">Gestor de Tareas</h1>
        <button
          className="md:hidden text-indigo-600"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>
      <div className={`mt-2 md:flex ${open ? 'block' : 'hidden'}`}>
        <Link to="/" className="block md:inline-block px-4 py-2 text-indigo-600 hover:bg-indigo-100">Login</Link>
        <Link to="/register" className="block md:inline-block px-4 py-2 text-indigo-600 hover:bg-indigo-100">Registro</Link>
      </div>
    </nav>
  );
};

export default Navbar;
