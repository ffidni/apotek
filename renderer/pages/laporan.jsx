import React, { useEffect, useState } from "react";
import {
  LinearScale,
  CategoryScale,
  BarElement,
  Legend,
  Chart,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getItem } from "../utils/db";
import { show } from "../utils/toast";
import Format from "date-fns/format";

Chart.register(CategoryScale, LinearScale, BarElement, Legend);

const laporan = () => {
  const [data, setData] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  async function getData(date = false) {
    let result;
    console.log(from, to);
    if (!date) {
      result = await getItem("transaksi");
    } else {
      result = await getItem("laporan", false, `from=${from}&to=${to}`);
    }
    if (result.status === 200) {
      setData(result.response);
      show("Berhasil mendapatkan laporan");
    } else {
      show("Gagal mendapatkan data", true);
    }
  }

  function generate() {
    if (!from || !to) {
      show("Harus mengisi tanggal terlebih dahulu", true);
    } else {
      getData(true);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const labels = data.map((item) => item.tgl_transaksi);
  const incomes = data.map((item) => item.income);

  console.log(labels, incomes);

  return (
    <div className="flex flex-col w-screen p-20">
      <div className="flex flex-col gap-5">
        <p className="text-3xl">Laporan Keuangan</p>
        <div className="form flex items-center gap-5">
          <div className="flex items-center gap-2 from">
            <p>From</p>
            <input
              type="date"
              className="border"
              onChange={(e) => {
                setFrom(Format(new Date(e.target.value), "yyyy-MM-dd"));
              }}
            />
          </div>
          <div className="flex items-center gap-2 from">
            <p>To</p>
            <input
              type="date"
              className="border"
              onChange={(e) => {
                setTo(Format(new Date(e.target.value), "yyyy-MM-dd"));
              }}
            />
          </div>
          <a className="btn rounded-sm" onClick={() => generate()}>
            Generate
          </a>
        </div>
        <div>
          <div className="flex header w-5/12 p-2 justify-between">
            <p>Tanggal</p>
            <p>Income</p>
          </div>
          <div className="content">
            {data.map((item) => {
              return (
                <div className="flex content w-5/12 justify-between border p-2 ">
                  <p>{Format(new Date(item.tgl_transaksi), "yyyy-MM-dd")}</p>
                  <p>{item.income}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-5/12 h-80 mt-10">
        <Bar
          data={{
            labels: labels,
            datasets: [
              {
                label: "income",
                backgroundColor: "lightgreen",
                data: incomes,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default laporan;
