"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Line, Legend } from 'recharts';
import { MonthlyTrendData } from "@/services/forecastAccuracy"; // Sesuaikan path import

interface Props {
  data: MonthlyTrendData[];
}

export default function TrendAccuracyChart({ data }: Props) {

  const chartData = data.map(item => ({
    ...item,
    Target: 75 // Sesuai target overall yang Anda inginkan
  }));

  return (
    <Card className="shadow-sm rounded-xl overflow-visible">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">Overall Accuracy Trend</CardTitle>
      </CardHeader>
      {/* Tinggi disesuaikan ke 350px agar ada ruang untuk legend di bawah */}
      <CardContent className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -15, bottom: 20 }}>

            <defs>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00acc1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00acc1" stopOpacity={0}/>
              </linearGradient>
            </defs>

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
              domain={[50, 100]} 
              fontSize={10} // Mengecilkan ukuran font label Y
              className="text-slate-500 font-medium"
            />
            
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: number | string | undefined, labelName: any) => {
                if (value === undefined) return ["0.00%", labelName ?? "Accuracy"];

                const formattedValue = Number(value).toFixed(2);

                // labelName ?? "Accuracy" memastikan jika name undefined, tooltip tidak pecah
                return [`${formattedValue}%`, labelName];
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
              type="linear" 
              dataKey="overallAccuracy" 
              stroke="#00acc1" 
              dot={{ 
                  r: 4,               // Ukuran radius titik
                  fill: "#00acc1",    // Warna isi titik (samakan dengan stroke)
                  strokeWidth: 0,     // Menghilangkan border agar terlihat full solid
                  fillOpacity: 1      // Memastikan warna titik tidak transparan
                }}
              fillOpacity={1} 
              fill="url(#colorAccuracy)" 
              strokeWidth={2} 
              name="Overall Accuracy"
            />
            
            {/* Line untuk Target - Menggunakan dataKey yang sama di dalam AreaChart */}
            <Line 
              type="linear" 
              dataKey="Target" 
              stroke="#f04487" 
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