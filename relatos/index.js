const axios = require('axios')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()
app.use(express.json())
const relatosPorAvistamentoId ={}
app.put('/avistamentos/:id/relatos',async(req,res)=>{
  const idRelato =uuidv4()
  const {texto} =req.body
  const relato ={
    id: idRelato,
    texto: texto,
    confirmacoes: 0,
    avistamentoId: req.params.id
  }
  const relatosDoAvistamento = relatosPorAvistamentoId[req.params.id] || []
  relatosDoAvistamento.push(relato)
  relatosPorAvistamentoId[req.params.id] =relatosDoAvistamento
  await axios.post('http://localhost:10000/eventos',{
    tipo: 'RelatoCriado',
    dados: relato
  })
  res.status(201).json(relatosDoAvistamento)
})

app.get('/avistamentos/:id/relatos',(req,res) =>{
  res.json(relatosPorAvistamentoId[req.params.id] || [])
})

app.post('/eventos',(req,res) =>{
  console.log(req.body.tipo)
  res.status(200).json({ msg:'ok'})
})

const port = 4100
app.listen(port,()=>console.log(`Relatos. Porta ${port}`))