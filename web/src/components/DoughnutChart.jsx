// Recharts does not have a Doughnut export; use PieChart with innerRadius for doughnut style.
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export default function DoughnutChart({ data, dataKey, nameKey, colors, title }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h4 className="font-semibold mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={3}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
