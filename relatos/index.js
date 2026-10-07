const axios = require('axios')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()
app.use(express.json())

const relatosPorAvistamentoId = {}

app.put('/avistamentos/:id/relatos', async (req, res) => {
  const idRelato = uuidv4()
  const { texto } = req.body
  const relato = {
    id: idRelato,
    texto: texto,
    confirmacoes: 0,
    avistamentoId: req.params.id
  }
  const relatosDoAvistamento = relatosPorAvistamentoId[req.params.id] || []
  relatosDoAvistamento.push(relato)
  relatosPorAvistamentoId[req.params.id] = relatosDoAvistamento

  try {
    await axios.post('http://localhost:10000/eventos', {
      tipo: 'RelatoCriado',
      dados: relato
    })
  } catch (err) {
    console.log("Falha ao enviar evento")
  }

  res.status(201).json(relatosDoAvistamento)
})

app.get('/avistamentos/:id/relatos', (req, res) => {
  res.json(relatosPorAvistamentoId[req.params.id] || [])
})

app.put('/avistamentos/:id/relatos/:idRelato/confirmacoes', async (req, res) => {
  const { id, idRelato } = req.params
  const listaRelatos = relatosPorAvistamentoId[id] || []

  const relato = listaRelatos.find(r => r.id === idRelato)

  if (!relato) {
    return res.status(404).json({ erro: "relato não encontrado" })
  }

  relato.confirmacoes += 1

  try {
    await axios.post('http://localhost:10000/eventos', {
      tipo: 'RelatoConfirmado',
      dados: {
        id: relato.id,
        avistamentoId: id,
        confirmacoes: relato.confirmacoes
      }
    })
  } catch (err) {
    console.log("Falha ao enviar evento")
  }

  return res.status(200).json(relato)
})

app.post('/eventos', (req, res) => {
  console.log(req.body.tipo)
  res.status(200).json({ msg: 'ok' })
})

const port = 4100
app.listen(port, () => console.log(`Relatos. Porta ${port}`))