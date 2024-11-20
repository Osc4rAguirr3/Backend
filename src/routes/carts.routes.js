import { Router } from "express";
import CartManager from "../services/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.status(200).json({ success: true, data: carts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "No se pudieron obtener los carritos. Por favor, intenta más tarde." });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getById(cartId);

        if (!cart) {
            return res.status(404).json({ success: false, error: "El carrito solicitado no existe en nuestra base de datos." });
        } else {
            res.status(200).json({ success: true, data: cart.products });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Hubo un problema al procesar tu solicitud. Por favor, inténtalo más tarde." });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.create();
        res.status(201).json({ success: true, data: newCart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "No fue posible crear el carrito. Por favor, revisa los datos e inténtalo nuevamente." });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const addProduct = await cartManager.addProduct(cartId, productId);

        if (!addProduct.success) {
            return res.status(404).json({ success: false, error: "No se pudo agregar el producto al carrito. Verifica los datos proporcionados." });
        } else {
            res.status(200).json({ success: true, data: addProduct.products });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Se produjo un error al intentar agregar el producto al carrito. Por favor, intenta más tarde." });
    }
});

export default router;
