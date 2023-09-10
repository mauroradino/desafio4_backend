import express from "express";
const PORT = 8080;
const app = express();
const productos = []
import { engine } from 'express-handlebars'
import path from 'path'
import { __dirname } from './path.js';
import { productRoutes, cartRoutes} from './routes/products.routes.js'
import { Server } from 'socket.io'

  
const serverExpress = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})

app.use(express.json())
app.use('/', productRoutes);
app.use('/api', cartRoutes);
app.engine('handlebars', engine()) //Defino que motor de plantillas voy a utilizar y su config
app.set('view engine', 'handlebars') //Setting de mi app de hbs
app.set('views', path.resolve(__dirname, './views')) //Resolver rutas absolutas a traves de rutas relativas
app.use('/static', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas
app.use('/new', express.static(path.join(__dirname, '/public'))) //Unir rutas en una sola concatenandolas

//Server Socket.io
const io = new Server(serverExpress)

io.on('connection', (socket) => {
  console.log("Servidor Socket.io conectado");
  socket.on('delServer', (data) => {
    console.log(data);
    socket.emit('productos', "MAURO"); // Emite datos a todos los clientes
  });
  socket.on('newProduct', (data) =>{
    productos.push(data)
    io.emit('productsUpdate', productos)
  })
});




app.use('/products', productRoutes);
app.use('/api/cart', cartRoutes);



app.get('/new', (req, res) => {
  res.render('realTimeProducts', {
    css: "styles.css",
    js: "realTimeScript.js"
  })
})

app.get('/static', (req, res) => {
  res.render('home', {
    title: "MAURO",
    css: 'styles.css',
    js: 'script.js'
  })
})


