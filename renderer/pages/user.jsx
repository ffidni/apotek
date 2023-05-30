import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { userSchemas } from "../utils/schemas";
import ErrorText from "../components/ErrorText";
import { addItem, addLog, deleteItem, getItem, updateItem } from "../utils/db";
import { show } from "../utils/toast";
import {
  FaUser,
  FaUserNurse,
  FaUserTie,
  FaUserEdit,
  FaSearch,
} from "react-icons/fa";

const user = () => {
  const [item, setItem] = useState([]);
  const [filteredItem, setFilteredItem] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    username: "",
    nama: "",
    telepon: "",
    alamat: "",
    type_user: "admin",
    password: "",
  });
  var submit_type;

  async function getUser() {
    const result = await getItem("user");
    if (result.status === 200) {
      setItem(result.response);
      setFilteredItem(result.response);
    } else {
      show("Gagal mendapatkan user", true);
    }
  }

  async function addUser(values) {
    console.log(values);
    const result = await addItem("register", values);
    if (result.status === 200) {
      getUser();
      show("Berhasil menambah.");
    } else {
      show(result.response, true);
    }
  }

  async function updateUser(values) {
    const result = await updateItem("user", selected.id_user, values);
    if (result.status === 200) {
      getUser();
      show("Berhasil memperbarui.");
    } else {
      show("Gagal memperbarui.", true);
    }
  }

  async function deleteUser() {
    const result = await deleteItem("user", selected.id_user);
    if (result.status === 200) {
      getUser();
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
          i.nama.toLowerCase().includes(value.toLowerCase()) ||
          i.username.toLowerCase().includes(value.toLowerCase()) ||
          i.telepon.toLowerCase().includes(value.toLowerCase()) ||
          i.type_user.toLowerCase().includes(value.toLowerCase())
        );
      });
    });
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (selected) {
      setForm({
        username: selected.username,
        nama: selected.nama,
        telepon: selected.telepon,
        alamat: selected.alamat,
        type_user: selected.type_user,
      });
    }
  }, [selected]);

  return (
    <div className="flex justify-evenly items-center w-screen">
      <div>
        <p className="text-3xl mb-5">Manage User</p>
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
                selected && selected.id_user === user.id_user && "bg-green-200"
              }`}
            >
              {user.type_user === "admin" ? (
                <FaUserTie />
              ) : user.type_user === "kasir" ? (
                <FaUserEdit />
              ) : user.type_user === "apoteker" ? (
                <FaUserNurse />
              ) : (
                <FaUser />
              )}
              <p>{user.nama}</p>
            </div>
          );
        })}
      </div>
      <Formik
        initialValues={form}
        enableReinitialize={true}
        validationSchema={userSchemas}
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
                  aktifitas: "Menambah akun",
                  id_user: user && user.id_user,
                });
                break;
              case "Memperbarui akun":
                updateUser(values);
                break;
              case "Menghapus akun":
                deleteUser();
                break;
            }
          }
        }}
      >
        {(props) => {
          return (
            <Form className="form flex flex-col">
              <div className="row">
                <p className="input-text">Username</p>
                <Field
                  name="username"
                  type="input"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.username && props.errors.username}
                />
              </div>
              <div className="row">
                <p className="input-text">Nama</p>
                <Field name="nama" type="input" className="input border-2" />
                <ErrorText error={props.touched.nama && props.errors.nama} />
              </div>
              <div className="row">
                <p className="input-text">Nomor HP</p>
                <Field name="telepon" type="input" className="input border-2" />
                <ErrorText
                  error={props.touched.telepon && props.errors.telepon}
                />
              </div>
              <div className="row">
                <p className="input-text">Alamat</p>
                <Field name="alamat" type="input" className="input border-2" />
                <ErrorText
                  error={props.touched.alamat && props.errors.alamat}
                />
              </div>
              <div className="row">
                <p className="input-text">Jenis Akun</p>
                <Field name="type_user" as="select" className="input border-2">
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                  <option value="apoteker">Apoteker</option>
                  <option value="pasien">Pasien</option>
                </Field>
                <ErrorText
                  error={props.touched.type_user && props.errors.type_user}
                />
              </div>
              <div className="row">
                <p className="input-text">Reset Password</p>
                <Field
                  name="password"
                  type="password"
                  className="input border-2"
                />
                <ErrorText
                  error={props.touched.password && props.errors.password}
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

export default user;
