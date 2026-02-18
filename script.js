const API = "https://script.google.com/macros/s/AKfycbwgRacSB3NbqBdbJ7SHbefmZyIAtZ7KDoBeJxi5KdVsCtGwBUq9GQYqiDuC5I4NVLc3/exec";
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (!token) {
  document.body.innerHTML = "<h2>Acesso negado. Token não informado.</h2>";
  throw new Error("Token ausente");
}

fetch(`${API}?token=${token}`)
  .then(r => r.json())
  .then(d => {
    if (d.erro) {
      document.body.innerHTML = "<h2>Token inválido</h2>";
      return;
    }

    document.getElementById("nome").innerText = d.nome;
    document.getElementById("saldo").innerText = d.saldo + " h";

    const devedor = d.saldo < 0 ? Math.abs(d.saldo) : 0;
    document.getElementById("devedor").innerText = devedor + " h";

    const usados = 26 - d.saldo;
    const mediaDia = usados / 180;
    const dias = mediaDia > 0 ? Math.ceil(d.saldo / mediaDia) : "—";

    document.getElementById("previsao").innerText =
      dias === "—" ? "Sem previsão" : dias + " dias";

    const tabela = document.getElementById("tabela");
    d.historico.forEach(l => {
      tabela.innerHTML += `
        <tr>
          <td>${new Date(l[0]).toLocaleDateString()}</td>
          <td>${l[2]}</td>
          <td>${l[3]}</td>
          <td>${l[4]}</td>
        </tr>
      `;
    });
  });

