import React, { useContext, useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import { obatSchemas, userSchemas } from "../utils/schemas";
import ErrorText from "../components/ErrorText";
import { addItem, addLog, deleteItem, getItem, updateItem } from "../utils/db";
import { show } from "../utils/toast";
import {
  FaPlusCircle,
  FaTrash,
  FaCartPlus,
  FaSearch,
  FaMinusCircle,
} from "react-icons/fa";
import Format from "date-fns/format";
import { Context } from "../components/Context";

const CartItem = ({
  obat,
  total,
  setKembalian,
  setTotal,
  bayarRef,
  setSelected,
}) => {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setTotal((total += obat.harga));
  }, []);

  return (
    <div className="item border-2 p-2 w-1/2 gap-2 flex justify-between items-center hover:bg-green-50 cursor-pointer">
      <div className="">
        <p>{obat.nama_obat}</p>
        <p>
          {qty} x {obat.harga}
        </p>
      </div>
      <div className="buttons flex gap-2">
        <FaPlusCircle
          className="text-green-600 text-xl"
          onClick={() => {
            let up = qty + 1;
            setQty(up);
            setTotal((old) => old - obat.harga * qty + obat.harga * up);
            setKembalian(0);
            bayarRef.current.value = "";
          }}
        />
        <FaMinusCircle
          className="text-green-600 text-xl"
          onClick={() => {
            let down = qty - 1;
            if (down >= 1) {
              setQty(down);
              setTotal((old) => old - obat.harga);
              setKembalian(0);
              bayarRef.current.value = "";
            }
          }}
        />
        <FaTrash
          className="text-red-600 text-xl"
          onClick={() => {
            setTotal((total -= obat.harga * qty));
            setKembalian((kembalian) => kembalian - obat.harga * qty);
            setSelected((old) =>
              old.filter((item) => item.id_obat !== obat.id_obat)
            );
            setKembalian(0);
            bayarRef.current.value = "";
          }}
        />
      </div>
    </div>
  );
};

const transaksi = () => {
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState([]);
  const [filteredItem, setFilteredItem] = useState([]);
  const [selected, setSelected] = useState([]);
  const [kembalian, setKembalian] = useState(0);
  const [id, setId] = useState(null);
  const { user, setUser } = useContext(Context);

  const bayarRef = useRef();

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

  async function getObat() {
    const result = await getItem("obat");
    if (result.status === 200) {
      setItem(result.response);
      setFilteredItem(result.response);
    } else {
      show("Gagal mendapatkan obat", true);
    }
  }

  async function getId() {
    const result = await getItem("count", "transaksi");
    if (result.status === 200) {
      setId(result.response + 1);
    } else {
      show("Gagal mendapatkan transaksi ID", true);
    }
  }

  useEffect(() => {
    const session = window.sessionStorage.getItem("user");
    if (session) {
      setUser(JSON.parse(session));
    }
    getObat();
    getId();
  }, []);

  async function simpan() {
    if (bayarRef.current.value === "") {
      show("Harus dibayar dulu!", true);
    } else {
      const result = await addItem("transaksi", {
        no_transaksi: `transaksi-${id}`,
        total_bayar: total,
        id_user: user.id_user,
      });
      if (result.status == 200) {
        show(`Berhasil melakukan transaksi dengan transaksi-${id}`);
        getId();
        setTotal(0);
        setKembalian(0);
        bayarRef.current.value = "";
        setSelected([]);
      } else {
        show(result.response, true);
      }
      addLog({
        aktifitas: "Melakukan transaksi",
        id_user: user && user.id_user,
      });
    }
  }

  return (
    <div className="flex justify-center gap-20 items-center w-screen">
      <div>
        <p className="text-3xl mb-5">Transaksi</p>
        <div
          className="search border flex items-center gap-5 mb-5"
          onChange={(e) => filter(e.target.value)}
        >
          <FaSearch className="text-2xl ml-2" />
          <input type="text" className="w-full py-1 px-2" />
        </div>
        {filteredItem.map((obat) => {
          return (
            <div
              onClick={() => {
                let include = selected.filter(
                  (item) => item.id_obat === obat.id_obat
                );
                if (include.length > 0) {
                  show("Obat sudah ada dikeranjang", true);
                } else {
                  setSelected((old) => [...old, obat]);
                }
              }}
              className={`item border-2 p-2 gap-2 pr-25 flex items-center hover:bg-green-50 cursor-pointer ${
                selected && selected.id_obat === obat.id_obat && "bg-green-200"
              }`}
            >
              <p>{obat.nama_obat}</p>
            </div>
          );
        })}
      </div>
      <div className="shadow-lg h-96 overflow-true p-5 cart">
        <p className="w-96 text-lg flex items-center gap-3">
          <FaCartPlus className="text-2xl text-green-800" /> Cart
        </p>
        {selected.map((item) => {
          return (
            <CartItem
              setSelected={setSelected}
              setTotal={setTotal}
              total={total}
              obat={item}
              setKembalian={setKembalian}
              bayarRef={bayarRef}
            />
          );
        })}
      </div>
      <div className="shadow-lg h-64 p-5 cart">
        <p className="w-52 text-lg">
          Total: <span className="text-xl">Rp. {total}</span>
        </p>
        <p className="w-52 text-lg mb-1">Kembalian: Rp. {kembalian}</p>
        <input
          type="text"
          className="border-2 py-2 px-1"
          placeholder="Masukan uang pembeli"
          ref={bayarRef}
        />
        <div className="buttons flex flex-col gap-2 mt-5">
          <a
            className="btn text-center mx-3 rounded-md"
            onClick={() => {
              setKembalian(() => {
                let uang = bayarRef.current.value;
                if (uang >= total) {
                  if (total > uang) return total - uang;
                  return uang - total;
                } else {
                  show("Uang tidak cukup!", { error: true });
                  return 0;
                }
              });
            }}
          >
            Bayar
          </a>
          <a
            className="btn text-center mx-3 rounded-md"
            onClick={() => simpan()}
          >
            Simpan
          </a>
        </div>
      </div>
    </div>
  );
};

export default transaksi;
