const socket = io()

const newProductForm = document.getElementById("newProductForm")
const productsContainer = document.getElementById("productsContainer")
const notificationsContainer = document.getElementById("notificationsContainer") || createNotificationContainer()


function createNotificationContainer() {
    const container = document.createElement("div")
    container.id = "notificationsContainer"
    container.style.position = "fixed"
    container.style.top = "10px"
    container.style.right = "10px"
    container.style.width = "300px"
    container.style.zIndex = "1000"
    document.body.appendChild(container)
    return container
}


function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.textContent = message
    notification.style.background = type === "success" ? "green" : "red"
    notification.style.color = "white"
    notification.style.padding = "10px"
    notification.style.marginBottom = "10px"
    notification.style.borderRadius = "5px"
    notification.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)"
    notification.style.opacity = "0"
    notification.style.transition = "opacity 0.5s"

    notificationsContainer.appendChild(notification)


    setTimeout(() => {
        notification.style.opacity = "1"
    }, 50)

    setTimeout(() => {
        notification.style.opacity = "0"
        setTimeout(() => {
            notificationsContainer.removeChild(notification)
        }, 500)
    }, 3000)
}

newProductForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = new FormData(newProductForm)
    const newObjectProduct = {}
    data.forEach((value, key) => newObjectProduct[key] = value)

    try {
        const response = await fetch("/api/products", {
            method: 'POST',
            body: JSON.stringify(newObjectProduct),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            const product = await response.json();
            socket.emit("newProduct", product.data);
            showNotification("¡Producto registrado exitosamente!");
            newProductForm.reset();
        } else {
            console.error("Hubo un problema al registrar el producto:", response.status);
            showNotification("No se pudo registrar el producto. Por favor, revisa la información proporcionada.", "error");
        }
        } catch (error) {
            console.error("Ocurrió un problema durante el envío", error);
            showNotification("Hubo un inconveniente al intentar registrar el producto.", "error");
    }
})

const handleDeleteButtons = () => {
    const deleteBtns = document.getElementsByClassName("deleteButton")
    const arrayDeleteBtns = Array.from(deleteBtns)

    if (!arrayDeleteBtns.length == 0) {
        arrayDeleteBtns.forEach(el => {
            el.addEventListener("click", e => {
                socket.emit("deletedProduct", el.id)
                showNotification(`Producto con ID ${el.id} eliminado`, "success")
            })
        })
    }
}

const getElementsBySocket = () => {
    socket.on("allProducts", data => {
        productsContainer.innerHTML = ""
        data.forEach (el => {
            productsContainer.innerHTML += `
                <div class="productCard">
                    <p>${el.title}</p>
                    <p>${el.description}</p>
                    <p>$ ${el.price}</p>
                    <button class="deleteButton" id=${el.id}>
                        Eliminar
                    </button>
                </div>
            `
        })

        handleDeleteButtons()
    })
}

getElementsBySocket()
