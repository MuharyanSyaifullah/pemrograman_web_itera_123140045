# 📚 Aplikasi Manajemen Tugas Mahasiswa

**Deskripsi**  
Aplikasi web sederhana untuk membantu mahasiswa mengelola tugas akademik.  
Fitur utama: tambah / edit tugas, tandai selesai, hapus, pencarian & filter, penyimpanan lokal (`localStorage`), ekspor / impor JSON, dan validasi form (nama & deadline). ✅

---

## 🧭 Struktur Antarmuka (singkat)

- **Form Tambah / Edit (kiri):** isi Nama Tugas, Mata Kuliah (opsional), Deadline. ✏️  
- **Panel (kanan):** kotak pencarian, filter per mata kuliah & status, tombol Hapus Semua / Ekspor / Impor, daftar tugas. 🔍  
- **Masing-masing tugas:** checkbox (tandai selesai), tombol Edit, tombol Hapus. ✅🗑️

---

## ⚙️ Cara Menggunakan Fitur Utama

### ➕ Menambah tugas
1. Isi **Nama Tugas** (wajib) — contoh: *Laporan Praktikum Sistem Operasi*. ✍️  
2. Isi **Mata Kuliah** (opsional) — contoh: *Sistem Operasi*. 🎓  
3. Pilih **Deadline** (wajib) — tanggal harus hari ini atau setelahnya. 📅  
4. Klik **Simpan**. Tugas akan tersimpan ke `localStorage`. 💾

### ✏️ Mengedit tugas
1. Klik tombol **Edit** pada tugas yang diinginkan.  
2. Form akan terisi otomatis. Ubah data lalu klik **Simpan**. 🔁

### ✅ Menandai selesai / belum selesai
- Centang checkbox pada item tugas untuk menandai selesai; hilangkan centang untuk menandai belum selesai.  
- Jumlah tugas belum selesai ditampilkan di bawah form. 🔢

### 🗑️ Menghapus tugas
- Klik **Hapus** pada tugas → konfirmasi.  
- Untuk menghapus semua tugas sekaligus: klik **Hapus Semua** → konfirmasi. ⚠️

### 🔎 Mencari dan memfilter
- Ketik kata kunci di kolom pencarian untuk mencari berdasarkan nama tugas atau mata kuliah. 🔎  
- Gunakan dropdown **Semua Mata Kuliah** untuk memfilter per mata kuliah.  
- Gunakan **Semua Status / Belum Selesai / Selesai** untuk memfilter berdasarkan status. 📋

### 📤📥 Ekspor / Impor JSON
- **Ekspor JSON:** klik tombol **Ekspor JSON** → akan mengunduh file `tasks-export.json` berisi data tugas. 💾  
- **Impor:** klik label **Impor**, pilih file JSON yang diekspor sebelumnya (format: array objek tugas). Sistem akan menggantikan daftar tugas dengan isi file (validasi sederhana dilakukan). 🔄

---

> **Contoh format JSON ekspor**:
```json
[
  {
    "id": "k8f1a2b3",
    "name": "Laporan Praktikum OS",
    "course": "Sistem Operasi",
    "deadline": "2025-10-20",
    "completed": false,
    "createdAt": "2025-10-18T10:00:00.000Z"
  }
]
