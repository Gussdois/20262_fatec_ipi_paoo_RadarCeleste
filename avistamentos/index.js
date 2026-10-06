const express = require('express');
const app = express();

app.use(express.json());
const avistamentos = {};
let contador = 0;
app.get('/avistamentos', (req,res)=>{
    res.send(avistamentos);
});
app.put('/avistamentos', (req, res)=>{
    const{local, descricao} = req.body;
    if (!local || !descricao){
        return res.status(400).send({erro: "local e descricao sao obrigatorios"});
    }
    contador++;
    avistamentos[contador] = {
        id:contador,
        local,
        descricao
    };
    res.status(201).send(avistamentos[contador]);
});
app.listen(4000, ()=>{
    console.log("Avistamentos. Porta 4000");
});