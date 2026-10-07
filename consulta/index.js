const express = require('express')
const app = express()
app.use(express.json())

const baseConsulta = {}

const funcoes = {
  AvistamentoCriado: (avistamento) => {
    baseConsulta[avistamento.id] = avistamento
    baseConsulta[avistamento.id]['relatos'] = []
  },
  RelatoCriado: (relato) => {
    const relatos = baseConsulta[relato.avistamentoId]['relatos'] || []
    relatos.push(relato)
    baseConsulta[relato.avistamentoId]['relatos'] = relatos
  },
  RelatoConfirmado: (dados) => {
    const avistamento = baseConsulta[dados.avistamentoId]
    if (avistamento) {
      const relato = avistamento.relatos.find(r => r.id === dados.id)
      if (relato) {
        relato.confirmacoes = dados.confirmacoes
      }
    }
  }
}

app.get('/avistamentos', (req, res) => {
  res.status(200).json(baseConsulta)
})

app.get('/avistamentos/:id', (req, res) => {
  const avistamento = baseConsulta[req.params.id]
  if (!avistamento) {
    return res.status(404).json({ erro: "avistamento não encontrado" })
  }
  res.status(200).json(avistamento)
})

app.post('/eventos', (req, res) => {
  const evento = req.body
  try {
    funcoes[evento.tipo](evento.dados)
  } catch (err) {}
  res.status(200).json({ msg: 'ok' })
})

const port = 4200
app.listen(port, () => console.log(`Consulta. Porta ${port}`))