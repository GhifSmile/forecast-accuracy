import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db } from "@/lib/db"; 
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) return NextResponse.json({ error: "Sheet tidak ditemukan" }, { status: 400 });

    const valueSets: any[] = [];
    let isFileValid = true;
    let firstErrorRow = 0;

    const clean = (val: any) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'object' && val.result !== undefined) return val.result;
      return val;
    };

    const sanitizeStr = (val: any) => {
      if (val === null || val === undefined) return "";
      return String(val)
        .trim()
        .replace(/\s+/g, " ")
    }

    // --- TAHAP 1: VALIDASI SEMUA BARIS ---
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && isFileValid) {
        const rawValues = [
          clean(row.getCell(1).value),  // year
          clean(row.getCell(2).value),  // month
          clean(row.getCell(3).value),  // week
          row.getCell(4).value,  // plant
          row.getCell(5).value,  // business_unit
          row.getCell(6).value,  // category
          row.getCell(7).value,  // code
          clean(row.getCell(8).value),  // forecast
          clean(row.getCell(9).value),  // produksi
          clean(row.getCell(10).value)  // sales
        ];

        // Cek kelengkapan
        const isRowComplete = rawValues.every(val => val !== null && val !== undefined && val !== "");

        if (!isRowComplete) {
          isFileValid = false;
          firstErrorRow = rowNumber;
        } else {
          // Jika lengkap, kumpulkan sementara
          valueSets.push(sql`(
            ${Number(rawValues[0])}::int, 
            ${Number(rawValues[1])}::int, 
            ${Number(rawValues[2])}::int, 
            ${sanitizeStr(rawValues[3]).toLocaleUpperCase()}::varchar, 
            ${sanitizeStr(rawValues[4])}::varchar, 
            ${sanitizeStr(rawValues[5])}::varchar, 
            ${sanitizeStr(rawValues[6]).toLocaleUpperCase()}::varchar, 
            ${Number(rawValues[7])}::numeric, 
            ${Number(rawValues[8])}::numeric, 
            ${Number(rawValues[9])}::numeric,
            NOW()
          )`);
        }
      }
    });

    // --- TAHAP 2: EKSEKUSI ATAU TOLAK ---
    if (!isFileValid) {
      return NextResponse.json({ 
        error: `Upload dibatalkan. Baris ke-${firstErrorRow - 1} tidak lengkap. Mohon isi semua kolom.` 
      }, { status: 400 });
    }

    if (valueSets.length === 0) {
      return NextResponse.json({ error: "File kosong atau tidak ada data." }, { status: 400 });
    }

    // Hanya dijalankan jika SEMUA baris lulus validasi
    await db.execute(sql`
      INSERT INTO data_collection_forecast_accuracy 
      (year, month, week, plant, business_unit, category, code, forecast, produksi, sales, created_at)
      VALUES ${sql.join(valueSets, sql`, `)}
      ON CONFLICT (year, month, week, plant, business_unit, category, code)
      DO UPDATE SET
        forecast = EXCLUDED.forecast,
        produksi = EXCLUDED.produksi,
        sales = EXCLUDED.sales,
        created_at = NOW()
    `);

    return NextResponse.json({ message: `Berhasil! Seluruh data (${valueSets.length} baris) telah diupload.` });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan data ke database." }, { status: 500 });
  }
}