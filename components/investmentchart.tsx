import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { año: 2018, valor: 1200 },
  { año: 2019, valor: 2200 },
  { año: 2020, valor: 3400 },
  { año: 2021, valor: 4800 },
  { año: 2022, valor: 7500 },
];

const InvestmentChart = () => {
  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">📊 Inversión en IA (en millones de dólares)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="año" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentChart;