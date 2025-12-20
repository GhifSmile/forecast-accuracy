"use client"

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Handle SSR untuk Next.js
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface Props {
  value: number;
  title: string;
}

export default function GaugeChart({ value, title }: Props) {
  return (
    <Card className="bg-white border-none shadow-sm">
        
      <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-center justify-center">
        <CardTitle className="text-[12px] font-bold text-black uppercase tracking-widest text-center">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[200] flex flex-col items-center justify-center">
        <GaugeComponent
          value={value}
          type="radial"
          style={{ 
              width: "100%", 
              maxWidth: "260px", // Mencegah gauge terlalu raksasa di mobile
              margin: "0 auto",
            }}
          labels={{
            valueLabel: {
                style: {
                    fill: "#000000",      // Warna tulisan hitam
                    textShadow: "none",   // Menghilangkan shadow
                    fontWeight: "bold",
              }
            },
            tickLabels: {
              type: "outer",
              defaultTickValueConfig: {
                formatTextValue: (value: any) => `${value}%`,
                style: {
                    fill: "#000000", // Warna hitam pekat
                    textShadow: "none",
                    fontSize: 7,
                }
              },
              ticks: [
                { value: 20 },
                { value: 40 },
                { value: 60 },
                { value: 80 },
                { value: 100 }
              ]
            }
          }}
          arc={{
            colorArray: ['#5BE12C','#EA4228'], // Warna sesuai request Anda
            subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
            padding: 0.02,
            width: 0.3
          }}
          pointer={{
            elastic: true,
            animationDelay: 0
          }}
        />
        {/* Label Angka di Bawah Gauge */}
        {/* <div className="text-2xl font-bold text-slate-900 -mt-4">{value}%</div> */}
      </CardContent>
    </Card>
  );
}