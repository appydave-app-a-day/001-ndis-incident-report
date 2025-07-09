import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AppLayout } from '@/components/layout';
import { ApiErrorTestButton } from '@/components/ui/ApiErrorTestButton';
import { SimpleToastTest } from '@/components/ui/SimpleToastTest';
import { ToastProvider } from '@/components/ui/toast';
import { ToastRegistrar } from '@/components/ui/ToastRegistrar';
import IncidentAnalysis from '@/routes/IncidentAnalysis';
import IncidentCapture from '@/routes/IncidentCapture';

function App() {
  return (
    <ToastProvider>
      <ToastRegistrar />
      <SimpleToastTest />
      <ApiErrorTestButton />
      <Router>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route path='/capture' element={<IncidentCapture />} />
            <Route path='/analysis' element={<IncidentAnalysis />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
