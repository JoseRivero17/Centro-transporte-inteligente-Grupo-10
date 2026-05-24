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
