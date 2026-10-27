import express from 'express';



const app = express();
const port = 3000



app.get('/', (req, res)=>{
    res.send("<h1>Whatup</h1>")
})

app.get('/')


app.listen(port, ()=>{
    console.log("server is running on port " + port)
})
