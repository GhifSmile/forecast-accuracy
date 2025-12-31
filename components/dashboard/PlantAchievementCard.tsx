"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantComparisonData } from "@/services/forecastAccuracy";

interface Props {
  data: PlantComparisonData[];
  target?: number;
}

export default function PlantAchievementCard({ data, target = 75 }: Props) {
  const achievedCount = data.filter(p => p.overallAccuracy >= target).length;
  const TOTAL_PLANTS = 7;

  return (
    <Card className="bg-white border-none shadow-sm w-full overflow-hidden">
      {/* pt-2 dan pb-0 untuk mepet ke atas */}
      <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-center justify-center">
        <CardTitle className="text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-widest text-center leading-none">
          Plant Achievement
        </CardTitle>
      </CardHeader>

      {/* pb-2 untuk mengurangi ruang di bawah */}
      <CardContent className="flex flex-col items-center justify-center pt-0 pb-2">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1">
            {/* leading-none sangat penting untuk membuang spasi kosong di atas/bawah angka */}
            <span className="text-5xl sm:text-6xl font-black text-slate-800 tracking-tighter leading-none">
              {achievedCount}
            </span>
            <span className="text-2xl font-bold text-slate-200">/</span>
            <span className="text-2xl font-bold text-slate-400">
              {TOTAL_PLANTS}
            </span>
          </div>
          {/* -mt-1 untuk menarik teks naik lebih dekat ke angka */}
          <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-[0.2em] text-center -mt-1">
            Plants on Target
          </p>
        </div>

        {/* mt-2 agar bar lebih rapat ke teks */}
        <div className="mt-2 flex justify-center w-full px-4">
          <div className="w-full max-w-[150px] h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${
                achievedCount >= 6 ? 'bg-[#00C9A7]' : 'bg-[#FF8C00]'
              }`}
              style={{ width: `${(achievedCount / TOTAL_PLANTS) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}