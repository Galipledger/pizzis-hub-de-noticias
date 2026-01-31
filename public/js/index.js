window.addEventListener("scroll", ()=>{
 const header = document.querySelector("header")
 if(window.scrollY > 60){
    header.classList.add("achicar")
 }else{
    header.classList.remove("achicar")
 }
})

document.addEventListener('DOMContentLoaded', () => {
   const selectOrder = document.getElementById('order');
   const selectFiltro = document.getElementById('filtro');

   // Recuperar la opción seleccionada del almacenamiento local para el orden
   const storedOrder = localStorage.getItem('order');
   if (storedOrder) {
       selectOrder.value = storedOrder;
   }

   // Recuperar la opción seleccionada del almacenamiento local para el filtro
   const storedFiltro = localStorage.getItem('filtro');
   if (storedFiltro) {
       selectFiltro.value = storedFiltro;
   }

   // Función para deshabilitar el filtro si se selecciona una opción de orden y viceversa
   const updateSelectState = () => {
       if (selectOrder.value === 'asc') {
           // Si se selecciona "Más antiguos", deshabilitar el filtro de "Más likes"
           selectFiltro.value = '';
           selectFiltro.disabled = true;
           localStorage.removeItem('filtro'); // Limpiar el filtro en localStorage
       } else {
           // Habilitar el filtro si no se selecciona "Más antiguos"
           selectFiltro.disabled = false;
       }

       if (selectFiltro.value === 'likes') {
           // Si se selecciona "Más likes", deshabilitar el select de "Ordenar por"
           selectOrder.value = 'desc'; // Volver al valor por defecto (desc)
           localStorage.setItem('order', 'desc'); // Guardar en localStorage
           selectOrder.disabled = true;
       } else {
           // Habilitar el orden si no se selecciona "Más likes"
           selectOrder.disabled = false;
       }
   };

   // Almacenar la opción seleccionada cuando cambia el orden
   selectOrder.addEventListener('change', () => {
       localStorage.setItem('order', selectOrder.value);
       updateSelectState();
   });

   // Almacenar la opción seleccionada cuando cambia el filtro
   selectFiltro.addEventListener('change', () => {
       localStorage.setItem('filtro', selectFiltro.value);
       updateSelectState();
   });

   // Actualizar el estado inicial al cargar la página
   updateSelectState();
});

// Conectar con Socket.io
const socket = io();

// Referencias a los elementos del DOM
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Escuchar el evento de envío de formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    // Emitir el mensaje al servidor
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Escuchar mensajes del servidor y mostrarlos en la página
socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});








