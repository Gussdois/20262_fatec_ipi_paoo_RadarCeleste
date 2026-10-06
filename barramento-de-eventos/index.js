const express = require('express');
const axios = require("axios");

const app = express();
app.use(express.json());
app.post('/eventos',(req,res) =>{
    const evento = req.body;
    axios.post('http://localhost:4000/eventos',evento).catch((err) =>{
        console.log('Erro ao enviar para avistamentos:', err.message);
    });
    axios.post('http://localhost:4100/eventos',evento).catch((err) =>{
        console.log('Erro ao enviar para relatos:',err.message);
    });
    res.status(200).send({ status: 'OK'});
});
app.listen(10000, ()=> {
    console.log('Barramento de enventos rodando na porta 10000.')
});