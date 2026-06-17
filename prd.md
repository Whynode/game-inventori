# Brief Pengembangan Website Internal Feryshop

## 1. Gambaran Umum

Feryshop adalah bisnis jual beli akun game dan jasa digital. Website internal ini dibuat untuk menggantikan sistem Notion secara bertahap dan menjadi pusat operasional bisnis.

Website digunakan untuk:

1. Manajemen stok akun game.
2. Pembelian stok.
3. Penjualan stok.
4. Booking / DP / cicilan / pelunasan.
5. Tukar tambah akun.
6. Cancel dan refund.
7. Penanganan akun bermasalah.
8. Rekap keuangan dan saldo rekening.
9. Dashboard performa bisnis.
10. Audit aktivitas admin.

Target utama sistem adalah membuat operasional lebih rapi, mudah diaudit, dan siap dikembangkan untuk otomatisasi lanjutan seperti n8n, Telegram bot, atau integrasi lain.

---

## 2. Prinsip Sistem yang Wajib Dipakai

Developer tidak boleh hanya membuat sistem berbasis edit status biasa. Sistem harus menyimpan history.

Prinsip utama:

1. **Satu transaksi utama / deal bisa memiliki banyak pembayaran.**

   * Contoh: customer DP 20%, lalu cicil, lalu pelunasan.
   * Semua tetap dalam satu deal yang sama.
   * Setiap pembayaran dicatat sebagai payment record terpisah.

2. **Semua pergerakan uang wajib masuk ledger keuangan.**

   * Uang masuk.
   * Uang keluar.
   * Refund.
   * Cashback tukar tambah.
   * Mutasi antar rekening.
   * Pembayaran ke penjual stok.

3. **Stok punya status aktif, tapi history tidak boleh hilang.**

   * Jika akun sudah terjual lalu bermasalah, stok tetap punya history terjual.
   * Problem case dicatat sebagai riwayat tambahan, bukan menghapus transaksi sebelumnya.

4. **Tukar tambah harus memisahkan cash dan aset.**

   * Akun customer yang masuk adalah aset/stok baru.
   * Uang tambahan customer adalah cash masuk.
   * Cashback ke customer adalah cash keluar.
   * Nilai akun customer tidak boleh dicampur sebagai saldo rekening.

5. **Audit log wajib ada.**

   * Setiap view, create, edit, delete, export, dan perubahan penting harus tercatat.
   * Log minimal berisi user, waktu, aksi, data sebelum, data sesudah, dan modul yang diubah.

---

## 3. Role dan Hak Akses

Role utama:

1. **Owner / Super Admin**

   * Akses penuh ke semua fitur.
   * Bisa melihat harga modal.
   * Bisa melihat profit.
   * Bisa mengatur role dan permission custom sesuai divisi.
   * Bisa melihat seluruh audit log.

2. **Role Custom Sesuai Divisi**

   * Role dapat dibuat dan diatur oleh Owner.
   * Contoh role: Admin CS, Admin Keuangan, Viewer, Auditor, Admin Stok.
   * Permission harus fleksibel per modul dan per aksi.

Contoh permission:

* Lihat stok.
* Tambah stok.
* Edit stok.
* Hapus stok.
* Lihat harga modal.
* Lihat profit.
* Input pembayaran.
* Input refund.
* Lihat dashboard.
* Export laporan.
* Approve transaksi sensitif.
* Lihat audit log.

Catatan penting:

* Admin boleh melihat harga modal dan profit jika diberikan akses.
* Admin boleh edit data stok yang sudah terjual, tapi semua perubahan wajib masuk audit log.
* Setiap aktivitas view dan edit harus tercatat agar mudah diaudit.

---

## 4. Modul Utama Website

### A. Modul User, Role, dan Permission

Fitur:

1. Login user.
2. Manajemen user.
3. Manajemen role.
4. Custom permission per role.
5. Aktivasi/nonaktif user.
6. Audit login dan aktivitas user.

---

### B. Modul Manajemen Stok

Fungsi:

1. Input stok akun baru.
2. Edit data stok.
3. Lihat detail stok.
4. Filter stok berdasarkan status, kategori game, harga, tanggal, admin, dan kondisi.
5. Melihat history stok.
6. Melihat hubungan stok dengan transaksi/deal.
7. Melihat case bermasalah jika ada.

