// src/components/ComparisonBarChart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Line } from 'recharts';
import { PlantComparisonData } from "@/services/forecastAccuracy";

interface ComparisonBarChartProps {
  data: PlantComparisonData[];
}


export default function ComparisonBarChart({ data }: ComparisonBarChartProps) {
  const tooltipOrder = ["Overall Accuracy", "Fish Accuracy", "Shrimp Accuracy"];

  const sortedData = [...data].sort((a, b) => a.overallAccuracy - b.overallAccuracy);

  return (
    <Card className="shadow-sm rounded-xl overflow-visible">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">Comparison Chart</CardTitle>
      </CardHeader>
      {/* Tingkatkan h-[300px] menjadi h-[350px] untuk memberi ruang legend di mobile */}
      <CardContent className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            // Tambahkan margin bottom yang signifikan (minimal 20-30)
            margin={{ top: 20, right: 30, left: -10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis 
              dataKey="plant" 
              tickLine={false} 
              axisLine={false} 
              fontSize={10}
              dy={5} // Memberi jarak antara tick dan bar
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]} 
              fontSize={10}
            />

<Tooltip 
              cursor={{fill: '#f8fafc'}}
              itemSorter={(item) => {
                return tooltipOrder.indexOf(item.name as string);
              }}
              // PERBAIKAN: Menggunakan labelName: any untuk menghindari error TS deprecated & incompatible type
              formatter={(value: number | string | undefined, labelName: any) => {
                if (typeof value === 'undefined') return ["0.00%", labelName];
                
                const formattedValue = Number(value).toFixed(2);
                
                // Mengembalikan nama label secara dinamis agar menyesuaikan (Overall Accuracy, dll)
                return [`${formattedValue}%`, labelName];
              }}
            />           
            
            {/* PERBAIKAN LEGEND */}
            <Legend 
              verticalAlign="bottom" 
              align="center" // Mengembalikan posisi ke tengah
              iconType="circle"
              iconSize={8}          
              formatter={(value) => <span className="text-slate-700">{value}</span>}
              wrapperStyle={{ 
                fontSize: '10px', 
                paddingTop: '20px', // Memberi jarak agar tidak tabrakan dengan nama Plant (SBY, LPG, dll)
                position: 'relative',
                width: '100%' // Memastikan container legend mengambil lebar penuh agar alignment center akurat
              }} 
            />       

            <ReferenceLine 
              y={75} 
              stroke="#f04487" 
              strokeDasharray="5 5" 
              strokeWidth={1.5}
              // Styling label agar berada di pojok kiri atas garis
              label={{ 
                value: 'Target 75%', 
                position: 'insideTopLeft', // Menempatkan label di sisi kiri atas garis
                fill: '#f04487', 
                fontSize: 10,
                fontWeight: 'light',
                dx: -5,  // Geser 10px ke kanan agar tidak menempel sumbu Y
                dy: -20  // Geser 10px ke atas agar tidak menempel garis dashed
              }} 
            />
            
            <Bar name="Overall Accuracy" dataKey="overallAccuracy" fill="#00acc1" radius={[2, 2, 0, 0]} />
            <Bar name="Fish Accuracy" dataKey="fishAccuracy" fill="#ff8c00" radius={[2, 2, 0, 0]} />
            <Bar name="Shrimp Accuracy" dataKey="shrimpAccuracy" fill="#ab47bc" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}