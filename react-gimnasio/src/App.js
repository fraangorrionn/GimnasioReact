import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClasesPage from './pages/ClasesPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/clases" element={<ClasesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
      </Routes>
    </Router>
  );
}

export default App;
