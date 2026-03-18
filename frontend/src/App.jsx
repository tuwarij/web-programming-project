import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FoodLog from './pages/FoodLog';
import WorkoutLog from './pages/WorkoutLog';
import WeightTracker from './pages/WeightTracker';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="food" element={<FoodLog />} />
          <Route path="workout" element={<WorkoutLog />} />
          <Route path="weight" element={<WeightTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}