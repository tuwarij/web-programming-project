import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const EMPTY = { name: '', calories: '', protein: '', carbs: '', fat: '', mealType: 'breakfast' };

export default function FoodLog() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const fetchLogs = () => {
    api.get(`/food?date=${date}`).then(res => setLogs(res.data));
  };

  useEffect(() => { fetchLogs(); }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/food', {
        ...form,
        calories: Number(form.calories),
        protein: form.protein ? Number(form.protein) : undefined,
        carbs: form.carbs ? Number(form.carbs) : undefined,
        fat: form.fat ? Number(form.fat) : undefined,
        logDate: new Date(date).toISOString(),
      });
      toast.success('Food logged!');
      setForm(EMPTY);
      setShowForm(false);
      fetchLogs();
    } catch {
      toast.error('Failed to log food');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/food/${id}`);
    toast.success('Deleted');
    fetchLogs();
  };

  const totalCal = logs.reduce((s, l) => s + l.calories, 0);

  const byMeal = MEAL_TYPES.reduce((acc, m) => {
    acc[m] = logs.filter(l => l.mealType === m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <h2 className="font-sriracha text-4xl font-bold text-orange-700">Food Log</h2>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="flex-1 sm:flex-none bg-stone-700 border border-primary-50 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-100"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            + Add Food
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-orange-100 rounded-2xl p-5"><span className="text-gray-500 text-sm">Total Calories</span><div className="text-3xl font-bold text-orange-400">{Math.round(totalCal)}</div></div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5"><span className="text-gray-500 text-sm">Protein</span><div className="text-3xl font-bold text-blue-400">{Math.round(logs.reduce((s, l) => s + (l.protein || 0), 0))}g</div></div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5"><span className="text-gray-500 text-sm">Carbs</span><div className="text-3xl font-bold text-yellow-400">{Math.round(logs.reduce((s, l) => s + (l.carbs || 0), 0))}g</div></div>
        <div className="bg-white border border-orange-100 rounded-2xl p-5"><span className="text-gray-500 text-sm">Fat</span><div className="text-3xl font-bold text-red-400">{Math.round(logs.reduce((s, l) => s + (l.fat || 0), 0))}g</div></div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white border border-orange-100 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Log Food</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Food Name *</label>
                <input required className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Calories *</label>
                <input required type="number" className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.calories} onChange={e => setForm(p => ({ ...p, calories: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Meal Type</label>
                <select className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.mealType} onChange={e => setForm(p => ({ ...p, mealType: e.target.value }))}>
                  {MEAL_TYPES.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Protein (g)</label>
                <input type="number" className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.protein} onChange={e => setForm(p => ({ ...p, protein: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Carbs (g)</label>
                <input type="number" className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.carbs} onChange={e => setForm(p => ({ ...p, carbs: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Fat (g)</label>
                <input type="number" className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-primary-500" value={form.fat} onChange={e => setForm(p => ({ ...p, fat: e.target.value }))} />
              </div>
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

      {/* Logs by Meal */}
      {MEAL_TYPES.map(meal => byMeal[meal].length > 0 && (
        <div key={meal} className="bg-white border border-orange-100 rounded-2xl p-6">
          <h3 className="font-semibold capitalize mb-4 text-orange-800">{meal}</h3>
          <div className="space-y-3">
            {byMeal[meal].map(log => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-orange-100 last:border-0">
                <div>
                  <div className="font-sriracha text-2xl text-gray-700">{log.name}</div>
                  <div className="text-xs text-gray-500">
                    {log.protein ? `P: ${log.protein}g · ` : ''}
                    {log.carbs ? `C: ${log.carbs}g · ` : ''}
                    {log.fat ? `F: ${log.fat}g` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-400 font-semibold">{log.calories} kcal</span>
                  <button onClick={() => handleDelete(log.id)} className="text-gray-600 hover:text-red-400 transition-colors text-sm">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {logs.length === 0 && !showForm && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🍽️</div>
          <p>No food logged for this day</p>
        </div>
      )}
    </div>
  );
}
