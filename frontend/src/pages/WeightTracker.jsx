import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function WeightTracker() {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = () => {
    api.get('/weight').then(res => setLogs(res.data));
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/weight', { weight: Number(weight), logDate: new Date().toISOString() });
      toast.success('Weight logged!');
      setWeight('');
      fetchLogs();
    } catch {
      toast.error('Failed to log weight');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/weight/${id}`);
    fetchLogs();
  };

  const latest = logs[logs.length - 1];
  const first = logs[0];
  const diff = latest && first ? (latest.weight - first.weight).toFixed(1) : null;

  return (
    <div className="space-y-6">
      <h2 className="font-sriracha text-4xl font-bold text-yellow-700">Weight Tracker</h2>

      {/* Log Form */}
      <div className="bg-white border border-orange-100 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Log Today's Weight</h3>
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-gray-500 mb-1 block">Weight (kg)</label>
            <input
              required
              type="number"
              step="0.1"
              placeholder="e.g. 70.5"
              className="w-full bg-stone-700 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-primary-500"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Log Weight'}
          </button>
        </form>
      </div>

      {/* Stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white border border-orange-100 rounded-2xl p-3 md:p-5">
            <div className="text-gray-500 text-sm">Current</div>
            <div className="text-xl md:text-3xl font-bold text-blue-400 mt-1">{latest?.weight} kg</div>
          </div>
          <div className="bg-white border border-orange-100 rounded-2xl p-3 md:p-5">
            <div className="text-gray-500 text-sm">Starting</div>
            <div className="text-xl md:text-3xl font-bold text-gray-400 mt-1">{first?.weight} kg</div>
          </div>
          <div className="bg-white border border-orange-100 rounded-2xl p-3 md:p-5">
            <div className="text-gray-500 text-sm">Change</div>
            <div className={`text-xl md:text-3xl font-bold mt-1 ${Number(diff) < 0 ? 'text-green-500' : Number(diff) > 0 ? 'text-red-400' : 'text-gray-500'}`}>
              {diff > 0 ? '+' : ''}{diff} kg
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {logs.length > 1 && (
        <div className="bg-white border border-orange-100 rounded-2xl p-6">
          <h3 className="font-semibold mb-6">Weight History</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={logs}>
              <XAxis dataKey="logDate" tickFormatter={d => format(new Date(d), 'MMM d')} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#ffffff', borderRadius: 7 }}
                formatter={v => [`${v} kg`, 'Weight']}
                labelFormatter={d => format(new Date(d), 'MMM d, yyyy')}
              />
              <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log History Table */}
      {logs.length > 0 && (
        <div className="bg-white border border-orange-100 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">History</h3>
          <div className="space-y-2">
            {[...logs].reverse().map(log => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-orange-100 last:border-0">
                <span className="text-sm text-gray-500">{format(new Date(log.logDate), 'EEE, MMM d yyyy')}</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-primary-400">{log.weight} kg</span>
                  <button onClick={() => handleDelete(log.id)} className="text-gray-600 hover:text-red-400 transition-colors text-sm">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">⚖️</div>
          <p>Start tracking your weight</p>
        </div>
      )}
    </div>
  );
}
