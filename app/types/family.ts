export type Family = {
  id: number;
  nama_kepala_keluarga: string;
  nik: string;
  statusEkonomi: string;
  alamat: string;
  lat: number;
  lng: number;
};

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  relation: 'ayah' | 'ibu' | 'anak' | 'lainnya';
  age: number;
}
