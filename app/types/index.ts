export interface Customer {
  id: string; // Asumsi ID customer adalah string (UUID/ObjectID)
  nama: string;
  cabang: string;
  periode: string;
  namaNasabah: string;
  status: string;
  tanggalDibuat: string; // Tanggal dibuat (sebagai string ISO)
}