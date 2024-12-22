import express from "express"
import handlebars  from "express-handlebars"
import mongoose from "mongoose"
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'
import viewsRoutes from "./routes/views.routes.js"
import __dirname from "./utils.js"

const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`))

app.use(express.static(__dirname + "/public"));


app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/ping", (req, res) => {
    res.send("pong")
})

app.use("/api/products", productsRoutes)
app.use("/api/carts", cartsRoutes)
app.use("/", viewsRoutes)

const DBPATH = "mongodb+srv://alcaldechristian:an591l6r7LH1Mnro@cluster0.dgphy.mongodb.net/phonemart?retryWrites=true&w=majority&appName=Cluster0"

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(DBPATH)
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

connectToMongoDB()