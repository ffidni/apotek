import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { obatSchemas, userSchemas } from "../utils/schemas";
import ErrorText from "../components/ErrorText";
import { addItem, addLog, deleteItem, getItem, updateItem } from "../utils/db";
import { show } from "../utils/toast";
import { FaSearch, FaPills } from "react-icons/fa";
import Format from "date-fns/format";

const obat = () => {
  const [item, setItem] = useState([]);
  const [filteredItem, setFilteredItem] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    kode_obat: "",
    nama_obat: "",
    expired_date: "",
    jumlah: "",
    harga: "",
  });
  var submit_type;

  async function getObat() {
    const result = await getItem("obat");
    if (result.status === 200) {
      setItem(result.response);
      setFilteredItem(result.response);
    } else {
      show("Gagal mendapatkan obat", true);
    }
  }

  async function addUser(values) {
    console.log(values);
    const result = await addItem("obat", values);
    if (result.status === 200) {
      getObat();
      show("Berhasil menambah.");
    } else {
      show(result.response, true);
    }
  }

  async function updateUser(values) {
    const result = await updateItem("obat", selected.id_obat, values);
    if (result.status === 200) {
      getObat();
      show("Berhasil memperbarui.");
    } else {
      show("Gagal memperbarui.", true);
    }
  }

  async function deleteUser() {
    const result = await deleteItem("obat", selected.id_obat);
    if (result.status === 200) {
      getObat();
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
          i.nama_obat.toLowerCase().includes(value.toLowerCase()) ||
          i.kode_obat.toLowerCase().includes(value.toLowerCase())
        );
      });
    });
  }

  useEffect(() => {
    getObat();
  }, []);

  useEffect(() => {
    if (selected) {
      setForm({
        kode_obat: selected.kode_obat,
        nama_obat: selected.nama_obat,
        expired_date: Format(new Date(selected.expired_date), "yyyy-MM-dd"),
        jumlah: selected.jumlah,
        harga: selected.harga,
      });
    }
  }, [selected]);

  return (
    <div className="flex justify-evenly items-center w-screen">
      <div>
        <p className="text-3xl mb-5">Manage Obat</p>
        <div
          className="search border flex items-center gap-5 mb-5"
          onChange={(e) => filter(e.target.value)}
        >
          <FaSearch className="text-2xl ml-2" />
          <input type="text" className="w-full py-1 px-2" />
        </div>
        {filteredItem.map((user) => {
          return (
            <div
              onClick={() => setSelected(user)}
              className={`item border-2 p-2 gap-2 pr-25 flex items-center hover:bg-green-50 cursor-pointer ${
                selected && selected.id_obat === user.id_obat && "bg-green-200"
              }`}
            >
              <FaPills />
              <p>{user.nama_obat}</p>
            </div>
          );
        })}
      </div>
      <Formik
        initialValues={form}
        enableReinitialize={true}
        validationSchema={obatSchemas}
        onSubmit={async (values) => {
          if (
            (submit_type === "put" || submit_type === "delete") &&
            !selected
          ) {
            show("Harus memilih user", { error: true });
          } else {
            switch (submit_type) {
              case "post":
                addUser(values);
                addLog({
                  aktifitas: "Menambah obat",
                  id_user: user && user.id_user,
                });
                break;
              case "put":
                updateUser(values);
                addLog({
                  aktifitas: "Memperbarui obat",
                  id_user: user && user.id_user,
                });
                break;
              case "delete":
                deleteUser();
                addLog({
                  aktifitas: "Menghapus obat",
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
                <p className="input-text">Kode Obat</p>
                <Field
                  name="kode_obat"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.kode_obat && props.errors.kode_obat}
                />
              </div>
              <div className="row">
                <p className="input-text">Nama Obat</p>
                <Field
                  name="nama_obat"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.nama_obat && props.errors.nama_obat}
                />
              </div>
              <div className="row">
                <p className="input-text">Expired Date</p>
                <Field
                  name="expired_date"
                  type="date"
                  className="input border-2"
                />
                <ErrorText
                  error={
                    props.touched.expired_date && props.errors.expired_date
                  }
                />
              </div>
              <div className="row">
                <p className="input-text">Stok</p>
                <Field name="jumlah" type="input" className="input border-2" />
                <ErrorText
                  error={props.touched.jumlah && props.errors.jumlah}
                />
              </div>
              <div className="row">
                <p className="input-text">Harga</p>
                <Field name="harga" type="input" className="input border-2" />
                <ErrorText error={props.touched.harga && props.errors.harga} />
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

export default obat;
