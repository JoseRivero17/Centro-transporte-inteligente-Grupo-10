// =============================================
//  script.js — Línea Roca
//  GeoTransporte · Grupo 10 · UADE 2026
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    // ---- VARIABLES ----
    const tabs          = document.querySelectorAll(".tab");
    const inputBusqueda = document.getElementById("input-busqueda");
    const sinResultados = document.getElementById("sin-resultados");
    const contador      = document.getElementById("contador-paradas");

    // Ramal activo al inicio
    let ramalActivo = "la-plata";

    // ---- FUNCIÓN: obtener las paradas del ramal visible ----
    function obtenerParadas() {
        return document.querySelectorAll("#ramal-" + ramalActivo + " .parada");
    }

    // ---- FUNCIÓN: actualizar el contador ----
    function actualizarContador(visibles, total) {
        contador.textContent = "Mostrando " + visibles + " de " + total + " estaciones";
    }

    // ---- FUNCIÓN: filtrar paradas según el texto del buscador ----
    function filtrarParadas() {
        const texto   = inputBusqueda.value.toLowerCase();
        const paradas = obtenerParadas();
        let visibles  = 0;

        paradas.forEach(function (parada) {
            const nombre = parada.querySelector("strong").textContent.toLowerCase();

            if (nombre.includes(texto)) {
                parada.style.display = "flex";
                visibles++;
            } else {
                parada.style.display = "none";
            }
        });

        actualizarContador(visibles, paradas.length);

        // Mostrar mensaje si no hay resultados
        sinResultados.style.display = visibles === 0 ? "block" : "none";
    }

    // ---- FUNCIÓN: cambiar de ramal al hacer click en un tab ----
    function cambiarRamal(nuevoRamal) {
        // 1. Ocultar el ramal anterior
        const anterior = document.getElementById("ramal-" + ramalActivo);
        if (anterior) anterior.style.display = "none";

        // 2. Mostrar el nuevo ramal
        const nuevo = document.getElementById("ramal-" + nuevoRamal);
        if (nuevo) nuevo.style.display = "flex";

        // 3. Actualizar el tab activo visualmente
        tabs.forEach(function (tab) {
            const esteRamal = tab.dataset.ramal === nuevoRamal;
            tab.classList.toggle("activo", esteRamal);
            tab.setAttribute("aria-selected", esteRamal ? "true" : "false");
        });

        // 4. Guardar el ramal activo
        ramalActivo = nuevoRamal;

        // 5. Limpiar el buscador y actualizar el contador con el nuevo ramal
        inputBusqueda.value = "";
        sinResultados.style.display = "none";

        const paradas = obtenerParadas();
        paradas.forEach(function (p) { p.style.display = "flex"; });
        // Quitar marcas de salida/llegada de una consulta anterior
        paradas.forEach(function (p) { p.classList.remove("salida", "llegada"); });
        actualizarContador(paradas.length, paradas.length);
    }

    // ---- EVENTOS: click en cada tab ----
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            cambiarRamal(tab.dataset.ramal);
        });
    });

    // ---- EVENTO: escritura en el buscador ----
    inputBusqueda.addEventListener("input", filtrarParadas);

    // ---- INICIALIZAR: mostrar el contador del ramal por defecto ----
    const paradasIniciales = obtenerParadas();
    actualizarContador(paradasIniciales.length, paradasIniciales.length);

});


