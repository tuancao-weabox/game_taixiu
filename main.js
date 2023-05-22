const express = require('express')
const app = express()
const port = 3000;

// app.use(express.static(__dirname+'/web/mini-game-trungthu/www'));
// app.listen(port,'192.168.1.10', () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

app.use(express.static(__dirname+'/www'));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})