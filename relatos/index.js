const express = require("express");
const{ v4: uuidv4} = require('uuid');
const axios = require('axios');
const app = express();

app.use(express.json());
const relatosPorAvistamentoId = {};

app.get("/relatos", (req, res) =>{
    res.send(relatosPorAvistamentoId);
});
app.put("/relatos/:id/avistamentos", (req,res)=>{
    res.send(relatosPorAvistamentoId[req.params.id] || []);
});
app.put('/avistamentos/:id/relatos', async(req,res) =>{
    const idRelato =uuidv4();
    const {texto} = req.body;
    if(!texto){
        return res.status(400).send({erro: "texto do relato é obrigatorio"});
    }
    try{
        await axios.get("http://localhost:4000/avistamentos");
    } catch(err){
        console.log('Aviso: Não foi possivel validar com o microsserviço de avistamentos.');
    }
    const relatosDoAvistamento = relatosPorAvistamentoId[req.params.id] || [];
    const novoRelato = {id: idRelato, texto};
    relatosDoAvistamento.push(novoRelato);
    relatosPorAvistamentoId[req.params.id] = relatosDoAvistamento;
    await axios.post('http://localhost:10000/eventos',{
        tipo: 'RelatoCriado',
        dados:{
            id: idRelato,
            texto: texto,
            idAvistamento: req.params.id
        }
    });
    res.status(201).send(novoRelato);
});
app.post('/eventos',(req,res)=> {
    console.log('Evento recebido no microsserviço de Relatos:',req.body.tipo);
    res.status(200).send({ msg: 'ok'});
});
app.listen(4100,()=>{
    console.log('relatos. Porta 4100');
});