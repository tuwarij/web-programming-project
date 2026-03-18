import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CATEGORIES = ['cardio', 'strength', 'flexibility'];
const EMPTY = { name: '', category: 'cardio', duration: '', caloriesBurned: '', sets: '', reps: '', weight: '' };

const categoryColor = { cardio: 'text-red-400', strength: 'text-blue-400', flexibility: 'text-purple-400' };
const categoryIcon = { cardio: '🏃', strength: '🏋️', flexibility: '🧘' };

export default function WorkoutLog() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const fetchLogs = () => {
    api.get(`/workout?date=${date}`).then(res => setLogs(res.data));
  };

  useEffect(() => { fetchLogs(); }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/workout', {
        ...form,
        duration: Number(form.duration),
        caloriesBurned: form.caloriesBurned ? Number(form.caloriesBurned) : undefined,
        sets: form.sets ? Number(form.sets) : undefined,
        reps: form.reps ? Number(form.reps) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        logDate: new Date(date).toISOString(),
      });
      toast.success('Workout logged!');
      setForm(EMPTY);
      setShowForm(false);
      fetchLogs();
    } catch {
      toast.error('Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/workout/${id}`);
    toast.success('Deleted');
    fetchLogs();
  };

  const totalMinutes = logs.reduce((s, l) => s + l.duration, 0);
  const totalBurned = logs.reduce((s, l) => s + (l.caloriesBurned || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <h2 className="font-sriracha text-4xl font-bold text-sky-800">Workout Log</h2>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="flex-1 sm:flex-none bg-stone-700 border border-primary-50 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            + Add Workout
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <span className="text-gray-500 text-sm">Total Time</span>
          <div className="text-3xl font-bold text-blue-400">{totalMinutes} min</div>
        </div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <span className="text-gray-500 text-sm">Calories Burned</span>
          <div className="text-3xl font-bold text-red-400">{Math.round(totalBurned)}</div>
        </div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5">
          <span className="text-gray-500 text-sm">Sessions</span>
          <div className="text-3xl font-bold text-yellow-400">{logs.length}</div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white border border-orange-100 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Log Workout</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Exercise Name *</label>
                <input required className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100  focus:outline-none focus:border-primary-500" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Running, Push-ups" />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Category</label>
                <select className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Duration (min) *</label>
                <input required type="number" className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Calories Burned</label>
                <input type="number" className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.caloriesBurned} onChange={e => setForm(p => ({ ...p, caloriesBurned: e.target.value }))} />
              </div>
              {form.category === 'strength' && (
                <>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Sets</label>
                    <input type="number" className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.sets} onChange={e => setForm(p => ({ ...p, sets: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Reps</label>
                    <input type="number" className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.reps} onChange={e => setForm(p => ({ ...p, reps: e.target.value }))} />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors">
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-200 px-4 py-2 rounded-xl text-sm transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log List */}
      {logs.length > 0 && (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="bg-white border border-orange-100 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{categoryIcon[log.category]}</div>
                <div>
                  <div className="font-medium">{log.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    <span className={`${categoryColor[log.category]} font-medium capitalize`}>{log.category}</span>
                    {' · '}{log.duration} min
                    {log.sets ? ` · ${log.sets}×${log.reps} sets` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {log.caloriesBurned && <span className="text-red-400 font-semibold">{log.caloriesBurned} kcal</span>}
                <button onClick={() => handleDelete(log.id)} className="text-gray-600 hover:text-red-400 transition-colors text-sm">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {logs.length === 0 && !showForm && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">💪</div>
          <p>No workouts logged for this day</p>
        </div>
      )}
    </div>
  );
}
