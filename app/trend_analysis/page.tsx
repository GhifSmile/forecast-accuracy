"use client"

import { FileUp } from "lucide-react";
import Navigation from "@/components/dashboard/Navigation";

export default function TrendAnalysis() {
  // Data dummy berdasarkan gambar referensi trend analysis
  const trendData = [
    { year: 2025, month: "January", overall: "74%", fish: "75%", shrimp: "70%", best: "MDN", worst: "LPG" },
    { year: 2025, month: "February", overall: "72%", fish: "74%", shrimp: "66%", best: "MDN", worst: "SBY" },
    { year: 2025, month: "March", overall: "73%", fish: "76%", shrimp: "62%", best: "SPJ", worst: "SBY" },
    { year: 2025, month: "April", overall: "72%", fish: "75%", shrimp: "66%", best: "MDN", worst: "SBY" },
    { year: 2025, month: "May", overall: "70%", fish: "72%", shrimp: "64%", best: "MDN", worst: "SBY" },
    { year: 2025, month: "June", overall: "71%", fish: "74%", shrimp: "61%", best: "SPJ", worst: "SBY" },
    { year: 2025, month: "July", overall: "71%", fish: "74%", shrimp: "66%", best: "CKP", worst: "LPG" },
    { year: 2025, month: "August", overall: "70%", fish: "72%", shrimp: "65%", best: "MDN", worst: "SBY" },
    { year: 2025, month: "September", overall: "71%", fish: "74%", shrimp: "64%", best: "MDN", worst: "SBY" },
    { year: 2025, month: "October", overall: "69%", fish: "70%", shrimp: "66%", best: "CKP", worst: "SBY" },
    { year: 2025, month: "November", overall: "59%", fish: "59%", shrimp: "61%", best: "CKP", worst: "SBY" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER SECTION */}
      <header className="bg-[#FF8C00] pt-4 pb-6 px-6 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          
          {/* Baris Atas: Logo, Judul, dan Navigasi */}
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4 text-center lg:text-left">
            
            {/* Wadah Image dan Tulisan */}
            <div className="flex flex-col items-center lg:items-start gap-3">
              {/* Wadah Image (Placeholder) */}
              <div className="relative w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 overflow-hidden flex-shrink-0">
                {/* Ganti src="/logo.png" dengan path gambar Anda nantinya. 
                  Jika belum ada, kotak ini berfungsi sebagai wadah transparan.
                */}
                <div className="text-[10px] opacity-50 text-center px-1">Image Area</div>
                {/* <Image src="/path-to-your-logo.png" alt="Logo" fill className="object-contain p-2" /> */}
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase">
                  Monitoring Forecast Accuracy
                </h1>
                <p className="text-xs md:text-sm italic opacity-80 mt-1 text-orange-100">
                  Striving to achieve the best planning process
                </p>
              </div>
            </div>
            
            {/* Navigasi Utama */}
            <div className="w-full lg:w-auto flex justify-center">
              <Navigation />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-4 pt-4 border-t border-white/20">

            {/* Filter Group - Posisinya di kiri (Desktop) atau bawah (Mobile) */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 order-2 lg:order-1">
               {["Year", "Month"].map((label) => (
                 <div key={label} className="w-32 bg-white text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold shadow-md flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all active:scale-95">
                   <span>{label}</span>
                   <span className="text-[10px] opacity-40">▼</span>
                 </div>
               ))}
            </div>
             
            {/* Tombol Tambah Data - Versi Ramping & Elegant */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <label className="
                w-auto min-w-[180px] lg:w-auto 
                cursor-pointer group flex items-center justify-center gap-2 
                bg-black/20 hover:bg-white border border-white/20 
                text-white hover:text-orange-600 
                px-5 py-2 rounded-lg transition-all duration-300 shadow-xl active:scale-95"
              >
                <FileUp className="w-4 h-4 opacity-80" />
                <span className="text-[11px] font-medium tracking-[0.15em]">
                  Add Data (.xlsx)
                </span>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) alert(`File ${file.name} terpilih`);
                  }}
                />
              </label>
            </div>
                
          </div>
          
        </div>
      </header>

      {/* CONTENT SECTION - Tabel Trend Analysis */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto text-slate-700">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#00C9A7] text-white uppercase tracking-wider font-bold">
                  <th className="px-4 py-3 border-r border-white/10">Year</th>
                  <th className="px-4 py-3 border-r border-white/10">Month</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Overall Accuracy</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Fish Accuracy</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Shrimp Accuracy</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Best Performing Plant</th>
                  <th className="px-4 py-3 text-center">Worst Performing Plant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trendData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors odd:bg-white even:bg-slate-50/30">
                    <td className="px-4 py-3 border-r border-slate-100">{row.year}</td>
                    <td className="px-4 py-3 border-r border-slate-100 font-medium">{row.month}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center font-bold">{row.overall}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center">{row.fish}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center">{row.shrimp}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center font-semibold text-teal-600">{row.best}</td>
                    <td className="px-4 py-3 text-center font-semibold text-red-600">{row.worst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 py-6 mt-10 border-t border-slate-200">
        © 2025 Digital Production | National Supply Chain
        {/* <div className="mt-1">
          <Link href="#" className="hover:underline mx-1">Data Last Updated: 12/19/2023 1:12:35 AM</Link> | 
          <Link href="#" className="hover:underline mx-1">Privacy Policy</Link>
        </div> */}
      </footer> 
    </main>
  );
}