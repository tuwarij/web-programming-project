import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../services/api';
import { format } from 'date-fns';

function StatCard1({ label, value, unit, icon, color }) {
  return (
    <div className={`bg-white border border-orange-100 rounded-2xl p-5 `}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className={`text-3xl font-display font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{unit}</div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const { today, weeklyCalories, weightLogs, user } = data || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-sriracha text-4xl font-bold text-amber-700">Dashboard</h2>
        <p className="text-gray-500 mt-1">{format(new Date(), 'EEEE, MMMM d')} · 🎯 Lose Weight</p>
      </div>
    
      {/* Today Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4  ">
        <StatCard1 label="Calories In" value={Math.round(today?.caloriesIn || 0)} unit="kcal today" icon="🍎" color="text-orange-400" />
        <StatCard1 label="Calories Burned" value={Math.round(today?.caloriesBurned || 0)} unit="kcal today" icon="🔥" color="text-red-400" />
        <StatCard1 label="Net Calories" value={Math.round(today?.net || 0)} unit="kcal balance" icon="⚡" color="text-yellow-400" />
        <StatCard1 label="Workouts" value={today?.workoutCount || 0} unit="sessions today" icon="💪" color="text-primary-400" />
      </div>

      {/* Weekly Calories Chart */}
      <div className="bg-white border border-orange-100 rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-6">Weekly Calories</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyCalories} barGap={4}>
            <XAxis dataKey="date" tickFormatter={d => format(new Date(d + 'T24:00:00'), 'EEE')} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#ffffff', borderRadius: 7 }}
              labelFormatter={d => format(new Date(d + 'T24:00:00'), 'EEE, MMM d')}
            />
            <Bar dataKey="caloriesIn" name="Intake" fill="#f97316" radius={[6, 6, 6, 6]} />
            <Bar dataKey="caloriesBurned" name="Burned" fill="#22c55e" radius={[6, 6, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weight Chart */}
      {weightLogs?.length > 0 && (
        <div className="bg-white border border-orange-100 rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-6">Weight Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weightLogs}>
              <XAxis dataKey="logDate" tickFormatter={d => format(new Date(d), 'MMM d')} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#ffffff', borderRadius: 7 }}
                formatter={v => [`${v} kg`, 'Weight']}
                labelFormatter={d => format(new Date(d), 'MMM d, yyyy')}
              />
              <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
