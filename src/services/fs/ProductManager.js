import fs from "fs/promises";
import path from "path";

const productsFilePath = path.resolve("src/data", "products.json");

export default class ProductManager {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(productsFilePath, "utf-8");
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    async saveToFile() {
        try {
            const jsonData = JSON.stringify(this.products, null, 2);
            await fs.writeFile(productsFilePath, jsonData);
        } catch (error) {
            console.log(error);
            throw new Error("Hubo un problema al guardar los datos de los productos. Por favor, intenta nuevamente.");
        }
    }

    async getAll(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }

    async getById(id) {
        return this.products.find(prod => prod.id === id);
    }

    async add(product) {
        const newProduct = {
            id: Math.floor(Math.random() * 1000),
            ...product,
            status: true
        };

        this.products.push(newProduct);

        this.saveToFile();

        return newProduct;
    }

    async update(id, updatedFields) {
        const productIndex = this.products.findIndex(prod => prod.id === id);

        if (productIndex === -1) {
            throw new Error("El producto que intentas actualizar no existe. Por favor, verifica el ID proporcionado.");
        }
        
        const updatedProduct = {
            ...this.products[productIndex],
            ...updatedFields,
            id: this.products[productIndex].id
        };

        this.products[productIndex] = updatedProduct;

        this.saveToFile();

        return updatedProduct;
    }

    async delete(id) {
        const productIndex = this.products.findIndex(prod => prod.id === id);

        if (productIndex === -1) {
            throw new Error("El producto que intentas eliminar no se encuentra en la lista. Verifica el ID ingresado.");
        }

        const deletedProduct = this.products.splice(productIndex, 1);

        this.saveToFile();

        return deletedProduct[0];
    }
}
