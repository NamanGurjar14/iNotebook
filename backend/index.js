const connectToMongo = require('./db');
const express = require('express')
//var cors = require('cors')
connectToMongo();
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT||8000;
//console.log(port)
//app.use(cors());
app.use(express.json());
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port,()=>{
    console.log(`iNotebook backend started on port ${port}`);
})