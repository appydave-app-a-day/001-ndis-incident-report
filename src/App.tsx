import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '@/routes/Home';
import IncidentAnalysis from '@/routes/IncidentAnalysis';
import IncidentCapture from '@/routes/IncidentCapture';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/capture' element={<IncidentCapture />} />
        <Route path='/analysis' element={<IncidentAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
