import React, { useContext, useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { obatSchemas, resepSchemas } from "../utils/schemas";
import ErrorText from "../components/ErrorText";
import { addItem, addLog, deleteItem, getItem, updateItem } from "../utils/db";
import { show } from "../utils/toast";
import { FaNotesMedical, FaSearch } from "react-icons/fa";
import Format from "date-fns/format";
import { Context } from "../components/Context";

const resep = () => {
  const [item, setItem] = useState([]);
  const [filteredItem, setFilteredItem] = useState([]);
  const [selected, setSelected] = useState(null);
  const { user, setUser } = useContext(Context);
  const [form, setForm] = useState({
    no_resep: "",
    tgl_resep: "",
    nama_dokter: "",
    nama_pasien: "",
    nama_obadibeli: "",
    jumlah_obatdibeli: "",
    id_pasien: "",
  });
  var submit_type;

  async function getResep() {
    const result = await getItem("resep");
    if (result.status === 200) {
      console.log(result.response);
      setItem(result.response);
      setFilteredItem(result.response);
    } else {
      show("Gagal mendapatkan obat", true);
    }
  }

  async function addResep(values) {
    console.log(values);
    const result = await addItem("resep", values);
    if (result.status === 200) {
      getResep();
      show("Berhasil menambah.");
    } else {
      show(result.response, true);
    }
  }

  async function updateResep(values) {
    const result = await updateItem("resep", selected.id_resep, values);
    if (result.status === 200) {
      getResep();
      show("Berhasil memperbarui.");
    } else {
      show("Gagal memperbarui.", true);
    }
  }

  async function deleteResep() {
    const result = await deleteItem("resep", selected.id_resep);
    if (result.status === 200) {
      getResep();
      show("Berhasil menghapus.");
    } else {
      show("Gagal menghapus.", true);
    }
  }

  function filter(value) {
    console.log(value);
    setFilteredItem((_) => {
      return item.filter((i) => {
        return (
          i.no_resep.toLowerCase().includes(value.toLowerCase()) ||
          i.nama_pasien.toLowerCase().includes(value.toLowerCase()) ||
          i.nama_dokter.toLowerCase().includes(value.toLowerCase())
        );
      });
    });
  }

  useEffect(() => {
    getResep();
  }, []);

  useEffect(() => {
    if (selected) {
      setForm({
        no_resep: selected.no_resep,
        tgl_resep: Format(new Date(selected.tgl_resep), "yyyy-MM-dd"),
        nama_dokter: selected.nama_dokter,
        nama_pasien: selected.nama_pasien,
        nama_obatdibeli: selected.nama_obatdibeli,
        jumlah_obatdibeli: selected.jumlah_obatdibeli,
        id_pasien: selected.id_pasien,
      });
    }
  }, [selected]);

  return (
    <div className="flex justify-evenly items-center w-screen">
      <div>
        <p className="text-3xl mb-5">Manage resep</p>
        <div
          className="search border flex items-center gap-5 mb-5"
          onChange={(e) => filter(e.target.value)}
        >
          <FaSearch className="text-2xl ml-2" />
          <input type="text" className="w-full py-1 px-2" />
        </div>
        <div className="grid grid-cols-2 max-h-96 overflow-y-auto w-full gap-2">
          {filteredItem.map((resep) => {
            return (
              <div
                onClick={() => setSelected(resep)}
                className={`flex flex-col item border-2 p-2 gap-3   hover:bg-green-50 cursor-pointer ${
                  selected &&
                  selected.id_resep === resep.id_resep &&
                  "bg-green-200"
                }`}
              >
                <p>No Resep: {resep.no_resep}</p>
                <p>
                  Tgl Resep: {Format(new Date(resep.tgl_resep), "yyyy-MM-dd")}
                </p>
                <p>Dokter: {resep.nama_dokter}</p>
                <p>Pasien: {resep.nama_pasien}</p>
                <p>Obat: {resep.nama_obatdibeli}</p>
                <p>Jumlah: {resep.jumlah_obatdibeli}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Formik
        initialValues={form}
        enableReinitialize={true}
        validationSchema={resepSchemas}
        onSubmit={async (values) => {
          if (
            (submit_type === "put" || submit_type === "delete") &&
            !selected
          ) {
            show("Harus memilih resep", { error: true });
          } else {
            switch (submit_type) {
              case "post":
                addResep(values);
                addLog({
                  aktifitas: "Menambah resep",
                  id_user: user && user.id_user,
                });
                break;
              case "put":
                updateResep(values);
                addLog({
                  aktifitas: "Mengubah resep",
                  id_user: user && user.id_user,
                });
                break;
              case "delete":
                deleteResep();
                addLog({
                  aktifitas: "Menghapus resep",
                  id_user: user && user.id_user,
                });
                break;
            }
          }
        }}
      >
        {(props) => {
          return (
            <Form className="form flex flex-col">
              <div className="row">
                <p className="input-text">Nomor Resep</p>
                <Field
                  name="no_resep"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.no_resep && props.errors.no_resep}
                />
              </div>
              <div className="row">
                <p className="input-text">Tanggal Resep</p>
                <Field
                  name="tgl_resep"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.tgl_resep && props.errors.tgl_resep}
                />
              </div>
              <div className="row">
                <p className="input-text">Dokter</p>
                <Field
                  name="nama_dokter"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.nama_dokter && props.errors.nama_dokter}
                />
              </div>
              <div className="row">
                <p className="input-text">Nama Obat</p>
                <Field
                  name="nama_obatdibeli"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={
                    props.touched.nama_obadibeli && props.errors.nama_obadibeli
                  }
                />
              </div>
              <div className="row">
                <p className="input-text">Jumlah Obat</p>
                <Field
                  name="jumlah_obatdibeli"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={
                    props.touched.jumlah_obatdibeli &&
                    props.errors.jumlah_obatdibeli
                  }
                />
              </div>
              <div className="row">
                <p className="input-text">Nama Pasien</p>
                <Field
                  name="nama_pasien"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.nama_pasien && props.errors.nama_pasien}
                />
              </div>
              <div className="row">
                <p className="input-text">ID Pasien</p>
                <Field
                  name="id_pasien"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.id_pasien && props.errors.id_pasien}
                />
              </div>

              <div className="buttons flex gap-1">
                <a
                  className="btn text-center rounded-md mt-8 w-24"
                  onClick={() => {
                    submit_type = "post";
                    props.handleSubmit();
                  }}
                >
                  Tambah
                </a>
                <a
                  className="btn text-center rounded-md mt-8  w-24"
                  onClick={() => {
                    submit_type = "put";
                    props.handleSubmit();
                  }}
                >
                  Perbarui
                </a>
                <a
                  className="btn text-center rounded-md mt-8  w-24"
                  onClick={() => {
                    submit_type = "delete";
                    props.handleSubmit();
                  }}
                >
                  Delete
                </a>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default resep;
