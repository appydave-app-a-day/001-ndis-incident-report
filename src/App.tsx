import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AppLayout } from '@/components/layout';
import IncidentAnalysis from '@/routes/IncidentAnalysis';
import IncidentCapture from '@/routes/IncidentCapture';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route path='/capture' element={<IncidentCapture />} />
          <Route path='/analysis' element={<IncidentAnalysis />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
