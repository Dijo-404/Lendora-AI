import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginGate from '@/pages/LoginGate';
import Dashboard from '@/pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginGate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
