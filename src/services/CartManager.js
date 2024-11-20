import fs from "fs/promises";
import path from "path";

const cartsFilePath = path.resolve("src/data", "carts.json");
const productsFilePath = path.resolve("src/data", "products.json");

export default class CartManager {
    constructor() {
        this.carts = [];
        this.init();
    }

    async init() {
        try {
            const cartsData = await fs.readFile(cartsFilePath, "utf-8");
            this.carts = JSON.parse(cartsData);
            const productsData = await fs.readFile(productsFilePath, "utf-8");
            this.products = JSON.parse(productsData);
        } catch (error) {
            this.carts = [];
            this.products = [];
        }
    }

    async saveToFile() {
        try {
            const jsonData = JSON.stringify(this.carts, null, 2);
            await fs.writeFile(cartsFilePath, jsonData);
        } catch (error) {
            console.log(error);
            throw new Error("Error al guardar los datos de los carritos. Por favor, intenta nuevamente.");
        }
    }

    async getAll() {
        return this.carts;
    }

    async getById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    async create() {
        const newCart = {
            id: Math.floor(Math.random() * 1000),
            products: []
        };

        this.carts.push(newCart);

        this.saveToFile();

        return newCart;
    }

    async addProduct(cartId, productId) {
        const productToAdd = this.products.find(prod => prod.id === productId);
        const cartToFind = this.carts.find(cart => cart.id === cartId);

        if (!cartToFind) {
            return { success: false, error: "El carrito solicitado no existe. Por favor, verifica el ID proporcionado." };
        } 

        if (!productToAdd) {
            return { success: false, error: "El producto que intentas agregar no está disponible. Verifica el ID del producto." };
        }

        const isAlreadyAdded = cartToFind.products.find(prod => prod.id === productId);

        if (isAlreadyAdded) {
            isAlreadyAdded.qty++;
        } else {
            cartToFind.products.push({ id: productId, qty: 1 });
        }

        this.saveToFile();

        return { success: true, products: cartToFind.products };
    }
}