Status stok utama:

1. Tersedia.
2. Booking.
3. Akses Terbatas.
4. Terjual.
5. On Hold.
6. Bermasalah - Ditindaklanjuti.
7. Bermasalah - Permanen.
8. Cancel / Dibatalkan jika diperlukan.

Data stok minimal:

1. ID stok.
2. Kategori game.
3. Nama / kode stok.
4. Detail akun.
5. Login akun.
6. Email / username.
7. Password.
8. Kode cadangan jika ada.
9. Harga modal.
10. Harga post.
11. Harga promo jika ada.
12. Harga sekarang.
13. Status stok.
14. Tanggal pembelian.
15. Tanggal posting.
16. Tanggal booking.
17. Tanggal penjualan.
18. Info penjual.
19. Info pembeli.
20. Catatan internal.
21. Pengelola/admin.
22. Relasi ke transaksi/deal.
23. Relasi ke problem case jika ada.

---

### C. Modul Pembelian Stok

Flow pembelian stok:

1. Admin/owner input stok baru.
2. Isi detail akun dan harga modal.
3. Harga modal cukup satu angka total.
4. Pilih metode pembayaran/rekening yang digunakan.
5. Jika pembayaran ke penjual langsung lunas, sistem membuat catatan uang keluar di ledger keuangan.
6. Jika pembayaran ke penjual delay sesuai kesepakatan, sistem mencatat status pembayaran pembelian sebagai belum selesai / pending.
7. Jika akun bermasalah sebelum dijual, status stok diubah menjadi Bermasalah.
8. Jika akun tidak bisa diperbaiki, bisa masuk status Bermasalah Permanen.

Catatan:

* Pembelian stok tidak perlu masuk sebagai deal penjualan.
* Pembelian stok tetap wajib masuk keuangan jika ada uang keluar.
* Jika pembayaran pembelian belum dilakukan, sistem harus bisa mencatat kewajiban/pending payment.

---

### D. Modul Deal / Transaksi Penjualan

Deal adalah transaksi utama antara Feryshop dan customer.

Jenis deal:

1. Penjualan lunas.
2. Booking / DP.
3. Cicilan.
4. Pelunasan.
5. Tukar tambah.
6. Cancel.
7. Refund.
8. Case bermasalah terkait transaksi.

Data deal minimal:

1. Nomor deal.
2. Customer.
3. Stok yang dijual.
4. Harga deal.
5. Total dibayar.
6. Sisa pembayaran.
7. Persentase pembayaran.
8. Status deal.
9. Status akses akun.
10. Tanggal deal.
11. Tanggal jatuh tempo.
12. Admin/pengelola.
13. Catatan transaksi.
14. Invoice/nota.
15. Relasi ke payment records.
16. Relasi ke ledger keuangan.
17. Relasi ke problem case jika ada.

Status deal:

1. Draft.
2. Booking.
3. Akses Terbatas.
4. Lunas.
5. Cancel oleh Pembeli.
6. Cancel oleh Feryshop.
7. Refund Sebagian.
8. Refund Penuh.
9. Bermasalah.
10. Selesai.

---

### E. Modul Payment / Pembayaran

Satu deal bisa memiliki banyak pembayaran.

Contoh:

* DP 200K.
* Cicilan 300K.
* Pelunasan 500K.

Fitur payment:

1. Input pembayaran.
2. Split payment.
3. Pilih rekening/metode pembayaran.
4. Upload bukti pembayaran jika diperlukan.
5. Catatan pembayaran.
6. Status pembayaran.
7. Otomatis update total dibayar pada deal.
8. Otomatis update saldo rekening.
9. Otomatis membuat ledger keuangan.

Split payment wajib didukung.

Contoh:

* Harga deal: 1.000.000.
* Customer bayar:

  * 300.000 ke QRIS Feryshop.
  * 200.000 ke Dana.
  * 500.000 ke Seabank.

Sistem harus mencatat 3 payment record, tapi tetap dalam 1 deal.

---

## 5. Flow Transaksi Utama

### Flow 1 — Penjualan Lunas

