import { show } from "./toast";

const API = "http://localhost:3000/apotek/api";

export async function loginAPI(values) {
  return await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
    .then((res) => res.json())
    .catch((err) => ({ status: 400, response: err.toString() }));
}

export async function addItem(table, values) {
  let endpoint = `${API}/${table}`;
  return await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
    .then((res) => res.json())
    .catch((err) => ({ status: 400, response: err.toString() }));
}

export async function getItem(table, id = "", query = "") {
  let endpoint = `${API}/${table}`;
  console.log(endpoint);
  if (id) {
    endpoint = `${endpoint}/${id}`;
  } else if (query) {
    endpoint = `${endpoint}?${query}`;
  }

  console.log(endpoint);

  return await fetch(endpoint, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((err) => ({ status: 400, response: err.toString() }));
}

export async function addLog(values) {
  const result = await addItem("log", values);
  if (result.status !== 200) {
    console.log("Gagal menambah log");
  }
}

export async function updateItem(table, id, values) {
  let endpoint = `${API}/${table}/${id}`;
  return await fetch(endpoint, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
    .then((res) => res.json())
    .catch((err) => ({ status: 400, response: err.toString() }));
}

export async function deleteItem(table, id) {
  let endpoint = `${API}/${table}/${id}`;
  return await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => ({ status: 400, response: err.toString() }));
}
