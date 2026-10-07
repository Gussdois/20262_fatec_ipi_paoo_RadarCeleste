const express = require('express');

const app = express();
app.use(express.json());

const totais = { avistamentos: 0, relatos: 0, confirmacoes: 0 };
const locais = {};
const mapeamentoAvistamentoLocal = {};

const funcoes = {
  AvistamentoCriado: (dados) => {
    mapeamentoAvistamentoLocal[dados.id] = dados.local;
    if (!locais[dados.local]) {
      locais[dados.local] = { avistamentos: 0, relatos: 0, confirmacoes: 0 };
    }
    locais[dados.local].avistamentos += 1;
    totais.avistamentos += 1;
  },
  RelatoCriado: (dados) => {
    const local = mapeamentoAvistamentoLocal[dados.avistamentoId];
    if (local && locais[local]) {
      locais[local].relatos += 1;
      totais.relatos += 1;
    }
  },
  RelatoConfirmado: (dados) => {
    const local = mapeamentoAvistamentoLocal[dados.avistamentoId];
    if (local && locais[local]) {
      locais[local].confirmacoes += 1;
      totais.confirmacoes += 1;
    }
  }
};

app.get('/estatisticas', (req, res) => {
  res.send({ totais, locais });
});

app.get('/estatisticas/destaque', (req, res) => {
  const nomesLocais = Object.keys(locais);
  if (nomesLocais.length === 0) {
    return res.status(404).send({ erro: "sem dados" });
  }

  let maiorEngajamento = -1;
  let localDestaque = null;

  for (const local of nomesLocais) {
    const engajamento = locais[local].relatos + locais[local].confirmacoes;
    if (engajamento > maiorEngajamento) {
      maiorEngajamento = engajamento;
      localDestaque = local;
    }
  }

  res.send({ local: localDestaque, engajamento: maiorEngajamento });
});

app.post('/eventos', (req, res) => {
  try {
    const { tipo, dados } = req.body;
    if (funcoes[tipo]) {
      funcoes[tipo](dados);
    }
  } catch (err) {}
  res.status(200).send({ msg: "ok" });
});

app.listen(4300, () => {
  console.log('Estatisticas. Porta 4300.');
});