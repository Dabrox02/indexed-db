import { uid } from "./uid.js";

// Funcion que abre base de datos y retorna la conexion db
function abrirBaseDeDatos() {
  const request = indexedDB.open('miBaseDeDatos', 1);
  // En caso no exista la crea.
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Crea un almacén de objetos llamado 'objetos' con una clave primaria 'id'
    const objectStore = db.createObjectStore('objetos', { keyPath: 'id' });
  };

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Función para agregar un objeto a IndexedDB
async function agregarObjeto(objeto) {
  const db = await abrirBaseDeDatos();
  const transaction = db.transaction(['objetos'], 'readwrite');
  const objectStore = transaction.objectStore('objetos');

  const request = objectStore.add(objeto);

  return new Promise((resolve, reject) => {
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

// Función para mostrar objetos en HTML
async function mostrarObjetosEnHTML() {
  const db = await abrirBaseDeDatos();
  const transaction = db.transaction(['objetos'], 'readonly');
  const objectStore = transaction.objectStore('objetos');

  const request = objectStore.getAll();

  request.onsuccess = function(event) {
    const objetos = event.target.result;
    const lista = document.getElementById('lista-objetos');

    // Borra el contenido existente en la lista
    lista.innerHTML = '';

    // Agrega cada objeto a la lista
    objetos.forEach(function(objeto) {
      const li = document.createElement('li');
      li.textContent = `ID: ${objeto.id}, Nombre: ${objeto.nombre}`;
      lista.appendChild(li);
    });
  };
}

// Ejemplo de uso 
// Cada vez que recarga añade un uid
document.addEventListener("DOMContentLoaded", (e)=>{
  mostrarObjetosEnHTML();
})


document.querySelector("#agregar").addEventListener("click", (e)=>{
  let uuid = uid();
  const objetoAgregado = { id: uuid, nombre: `objeto ${uuid}`};
  agregarObjeto(objetoAgregado)
    .then(() => {
      console.log('Objeto agregado con éxito.');
      mostrarObjetosEnHTML();
    })
    .catch(error => {
      console.error('Error al agregar el objeto:', error);
  });
})
