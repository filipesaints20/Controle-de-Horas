const API = "https://script.google.com/macros/s/AKfycbwgRacSB3NbqBdbJ7SHbefmZyIAtZ7KDoBeJxi5KdVsCtGwBUq9GQYqiDuC5I4NVLc3/exec";
const token = new URLSearchParams(window.location.search).get("token");

fetch(`${API}?token=${token}`)
  .then(r => r.json())
  .then(d => {
    document.getElementById("nome").innerText = d.nome;
    document.getElementById("saldo").innerText = d.saldo + " h";

    const devedor = d.saldo < 0 ? Math.abs(d.saldo) : 0;
    document.getElementById("devedor").innerText = devedor + " h";

    // Previsão (6 meses = 180 dias)
    const usados = 26 - d.saldo;
    const mediaDia = usados / 180;
    const diasRestantes = mediaDia > 0 ? Math.round(d.saldo / mediaDia) : "—";

    document.getElementById("previsao").innerText =
      diasRestantes === "—" ? "Sem previsão" : `${diasRestantes} dias`;

    // Histórico
    const tabela = document.getElementById("tabela");
    const labels = [];
    const saldos = [];

    d.historico.forEach(l => {
      tabela.innerHTML += `
        <tr>
          <td>${new Date(l[0]).toLocaleDateString()}</td>
          <td>${l[2]}</td>
          <td>${l[3]}</td>
          <td>${l[4]}</td>
        </tr>
      `;
      labels.push(new Date(l[0]).toLocaleDateString());
      saldos.push(l[4]);
    });

    // Gráfico
    new Chart(document.getElementById("graficoHoras"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Evolução do Saldo",
          data: saldos,
          borderWidth: 2
        }]
      }
    });
  });
