const API = "https://script.google.com/macros/s/AKfycbxmPvNuP6sTzxo9yzELZ-txCIJI5WUss9x-lZHvQqxiNIeHhHHxiNEckNLwzM-w0j8e/exec";

const params = new URLSearchParams(window.location.search);
const token = params.get("token");

let perfil = "";
let historico = [];
let colaboradores = [];

// ======================
// FETCH PRINCIPAL
// ======================
fetch(`${API}?token=${token}`)
  .then(res => res.json())
  .then(data => {
    if (data.erro) {
      document.body.innerHTML = "<h2>Token inválido</h2>";
      return;
    }

    perfil = data.perfil;

    if (perfil === "ADM") {
      carregarADM(data);
    } else {
      carregarUSER(data);
    }
  })
  .catch(() => {
    document.body.innerHTML = "<h2>Erro ao carregar dados</h2>";
  });

// ======================
// USER
// ======================
function carregarUSER(data) {
  document.getElementById("nome").innerText = data.nome;
  document.getElementById("saldo").innerText = data.saldo + "h";

  historico = data.historico;
  renderHistorico();
  renderGrafico();
}

// ======================
// ADM
// ======================
function carregarADM(data) {
  document.getElementById("nome").innerText = "ADM - " + data.nome;
  document.getElementById("admArea").style.display = "block";

  colaboradores = data.colaboradores;
  const select = document.getElementById("colaboradores");
  select.innerHTML = "";

  colaboradores.forEach((c, i) => {
    select.innerHTML += `<option value="${i}">${c.nome}</option>`;
  });

  carregarColaborador(0);
}

function carregarColaborador(index) {
  const c = colaboradores[index];
  document.getElementById("saldo").innerText = c.saldo + "h";
  historico = c.historico;
  renderHistorico();
  renderGrafico();
}

function trocarColaborador() {
  const select = document.getElementById("colaboradores");
  carregarColaborador(select.value);
}

// ======================
// HISTÓRICO
// ======================
function renderHistorico() {
  const tbody = document.getElementById("historico");
  tbody.innerHTML = "";

  historico.slice().reverse().forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(h.data).toLocaleDateString()}</td>
      <td>${h.tipo}</td>
      <td>${h.horas}h</td>
      <td>${h.saldo}h</td>
    `;
    tbody.appendChild(tr);
  });
}

// ======================
// GRÁFICO
// ======================
function renderGrafico() {
  const ctx = document.getElementById("grafico");

  if (window.chart) window.chart.destroy();

  window.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: historico.map(h =>
        new Date(h.data).toLocaleDateString()
      ),
      datasets: [{
        label: "Saldo",
        data: historico.map(h => h.saldo),
        borderWidth: 2
      }]
    }
  });
}