1. Admin pilih stok dengan status Tersedia.
2. Admin buat deal penjualan.
3. Isi harga deal.
4. Input pembayaran customer.
5. Jika customer membayar penuh:

   * Deal menjadi Lunas.
   * Stok menjadi Terjual.
   * Tanggal penjualan tercatat.
   * Uang masuk tercatat di ledger.
   * Saldo rekening bertambah.
   * Nota/invoice dapat dibuat.
6. Sistem menghitung profit per stok.

Rumus profit per stok:

Profit = Harga Jual - Harga Modal - Biaya Tambahan - Refund - Cashback

Untuk transaksi normal tanpa refund/cashback:

Profit = Harga Jual - Harga Modal

---

### Flow 2 — Booking / DP

Aturan:

1. DP minimal 20% dari harga deal.
2. Jika customer DP, deal dibuat satu kali.
3. Semua pembayaran berikutnya masuk ke deal yang sama.
4. Status stok menjadi Booking.
5. Jatuh tempo pelunasan default 7 hari, tetapi keputusan final tetap manual sesuai kesepakatan dengan customer.

Flow:

1. Admin pilih stok Tersedia.
2. Admin buat deal Booking.
3. Input harga deal.
4. Input pembayaran DP.
5. Sistem menghitung:

   * Total dibayar.
   * Sisa pembayaran.
   * Persentase pembayaran.
   * Jatuh tempo.
6. Stok berubah menjadi Booking.
7. Jika customer membayar lagi, admin menambah payment baru di deal yang sama.
8. Jika total pembayaran mencapai 70% atau lebih:

   * Status stok menjadi Akses Terbatas.
   * Customer bisa diberi akses terbatas sesuai SOP.
9. Jika pembayaran lunas:

   * Deal menjadi Lunas.
   * Stok menjadi Terjual.

---

### Flow 3 — Cicilan dan Pelunasan

1. Customer yang sudah booking bisa membayar berkali-kali.
2. Setiap pembayaran dicatat sebagai payment baru.
3. Total dibayar otomatis bertambah.
4. Sisa pembayaran otomatis berkurang.
5. Jika total pembayaran mencapai 70%, status menjadi Akses Terbatas.
6. Jika total pembayaran mencapai 100%, status menjadi Lunas dan stok menjadi Terjual.

Catatan:

* Jangan membuat deal baru untuk setiap cicilan.
* Deal tetap satu.
* Payment boleh banyak.

---

### Flow 4 — Akun Ditahan Karena Lewat Tempo

Jika customer belum lunas melewati tempo:

1. Sistem menampilkan indikator jatuh tempo.
2. Admin/owner bisa memberi status/keterangan “Akun Ditahan”.
3. Proses ini manual tergantung kesepakatan dengan customer.
4. Sistem tidak perlu otomatis cancel.
5. Sistem wajib menyimpan catatan dan history keputusan.

Rekomendasi teknis:

* “Akun Ditahan” lebih baik dibuat sebagai flag/keterangan tambahan, bukan status utama.
* Status utama tetap Booking atau Akses Terbatas.
* Ini agar laporan status stok tidak berantakan.

---

### Flow 5 — Cancel oleh Pembeli

Aturan:

1. Jika pembeli cancel, DP 20% dari harga deal hangus.
2. Jika pembeli sudah membayar lebih dari 20%, maka yang hangus hanya 20%.
3. Sisanya direfund ke customer.
4. Jika pembeli baru membayar tepat 20%, maka semua pembayaran hangus.
5. Status stok setelah cancel ditentukan manual tergantung kondisi akun.

Contoh:

Harga deal: 1.000.000
Customer sudah bayar: 500.000
DP hangus: 200.000
Refund ke customer: 300.000

Sistem harus otomatis menghitung:

* Nominal hangus.
* Nominal refund.
* Sisa yang perlu dikembalikan.

Flow:

1. Admin buka deal.
2. Pilih cancel oleh pembeli.
3. Sistem hitung nominal hangus dan refund.
4. Owner/admin konfirmasi.
5. Jika ada refund:

   * Sistem membuat ledger uang keluar.
   * Saldo rekening berkurang.
6. Deal berubah menjadi Cancel oleh Pembeli.
7. Stok diubah manual sesuai case:

   * Tersedia.
   * On Hold.
   * Bermasalah.
   * Cancel.

---

