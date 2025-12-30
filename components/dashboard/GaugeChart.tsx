"use client"

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Handle SSR untuk Next.js
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface Props {
  value: number;
  title: string;
  type: 'overall' | 'fish' | 'shrimp';
}

export default function GaugeChart({ value, title, type }: Props) {

  const getArcConfig = () => {
    switch (type) {
      case 'overall':
        return [
          { limit: 60, color: '#f04487' }, // Merah (0 - 60)
          { limit: 75, color: '#fbb92c' }, // Kuning (60 - 75)
          { limit: 100, color: '#02d1a7' } // Hijau (75 - 100)
        ];
      case 'fish':
        return [
          { limit: 60, color: '#f04487' }, // Merah (0 - 60)
          { limit: 78, color: '#fbb92c' }, // Kuning (60 - 78)
          { limit: 100, color: '#02d1a7' } // Hijau (78 - 100)
        ];
      case 'shrimp':
        return [
          { limit: 60, color: '#f04487' }, // Merah (0 - 60)
          { limit: 70, color: '#fbb92c' }, // Kuning (60 - 70)
          { limit: 100, color: '#02d1a7' } // Hijau (70 - 100)
        ];
      default:
        return [];
    }
  };

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
                formatTextValue: (val: number) => `${val.toFixed(0)}%`,
                style: {
                    fill: "#000000",      // Warna tulisan hitam
                    textShadow: "none",   // Menghilangkan shadow
                    fontWeight: "bold",
              }
            },
            tickLabels: {
              type: "outer",
              defaultTickValueConfig: {
                formatTextValue: (value: number) => `${value.toFixed(0)}%`,
                style: {
                    fill: "#000000", // Warna hitam pekat
                    textShadow: "none",
                    fontSize: 7,
                }
              },
              ticks: [
                { value: 25 },
                { value: 50 },
                { value: 75 },
                { value: 100 },
              ]
            }
          }}
          arc={{
            subArcs: getArcConfig(),
            padding: 0.02,
            width: 0.3,
            cornerRadius: 0
          }}
          pointer={{
            elastic: true,
            animationDelay: 0,
            type: "needle",
            color: '#000000',     // Warna biru gelap charcoal
            baseColor: '#000000', // Warna poros sama dengan jarum
            width: 15,         // Sedikit lebih tebal agar terlihat tegas
            length: 0.75,            
          }}
        />
        {/* Label Angka di Bawah Gauge */}
        {/* <div className="text-2xl font-bold text-slate-900 -mt-4">{value}%</div> */}
      </CardContent>
    </Card>
  );
}