import * as yup from "yup";

export const loginSchemas = yup.object({
  username: yup.string().required("Harus diisi"),
  password: yup.string().required("Harus diisi"),
});

export const userSchemas = yup.object({
  username: yup.string().required("Harus diisi"),
  nama: yup.string().required("Harus diisi"),
  telepon: yup.string().required("Harus diisi"),
  alamat: yup.string().required("Harus diisi"),
  type_user: yup.string().required("Harus diisi"),
  password: yup.string(),
});

export const obatSchemas = yup.object({
  kode_obat: yup.string().required("Harus diisi"),
  nama_obat: yup.string().required("Harus diisi"),
  expired_date: yup.string().required("Harus diisi"),
  jumlah: yup.string().required("Harus diisi"),
  harga: yup.string().required("Harus diisi"),
});

export const resepSchemas = yup.object({
  no_resep: yup.string().required("Harus diisi"),
  tgl_resep: yup.string().required("Harus diisi"),
  nama_dokter: yup.string().required("Harus diisi"),
  nama_pasien: yup.string().required("Harus diisi"),
  nama_obatdibeli: yup.string().required("Harus diisi"),
  jumlah_obatdibeli: yup.string().required("Harus diisi"),
  id_pasien: yup.string().required("Harus diisi"),
});
