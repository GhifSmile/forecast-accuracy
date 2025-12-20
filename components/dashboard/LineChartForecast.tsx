"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Line, Legend } from 'recharts';

const data = [
  { month: 'Jan', 'Overall Accuracy': 70, 'Target': 75 },
  { month: 'Feb', 'Overall Accuracy': 72, 'Target': 75 },
  { month: 'Mar', 'Overall Accuracy': 68, 'Target': 75 },
  { month: 'Apr', 'Overall Accuracy': 65, 'Target': 75 },
  { month: 'May', 'Overall Accuracy': 69, 'Target': 75 },
  { month: 'Jun', 'Overall Accuracy': 71, 'Target': 75 },
  { month: 'Jul', 'Overall Accuracy': 70, 'Target': 75 },
  { month: 'Aug', 'Overall Accuracy': 73, 'Target': 75 },
  { month: 'Sep', 'Overall Accuracy': 69, 'Target': 75 },
  { month: 'Oct', 'Overall Accuracy': 58, 'Target': 75 },
  { month: 'Nov', 'Overall Accuracy': 55, 'Target': 75 },
  { month: 'Dec', 'Overall Accuracy': 60, 'Target': 75 },
];

export default function TrendAccuracyChart() {
  return (
    <Card className="shadow-sm rounded-xl overflow-visible">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">Overall Accuracy Trend</CardTitle>
      </CardHeader>
      {/* Tinggi disesuaikan ke 350px agar ada ruang untuk legend di bawah */}
      <CardContent className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: -15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              fontSize={10} // Mengecilkan ukuran font label X
              dy={10} 
              className="text-slate-500 font-medium"
            />
            
            <YAxis 
              tickFormatter={(value) => `${value}%`} 
              tickLine={false} 
              axisLine={false} 
              domain={[50, 80]} 
              fontSize={10} // Mengecilkan ukuran font label Y
              className="text-slate-500 font-medium"
            />
            
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: number | string | undefined) => {
                // Menangani kasus jika nilai kosong/undefined
                if (value === undefined) return ["0%", "Accuracy"];
                
                // Mengembalikan format [Nilai_Teks, Nama_Label]
                return [`${value}%`, "Accuracy"];
              }}  
              cursor={{ stroke: '#cccccc', strokeWidth: 1 }}
            />

            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ 
                fontSize: '10px', 
                paddingTop: '30px',
                position: 'relative'
              }} 
            />

            {/* Area untuk Accuracy */}
            <Area 
              type="monotone" 
              dataKey="Overall Accuracy" 
              stroke="#10B981" 
              fillOpacity={0.1} 
              fill="#10B981" 
              strokeWidth={2} 
              name="Overall Accuracy"
            />
            
            {/* Line untuk Target - Menggunakan dataKey yang sama di dalam AreaChart */}
            <Line 
              type="monotone" 
              dataKey="Target" 
              stroke="#FF8C00" 
              strokeDasharray="5 5" 
              strokeWidth={1.5} 
              dot={false} 
              name="Target Accuracy"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}