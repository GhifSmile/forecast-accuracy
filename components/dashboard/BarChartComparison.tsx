// src/components/ComparisonBarChart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'SBY', 'Overall Accuracy': 20, 'Fish Accuracy': 15, 'Shrimp Accuracy': 18 },
  { name: 'LPG', 'Overall Accuracy': 35, 'Fish Accuracy': 28, 'Shrimp Accuracy': 25 },
  { name: 'SPJ', 'Overall Accuracy': 48, 'Fish Accuracy': 40, 'Shrimp Accuracy': 15 },
  { name: 'CKP', 'Overall Accuracy': 55, 'Fish Accuracy': 45, 'Shrimp Accuracy': 38 },
  { name: 'MON', 'Overall Accuracy': 75, 'Fish Accuracy': 65, 'Shrimp Accuracy': 42 },
];

export default function ComparisonBarChart() {
  return (
    <Card className="shadow-sm rounded-xl overflow-visible">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">Comparison Chart</CardTitle>
      </CardHeader>
      {/* Tingkatkan h-[300px] menjadi h-[350px] untuk memberi ruang legend di mobile */}
      <CardContent className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            // Tambahkan margin bottom yang signifikan (minimal 20-30)
            margin={{ top: 20, right: 30, left: -10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false} 
              fontSize={10}
              dy={5} // Memberi jarak antara tick dan bar
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 80]} 
              fontSize={10}
            />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              formatter={(value: number | string | undefined) => {
                if (typeof value === 'undefined') return ["0%", "Accuracy"];
                return [`${value}%`, "Accuracy"];
              }}
            />
            
            {/* PERBAIKAN LEGEND */}
            <Legend 
              verticalAlign="bottom" 
              align="center" // Mengembalikan posisi ke tengah
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ 
                fontSize: '10px', 
                paddingTop: '20px', // Memberi jarak agar tidak tabrakan dengan nama Plant (SBY, LPG, dll)
                position: 'relative',
                width: '100%' // Memastikan container legend mengambil lebar penuh agar alignment center akurat
              }} 
            />
            
            <Bar dataKey="Fish Accuracy" fill="#FF8C00" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Overall Accuracy" fill="#22C55E" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Shrimp Accuracy" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}