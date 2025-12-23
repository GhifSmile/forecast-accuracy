"use client"; // Ini wajib agar bisa menjalankan fungsi klik/upload

import { FileUp } from "lucide-react";

export default function UploadButton() {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`File ${file.name} terpilih. Siap untuk diproses!`);
      // Nantinya logika upload API ditaruh di sini
    }
  };

  return (
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
        onChange={handleFileChange}
      />
    </label>
  );
}