### Flow 6 — Cancel oleh Feryshop / Penjual

Aturan:

1. Jika cancel karena kesalahan/kendala dari Feryshop, uang customer tidak hangus.
2. Refund penuh sesuai total yang sudah dibayar customer.
3. Sistem mencatat alasan cancel.
4. Status stok ditentukan manual tergantung kondisi akun.

Flow:

1. Admin/owner pilih deal.
2. Pilih Cancel oleh Feryshop.
3. Sistem menghitung refund penuh.
4. Refund dicatat sebagai uang keluar.
5. Deal berubah menjadi Cancel oleh Feryshop.
6. Stok diberi status sesuai kondisi aktual.

---

## 6. Flow Tukar Tambah

Tukar tambah adalah transaksi di mana customer menukar akun miliknya untuk mengambil stok Feryshop.

Flow dasar:

1. Customer memilih akun/stok Feryshop.
2. Feryshop menilai akun customer.
3. Akun customer masuk sebagai aset/stok baru.
4. Customer bisa:

   * menambah uang,
   * menerima cashback,
   * atau tidak ada uang tambahan/cashback.
5. Stok Feryshop keluar/terjual ke customer.
6. Akun customer masuk ke stok Feryshop sebagai stok baru.

Sistem harus fleksibel untuk beberapa akun customer dalam satu transaksi tukar tambah.

Contoh:

* Customer mengambil akun Feryshop A.
* Customer memberikan 2 akun sebagai tukar tambah.
* Customer menambah uang 300K.
* Maka sistem harus mencatat:

  * 1 stok keluar.
  * 2 stok masuk baru.
  * 1 cash masuk 300K.
  * 1 deal tukar tambah.

Data tukar tambah minimal:

1. Deal tukar tambah.
2. Stok Feryshop yang keluar.
3. Satu atau lebih akun customer yang masuk.
4. Nilai taksiran masing-masing akun customer.
5. Total nilai aset masuk.
6. Uang tambahan dari customer jika ada.
7. Cashback ke customer jika ada.
8. Catatan kesepakatan.
9. Status transaksi.
10. History jika akun TT bermasalah.

Prinsip audit tukar tambah:

* Nilai akun customer dicatat sebagai aset masuk.
* Jika akun customer masuk menjadi stok baru, nilai taksirannya menjadi modal stok baru.
* Uang tambahan customer masuk ke ledger sebagai pemasukan.
* Cashback ke customer masuk ke ledger sebagai pengeluaran.
* Jangan mencampur nilai akun customer dengan saldo rekening.

Rumus nilai deal tukar tambah:

Nilai Deal = Total Nilai Aset Masuk + Uang Tambahan Customer - Cashback

Profit stok keluar:

Profit = Nilai Deal - Harga Modal Stok Keluar

---

## 7. Jika Akun Tukar Tambah Bermasalah

Jika akun customer yang masuk dari tukar tambah bermasalah:

1. Sistem membuat problem case.
2. Case dikaitkan dengan:

   * deal tukar tambah,
   * stok keluar,
   * stok masuk dari customer,
   * customer terkait.
3. Penyelesaian tergantung kesepakatan.

Opsi penyelesaian:

1. Masalah bisa diatasi:

   * Deal tetap lanjut.
   * Stok masuk tetap diproses.

2. Masalah tidak bisa diatasi dan customer cancel:

   * Deal bisa dibatalkan.
   * DP atau nominal tertentu bisa hangus sesuai kesepakatan.
   * Refund/cashback dicatat jika ada.

3. Customer memilih melunasi penuh dan skema tukar tambah batal:

   * Akun customer tidak dihitung sebagai aset.
   * Customer membayar penuh dengan uang.
   * Sistem harus mencatat perubahan skema transaksi.

Catatan:

* Karena case TT bisa rumit, sistem harus punya catatan manual dan approval owner.
* Jangan semua dibuat otomatis penuh, karena keputusan sering tergantung negosiasi.

---

## 8. Modul Akun Bermasalah

Akun bermasalah harus punya modul/case sendiri, bukan hanya status stok.

Data problem case minimal:

