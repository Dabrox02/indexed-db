import { uid } from "./uid.js";


let title = document.querySelector(".title");
const estilos = {
  color: "orange",
  fontFamily: "Arial, Helvetica, sans-serif"
}

Object.assign(title.style, estilos);

// Función para abrir la base de datos
function abrirBaseDeDatos() {
  const request = indexedDB.open('miBaseDeDatos', 1);

  request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Crea un almacén de objetos llamado 'objetos' con una clave primaria 'id'
    const objectStore = db.createObjectStore('objetos', { keyPath: 'id' });

    // Puedes agregar índices u otras configuraciones aquí si es necesario
  };

  return new Promise((resolve, reject) => {
    request.onsuccess = function(event) {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = function(event) {
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
let ud = uid();
const objetoAgregado = { id: ud, nombre: "objeto jaider"};
agregarObjeto(objetoAgregado)
  .then(() => {
    console.log('Objeto agregado con éxito.');
    mostrarObjetosEnHTML();
  })
  .catch(error => {
    console.error('Error al agregar el objeto:', error);
  });

