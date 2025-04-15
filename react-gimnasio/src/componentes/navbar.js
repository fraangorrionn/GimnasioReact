// src/components/Navbar.js
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/clases">Clases</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/registro">Registro</Link></li>
      </ul>
    </nav>
  );
}