1. Nomor case.
2. Tanggal laporan.
3. Tipe masalah.
4. Stok terkait.
5. Deal terkait jika ada.
6. Customer terkait jika ada.
7. Admin/PIC.
8. Status case.
9. Catatan kronologi.
10. Tindakan yang dilakukan.
11. Biaya tambahan jika ada.
12. Refund jika ada.
13. Status akhir.
14. Bukti/attachment jika diperlukan.

Status case:

1. Open.
2. Ditindaklanjuti.
3. Menunggu customer.
4. Menunggu pihak ketiga.
5. Selesai.
6. Tidak bisa diselesaikan.
7. Permanen.
8. Refund.
9. Cancel.

Aturan penting:

* Jika akun yang sudah terjual bermasalah, history terjual tetap ada.
* Sistem hanya menambahkan problem case di atas history tersebut.
* Status stok bisa diberi tanda bermasalah, tetapi riwayat penjualan tidak boleh hilang.

---

## 9. Modul Keuangan dan Rekening

Website harus memiliki sistem rekening/metode pembayaran yang bisa dibuat custom oleh Owner.

Tidak perlu menyediakan Cash sebagai default jika tidak digunakan.

Contoh rekening/metode yang mungkin dipakai:

1. QRIS Feryshop.
2. Seabank.
3. Bank Jago.
4. Bank Mandiri.
5. Dana.
6. Ovo.
7. Gopay.
8. Order Kuota.
9. Digiflazz.
10. Rekening/metode custom lainnya.

Fitur rekening:

1. Tambah rekening/metode pembayaran.
2. Edit rekening.
3. Nonaktifkan rekening.
4. Lihat saldo per rekening.
5. Lihat mutasi rekening.
6. Rekap pemasukan per rekening.
7. Rekap pengeluaran per rekening.
8. Transfer antar rekening.
9. Penyesuaian saldo dengan approval owner.

Saldo rekening harus otomatis berubah dari:

* Payment masuk.
* Refund keluar.
* Pembelian stok.
* Cashback tukar tambah.
* Mutasi antar rekening.
* Pengeluaran operasional.
* Penyesuaian manual.

---

## 10. Mutasi Antar Rekening

Transfer antar rekening/dompet wajib dicatat.

Contoh:

* Dari Seabank ke QRIS.
* Dari Dana ke Bank Jago.
* Dari Order Kuota ke rekening lain.

Flow:

1. Pilih rekening asal.
2. Pilih rekening tujuan.
3. Isi nominal.
4. Isi biaya admin jika ada.
5. Sistem mengurangi saldo rekening asal.
6. Sistem menambah saldo rekening tujuan.
7. Jika ada biaya admin, sistem mencatat pengeluaran biaya admin.
8. Semua masuk history keuangan.

Mutasi internal tidak boleh dihitung sebagai omzet atau profit.

---

## 11. Pembayaran ke Rekening Pribadi Admin

Secara SOP, pembayaran customer seharusnya masuk ke rekening resmi Feryshop.

Jika terjadi pembayaran ke rekening pribadi admin:

1. Admin wajib melapor ke owner.
2. Sistem harus menyediakan opsi catatan khusus.
3. Transaksi harus masuk history.
4. Owner harus bisa approve/validasi.
5. Saldo rekening bisnis tidak otomatis bertambah sebelum dana benar-benar disetor ke rekening bisnis.
6. Sistem harus mencatat:

   * admin penerima,
   * nominal,
   * customer,
   * deal terkait,
   * status setoran ke Feryshop,
   * waktu laporan,
   * waktu disetor,
   * bukti transfer.

Status yang disarankan:

1. Dilaporkan.
2. Menunggu setor.
3. Sudah disetor.
4. Bermasalah.
5. Selesai.

Catatan:

* Ini titik risiko tinggi.
* Wajib masuk audit log.
* Jangan disamakan dengan payment normal.

---

## 12. Nota / Invoice

Website sebaiknya memiliki fitur nota agar memudahkan audit dan rekap.

Fitur nota:

1. Generate nota dari deal.
2. Nomor nota otomatis.
3. Menampilkan:

   * nama customer,
   * kode stok,
   * harga deal,
   * total dibayar,
   * sisa pembayaran,
   * status pembayaran,
   * daftar payment,
   * tanggal transaksi,
   * admin/pengelola.
4. Bisa diunduh PDF.
5. Bisa dicetak.
6. Bisa dikirim ke customer jika dibutuhkan.

