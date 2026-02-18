const API = "https://script.google.com/macros/s/AKfycbxoP65Aw3OjRo9sfBCnZTyKa0pys8DAwSylLhWfKK2b3LB7G6ZPn22gRfJsstOHddq6/exec";

const params = new URLSearchParams(window.location.search);
const token = params.get("token");

fetch(API, {
  method: "POST",
  body: JSON.stringify({
    token: token,
    action: "get"
  })
})
.then(res => res.json())
.then(data => {
  if (data.erro) {
    document.body.innerHTML = "<h2>Token inválido</h2>";
    return;
  }

  document.getElementById("nome").innerText = data.nome;
  document.getElementById("saldo").innerText = data.saldo + "h";

  const tbody = document.getElementById("historico");
  data.historico.forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(h.data).toLocaleDateString()}</td>
      <td>${h.credito}</td>
      <td>${h.debito}</td>
      <td>${h.saldo}</td>
    `;
    tbody.appendChild(tr);
  });
})
.catch(() => {
  document.body.innerHTML = "<h2>Erro ao carregar dados</h2>";
});

