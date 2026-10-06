const express = require('express')
const app = express()
app.use(express.json())
const baseConsulta = {}
const funcoes ={
  AvistamentoCriado: (avistamento) =>{
    baseConsulta[avistamento.id]= avistamento
    baseConsulta[avistamento.id]['relatos'] = []
  },
  RelatoCriado: (relato) =>{
    const relatos = baseConsulta[relato.avistamentoId]['relatos'] || []
    relatos.push(relato)
    baseConsulta[relato.avistamentoId]['relatos'] = relatos
  }
}
app.get('/avistamentos',(req,res) =>{
  res.status(200).json(baseConsulta)
})
app.post('/eventos',(req,res) =>{
  const evento =req.body
  try {
    funcoes[evento.tipo](evento.dados)
  } catch (err) {}
  res.status(200).json({msg:'ok'})
})
const port = 4200
app.listen(port,()=>console.log(`Consulta. Porta ${port}`))