Nota bukan pengganti ledger keuangan. Nota hanya bukti transaksi.

---

## 13. Dashboard

Dashboard utama untuk Owner harus menampilkan:

1. Total penjualan.
2. Total omzet.
3. Total profit.
4. Profit per stok.
5. Total stok tersedia.
6. Total stok booking.
7. Total stok akses terbatas.
8. Total stok terjual.
9. Total stok bermasalah.
10. Stok mati / stok lama.
11. Piutang dari booking/cicilan.
12. Total refund.
13. Total cashback tukar tambah.
14. Saldo semua rekening.
15. Performa per admin.
16. Performa per kategori game.
17. Rekap harian, mingguan, bulanan.
18. Filter tanggal.
19. Filter kategori game.
20. Filter admin.
21. Filter rekening/metode pembayaran.

Dashboard kategori game:

* FF.
* ML.
* Roblox.
* TikTok.
* Kategori custom lainnya.

---

## 14. Laporan dan Export

Fitur laporan:

1. Laporan penjualan.
2. Laporan profit.
3. Laporan stok.
4. Laporan stok mati.
5. Laporan booking/cicilan.
6. Laporan refund.
7. Laporan tukar tambah.
8. Laporan rekening.
9. Laporan mutasi rekening.
10. Laporan performa admin.
11. Laporan akun bermasalah.
12. Laporan per kategori game.

Export:

1. Excel.
2. PDF.
3. CSV jika diperlukan.

Import data:

* Developer boleh menambahkan fitur import dari Notion/Excel jika memungkinkan.
* Import harus punya validasi agar data lama tidak merusak saldo dan laporan.

---

## 15. Audit Log

Audit log wajib ada dari awal.

Aktivitas yang harus dicatat:

1. Login.
2. Logout.
3. Melihat data sensitif.
4. Membuat stok.
5. Mengedit stok.
6. Menghapus stok.
7. Membuat deal.
8. Mengedit deal.
9. Membatalkan deal.
10. Input pembayaran.
11. Input refund.
12. Input mutasi rekening.
13. Edit saldo.
14. Export laporan.
15. Melihat harga modal.
16. Melihat profit.
17. Mengubah role/permission.

Isi audit log minimal:

1. User.
2. Role.
3. Waktu.
4. IP/device jika memungkinkan.
5. Modul.
6. Aksi.
7. Data sebelum.
8. Data sesudah.
9. Keterangan.
10. ID data terkait.

---

## 16. Struktur Data yang Disarankan

Minimal tabel/modul utama:

1. Users
2. Roles
3. Permissions
4. Audit Logs
5. Customers
6. Stocks
7. Stock Histories
8. Deals
9. Deal Items
10. Payments
11. Finance Ledger
12. Accounts / Rekening
13. Account Transfers
14. Trade-In Deals
15. Trade-In Items
16. Problem Cases
17. Invoices
18. Attachments / Proofs

Relasi penting:

* 1 stock bisa punya banyak history.
* 1 deal bisa punya banyak payment.
* 1 payment masuk ke 1 rekening.
* 1 deal bisa punya 1 invoice.
* 1 deal bisa punya problem case.
* 1 trade-in deal bisa punya banyak stock masuk.
* 1 rekening punya banyak ledger.
* 1 user punya banyak audit log.

---

## 17. Prioritas MVP

Agar website cepat jalan, fitur harus dibuat bertahap.

### MVP Wajib

1. Login user.
2. Role dan permission dasar.
3. Audit log dasar.
4. Manajemen stok.
5. Pembelian stok.
6. Penjualan lunas.
7. Booking / DP / cicilan / pelunasan.
8. Payment split.
9. Ledger keuangan.
10. Saldo rekening otomatis.
11. Dashboard dasar.
12. Export laporan dasar.

### Tahap Berikutnya

1. Cancel dan refund otomatis.
2. Modul akun bermasalah.
3. Tukar tambah fleksibel banyak akun.
4. Nota/invoice PDF.
5. Import dari Notion/Excel.
6. Dashboard lanjutan.
7. Performa admin.
8. Integrasi n8n/Telegram.
9. Approval f

pahami alur percakapan dan apa yang dia minta, jangab eksekusi apapun