//! Variables
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPagina;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFromulario);
}



//! Funciones
function validarFromulario(e) {
    e.preventDefault();
    const busqueda = document.querySelector('#termino').value;
    if (busqueda.trim() === '') {
        mostrarAlerta('Agrega un termino de busqueda')
        return;
    }
    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    const alerta = document.createElement('P');
    alerta.classList.add('bg-red-100', 'creado', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class=block sm:inline">${mensaje}</span>
    `;

    const creado = document.querySelector('.creado');
    if (!creado) {
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 2000);
        return;
    }
}

function buscarImagenes() {

    const termino = document.querySelector('#termino').value;

    const apiKey = '33891332-267562ae0173ce165b84db2f8';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    /**
     *  En la url se le pasa la cantidad de registros que defino por pagina y la pagina actual, de esa forma cuando 
     *  se hace la cosulta la API devuelve los resultados en base a esos datos
     */
    Spinner();
    fetch(url)
        .then(answer => answer.json())
        .then(datos => {
            totalPagina = calcularPag(datos.totalHits);
            mostrarImagenes(datos.hits)
        })
        .catch(error => console.log(error))
}

function mostrarImagenes(fotos = []) {

    limpiarHTML(resultado);

    //TODO Iterar sobre el arreglo de fotos y mostrar en el HTML
    fotos.forEach(foto => {
        const { previewURL, likes, views, largeImageURL } = foto;
        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold"> ${likes} <span class="font-light"> Me Gusta</span> </p>
                    <p class="font-bold"> ${views} <span class="font-light"> Vistas</span> </p>
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                    href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> Ver Imagen</a>
            </div>
        </div>
        `;

    });

    limpiarHTML(paginacionDiv);
    imprimirPaginador();
}

function limpiarHTML(contenedor) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

function calcularPag(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

//TODO Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPagina);

    while (true) {
        const { value, done } = iterador.next();
        if (done) return;

        // Caso contrario genera un boton por cada elemento en el generador
        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-1', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
            boton.classList.add('bg-blue-400');
        }

        paginacionDiv.appendChild(boton);
    }
}


function Spinner() {
    limpiarHTML(resultado);

    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('sk-folding-cube');

    divSpinner.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
    `;

    resultado.appendChild(divSpinner);
}


// API-key: 33891332-267562ae0173ce165b84db2f8
// Enlace-a-la-API-de-Pixabay: https://pixabay.com/api/docs/
// url: https://pixabay.com/api/?key=33891332-267562ae0173ce165b84db2f8&q=yellow+flowers&image_type=photo



















