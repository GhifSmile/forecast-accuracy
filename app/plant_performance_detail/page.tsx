"use client"

import { FileUp } from "lucide-react";
import Navigation from "@/components/dashboard/Navigation";

export default function PlantPerformance() {
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

      {/* CONTENT SECTION - Tabel Performance Detail */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto text-slate-700">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#00C9A7] text-white uppercase tracking-wider font-bold">
                  <th className="px-4 py-3 border-r border-white/10">P.</th>
                  <th className="px-4 py-3 border-r border-white/10">S..</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Year</th>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                    <th key={m} className="px-2 py-3 border-r border-white/10 text-center">{m}</th>
                  ))}
                  <th className="px-4 py-3 border-r border-white/10 text-center">YTD Avg</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">VS Target</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Status</th>
                  <th className="px-4 py-3">Action Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Contoh Baris 1 */}
                <tr className="hover:bg-slate-50 transition-colors odd:bg-white even:bg-slate-50/30">
                  <td className="px-4 py-3 font-bold text-slate-800">CKP</td>
                  <td className="px-4 py-3">fish</td>
                  <td className="px-4 py-3 text-center">2025</td>
                  <td className="px-2 py-3 text-center">77%</td>
                  <td className="px-2 py-3 text-center">74%</td>
                  <td className="px-2 py-3 text-center">75%</td>
                  <td className="px-2 py-3 text-center">74%</td>
                  <td className="px-2 py-3 text-center">66%</td>
                  <td className="px-2 py-3 text-center">73%</td>
                  <td className="px-2 py-3 text-center">78%</td>
                  <td className="px-2 py-3 text-center">72%</td>
                  <td className="px-2 py-3 text-center">73%</td>
                  <td className="px-2 py-3 text-center">75%</td>
                  <td className="px-2 py-3 text-center">71%</td>
                  <td className="px-2 py-3 text-center">-</td>
                  <td className="px-4 py-3 text-center font-bold">55%</td>
                  <td className="px-4 py-3 text-center font-bold text-red-500">-23%</td>
                  <td className="px-4 py-3 text-center text-lg">🔴</td>
                  <td className="px-4 py-3 italic text-slate-400">Immediate Action</td>
                </tr>
                {/* Contoh Baris 2 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-800">LPG</td>
                  <td className="px-4 py-3">shrimp</td>
                  <td className="px-4 py-3 text-center">2025</td>
                  <td className="px-2 py-3 text-center">67%</td>
                  <td className="px-2 py-3 text-center">65%</td>
                  <td className="px-2 py-3 text-center">64%</td>
                  <td className="px-2 py-3 text-center">71%</td>
                  <td className="px-2 py-3 text-center">66%</td>
                  <td className="px-2 py-3 text-center">59%</td>
                  <td className="px-2 py-3 text-center">64%</td>
                  <td className="px-2 py-3 text-center">65%</td>
                  <td className="px-2 py-3 text-center">60%</td>
                  <td className="px-2 py-3 text-center">71%</td>
                  <td className="px-2 py-3 text-center">71%</td>
                  <td className="px-2 py-3 text-center">-</td>
                  <td className="px-4 py-3 text-center font-bold">72%</td>
                  <td className="px-4 py-3 text-center font-bold text-green-500">2%</td>
                  <td className="px-4 py-3 text-center text-lg">🟢</td>
                  <td className="px-4 py-3 italic text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-6 mt-10 border-t border-slate-200">
        © 2025 Digital Production | National Supply Chain
      </footer>

    </main>
  );
}