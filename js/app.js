const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=> {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    //Validar formulario
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        //Hubo un error
        mostrarError('Ambos campos son obligatorios');

        return;
    }

    //Consultar la API
    consultarAPI(ciudad, pais);
}


function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        //Crear una alerta
        const alerta = document.createElement('div');
    
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
    
        
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);

        //Eliminar alerta luego de 5s
        setTimeout(()=> {
            alerta.remove();
        }, 5000);
    }
}

// function mostrarHora(ciudad, pais) {
//     const url = `http://worldtimeapi.org/api/timezone/${pais}/${ciudad}`;

//     fetch(url)
//         .then(respuesta => respuesta.json())
//         .then(datos => console.log(datos));
// }

function consultarAPI(ciudad, pais) {

    const appId = 'bfd65fd4cab12a549a1fd967340f2569';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    spinner(); //spinner de carga

    setTimeout(()=>{
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(datos => {
                console.log(datos);
                limpiarHTML(); //Limpiar el HTML previo
    
                if(datos.cod === "404") {
                    mostrarError('Ciudad no encontrada');
                    return;
                }
                // mostrarHora(ciudad, pais);
                //Imprime la respuesta en el HTML
                mostrarClima(datos);
            })
    }, 2000);
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('P');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('P');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('P');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');
    
    const tempMinima = document.createElement('P');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');    

    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}


//Helpers
const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-folding-cube');

    divSpinner.innerHTML = `
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
    `;

    resultado.appendChild(divSpinner);
}