export interface Negara {
  id_negara: number;
  nama_negara: string;
  kode_negara?: string;
}

export interface Pelabuhan {
  id_pelabuhan: number;
  nama_pelabuhan: string;
  id_negara: number;
  kode_pelabuhan?: string;
}

export interface Barang {
  id: number;
  id_barang: string;
  nama_barang: string;
  description: string;
  harga: number;
  diskon: number;
  id_pelabuhan: number;
}

export interface FormData {
  negara: Negara | null;
  pelabuhan: Pelabuhan | null;
  barang: Barang | null;
  discount: number;
  harga: number;
  total: number;
}