// =============================================
//  CONSULTA DE VIAJES — Línea Roca
//  Datos simulados (fines académicos · TPO)
//  El usuario elige origen y destino y la página:
//   - informa transporte recomendado, andén, tiempo y costo
//   - filtra la lista de "Paradas y estaciones" para mostrar
//     SOLO el tramo entre la estación de salida y la de llegada.
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    // ---- DATOS SIMULADOS: ramales de la Línea Roca ----
    // "id" coincide con el data-ramal de los tabs y con el id del
    // contenedor de paradas (por ejemplo: ramal-la-plata).
    // El orden de "estaciones" es el MISMO que el de las paradas
    // en el HTML, así el índice sirve para ubicar el tramo.
    const ramales = [
        {
            id: "la-plata",
            nombre: "La Plata",
            terminal: "La Plata",
            anden: "1",
            estaciones: [
                "Plaza Constitución", "D. Santillán y M. Kosteki", "Sarandí", "Villa Domínico",
                "Wilde", "Don Bosco", "Bernal", "Quilmes", "Ezpeleta", "Berazategui",
                "Plátanos", "Hudson", "Pereyra", "Villa Elisa", "City Bell", "Gonnet",
                "Ringuelet", "Tolosa", "La Plata"
            ]
        },
        {
            id: "alejandro-korn",
            nombre: "Alejandro Korn",
            terminal: "Alejandro Korn",
            anden: "5",
            estaciones: [
                "Plaza Constitución", "Hipólito Yrigoyen", "D. Santillán y M. Kosteki", "Gerli",
                "Lanús", "Remedios de Escalada", "Banfield", "Lomas de Zamora", "Temperley",
                "Adrogué", "Burzaco", "Longchamps", "Glew", "Guernica", "Alejandro Korn"
            ]
        },
        {
            id: "ezeiza",
            nombre: "Ezeiza",
            terminal: "Ezeiza",
            anden: "6",
            estaciones: [
                "Plaza Constitución", "Hipólito Yrigoyen", "D. Santillán y M. Kosteki", "Gerli",
                "Lanús", "Remedios de Escalada", "Banfield", "Lomas de Zamora", "Temperley",
                "Turdera", "Lavallol", "Guillón", "Monte Grande", "El Jagüel", "Ezeiza"
            ]
        },
        {
            id: "bosques",
            nombre: "Bosques (vía Quilmes)",
            terminal: "Bosques",
            anden: "3",
            estaciones: [
                "Plaza Constitución", "Sarandí", "Villa Domínico", "Wilde", "Don Bosco",
                "Bernal", "Quilmes", "Ezpeleta", "Berazategui", "Villa España",
                "Ranelagh", "Sourigues", "Bosques"
            ]
        },
        {
            id: "gutierrez",
            nombre: "Bosques (vía Temperley) → Gutiérrez",
            terminal: "Gutiérrez",
            anden: "2",
            estaciones: [
                "Plaza Constitución", "Hipólito Yrigoyen", "D. Santillán y M. Kosteki", "Gerli",
                "Lanús", "Remedios de Escalada", "Banfield", "Lomas de Zamora", "Temperley",
                "José Mármol", "Rafael Calzada", "Claypole", "Ardigó", "Florencio Varela",
                "Zeballos", "Bosques", "Santa Sofía", "Gutiérrez"
            ]
        },
        {
            id: "temperley-haedo",
            nombre: "Temperley – Haedo (transversal)",
            terminal: "Haedo",
            anden: "1",
            estaciones: [
                "Temperley", "Hospital Español", "Santa Catalina", "Juan XXIII", "Km 34",
                "P. Turner", "Agustín de Elía", "La Tablada", "San Justo", "Ingeniero Brian",
                "Haedo"
            ]
        }
    ];

    // ---- VARIABLES: elementos del DOM ----
    const form = document.getElementById("form-consulta");
    // Si esta página no tiene el formulario, no seguimos (evita errores).
    if (!form) return;

    const selectOrigen  = document.getElementById("select-origen");
    const selectDestino = document.getElementById("select-destino");
    const aviso         = document.getElementById("consulta-aviso");
    const resultado     = document.getElementById("consulta-resultado");
    const elRecorrido   = document.getElementById("resultado-recorrido");
    const elTransporte  = document.getElementById("resultado-transporte");
    const elAnden       = document.getElementById("resultado-anden");
    const elTiempo      = document.getElementById("resultado-tiempo");
    const elCosto       = document.getElementById("resultado-costo");

    // ---- FUNCIÓN: armar la lista de estaciones únicas (sin repetir) ----
    function obtenerEstacionesUnicas() {
        const todas = [];
        ramales.forEach(function (ramal) {
            ramal.estaciones.forEach(function (estacion) {
                if (todas.indexOf(estacion) === -1) {
                    todas.push(estacion);
                }
            });
        });
        // Orden alfabético (respetando acentos del español)
        todas.sort(function (a, b) {
            return a.localeCompare(b, "es");
        });
        return todas;
    }

    // ---- FUNCIÓN: cargar las estaciones en los dos selects ----
    function cargarEstaciones() {
        const estaciones = obtenerEstacionesUnicas();
        estaciones.forEach(function (estacion) {
            selectOrigen.appendChild(new Option(estacion, estacion));
            selectDestino.appendChild(new Option(estacion, estacion));
        });
    }

    // ---- FUNCIÓN: buscar el mejor ramal que conecte origen y destino ----
    // Devuelve el ramal con menos estaciones intermedias y los índices
    // de origen y destino dentro de ese ramal, o null si no hay servicio directo.
    function buscarViaje(origen, destino) {
        let mejor = null;

        ramales.forEach(function (ramal) {
            const i = ramal.estaciones.indexOf(origen);
            const j = ramal.estaciones.indexOf(destino);

            // Las dos estaciones tienen que estar en el mismo ramal
            if (i !== -1 && j !== -1) {
                const tramos  = Math.abs(j - i);
                // El sentido depende de si vamos "hacia la terminal" o "hacia Constitución"
                const sentido = j > i ? ramal.terminal : ramal.estaciones[0];

                if (mejor === null || tramos < mejor.tramos) {
                    mejor = {
                        ramal:    ramal,
                        tramos:   tramos,
                        sentido:  sentido,
                        iOrigen:  i,
                        iDestino: j
                    };
                }
            }
        });

        return mejor;
    }

    // ---- FUNCIÓN: costo estimado según cantidad de tramos (tarifa por secciones) ----
    function calcularCosto(tramos) {
        if (tramos <= 6)  return 373;
        if (tramos <= 12) return 447;
        if (tramos <= 18) return 522;
        return 596;
    }

    // ---- FUNCIÓN: tiempo estimado (~3,5 min por tramo + 2 de maniobras) ----
    function calcularTiempo(tramos) {
        const minutos = Math.round(tramos * 3.5) + 2;
        if (minutos < 60) {
            return minutos + " min";
        }
        const horas = Math.floor(minutos / 60);
        const resto = minutos % 60;
        return horas + "h " + resto + "min";
    }

    // ---- FUNCIÓN: mostrar un aviso y ocultar el resultado ----
    function mostrarAviso(mensaje) {
        aviso.textContent = mensaje;
        aviso.style.display = "block";
        resultado.style.display = "none";
    }

    // ---- FUNCIÓN: filtrar la sección de Paradas para mostrar solo el tramo ----
    // 1) activa el tab del ramal correcto (reutiliza la lógica de arriba),
    // 2) deja visibles solo las estaciones entre salida y llegada,
    // 3) marca la estación de salida y la de llegada,
    // 4) actualiza el contador con la info del tramo.
    function filtrarTramoEnParadas(viaje, origen, destino) {
        // 1) Activar el ramal: simulamos el click en su tab
        const tabRamal = document.querySelector('.tab[data-ramal="' + viaje.ramal.id + '"]');
        if (tabRamal) tabRamal.click();

        // 2) Mostrar solo las paradas del tramo
        const contenedor = document.getElementById("ramal-" + viaje.ramal.id);
        const paradas    = contenedor.querySelectorAll(".parada");

        const desde = Math.min(viaje.iOrigen, viaje.iDestino);
        const hasta = Math.max(viaje.iOrigen, viaje.iDestino);
        let visibles = 0;

        paradas.forEach(function (parada, indice) {
            const enTramo = indice >= desde && indice <= hasta;
            parada.style.display = enTramo ? "flex" : "none";
            parada.classList.remove("salida", "llegada");
            if (enTramo) visibles++;
        });

        // 3) Marcar salida (origen) y llegada (destino)
        paradas[viaje.iOrigen].classList.add("salida");
        paradas[viaje.iDestino].classList.add("llegada");

        // 4) Actualizar el contador del tramo
        const contador = document.getElementById("contador-paradas");
        if (contador) {
            contador.textContent = "Tramo " + origen + " → " + destino + ": " + visibles + " estaciones";
        }
    }

    // ---- FUNCIÓN: mostrar el resultado del viaje ----
    function mostrarResultado(origen, destino, viaje) {
        const costo = calcularCosto(viaje.tramos);

        elRecorrido.textContent =
            "Salida: " + origen + "  ·  Llegada: " + destino + "  ·  " + viaje.tramos + " estaciones";
        elTransporte.textContent = "Línea Roca — Ramal " + viaje.ramal.nombre;
        elAnden.textContent      = "Andén " + viaje.ramal.anden + " — sentido " + viaje.sentido;
        elTiempo.textContent     = calcularTiempo(viaje.tramos);
        elCosto.textContent      = "$" + costo + " (tarifa SUBE estimada)";

        aviso.style.display = "none";
        resultado.style.display = "block";
    }

    // ---- EVENTO: cuando se envía el formulario ----
    form.addEventListener("submit", function (evento) {
        evento.preventDefault(); // evita que la página se recargue

        const origen  = selectOrigen.value;
        const destino = selectDestino.value;

        // Validación 1: que estén las dos estaciones elegidas
        if (origen === "" || destino === "") {
            mostrarAviso("Elegí una estación de origen y una de destino.");
            return;
        }

        // Validación 2: que no sean la misma
        if (origen === destino) {
            mostrarAviso("El origen y el destino no pueden ser la misma estación.");
            return;
        }

        // Buscar un ramal directo
        const viaje = buscarViaje(origen, destino);

        // Validación 3: que exista un servicio directo
        if (viaje === null) {
            mostrarAviso(
                "No hay un servicio directo de la Línea Roca entre esas estaciones. " +
                "Probá combinando vía Constitución o Temperley."
            );
            return;
        }

        // Todo OK: mostramos el resultado y filtramos las paradas del tramo
        mostrarResultado(origen, destino, viaje);
        filtrarTramoEnParadas(viaje, origen, destino);

        // Llevamos al usuario hasta la lista de paradas filtrada
        document.getElementById("paradas").scrollIntoView({ behavior: "smooth" });
    });

    // ---- INICIALIZAR: cargar las estaciones al abrir la página ----
    cargarEstaciones();

});
