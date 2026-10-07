const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

app.post('/eventos', (req, res) => {
  const evento = req.body
  console.log(evento)
  axios.post('http://localhost:4000/eventos', evento).catch((err) => {
    console.log('Falha ao enviar para a porta 4000')
  })
  axios.post('http://localhost:4100/eventos', evento).catch((err) => {
    console.log('Falha ao enviar para a porta 4100')
  })
  axios.post('http://localhost:4200/eventos', evento).catch((err) => {
    console.log('Falha ao enviar para a porta 4200')
  })
  axios.post('http://localhost:4300/eventos', evento).catch((err) => {
    console.log('Falha ao enviar para a porta 4300')
  })
  res.status(200).json({ msg: 'ok' })
})

const port = 10000
app.listen(port, () => console.log(`Barramento de eventos. Porta ${port}.`))