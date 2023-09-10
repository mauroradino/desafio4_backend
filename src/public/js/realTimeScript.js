const socket = io()
const productContent = document.getElementById("contenidoHome")


socket.on('productsUpdate', (data)=>{
    productContent.innerText = JSON.stringify(data);
    console.log(data)
})
