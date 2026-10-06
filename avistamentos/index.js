const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())
let contador = 0
const avistamentos ={}
app.get('/avistamentos', (req, res) =>{
    res.json(avistamentos)
})
app.put('/avistamentos', async (req,res) =>{
  const { local, descricao } = req.body
  if (local === undefined || local === '' || descricao === undefined || descricao === '') {
    return res.status(400).json({erro:'local e descricao são obrigatórios'})
  }
  contador++
  const avistamento = {
    id: contador,
    local: local,
    descricao: descricao
  }
  avistamentos[contador] = avistamento
  await axios.post('http://localhost:10000/eventos',{
    tipo: 'AvistamentoCriado',
    dados: avistamento
  })
  res.status(201).json(avistamento)
})

app.post('/eventos', (req, res) =>{
  console.log(req.body.tipo)
  res.status(200).json({ msg:'ok'})
})

const port = 4000
app.listen(port,()=>console.log(`Avistamentos. Porta ${port}`))