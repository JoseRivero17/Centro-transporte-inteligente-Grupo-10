const projectLinks = document.querySelectorAll(".project-link");

if (projectLinks.length > 0) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
            <p class="eyebrow">Proyecto destacado</p>
            <h2 id="project-modal-title">Centro Transporte Inteligente</h2>
            <p>Estás por visitar el último proyecto desarrollado por TransitWeb Solutions.</p>
            <div class="modal-actions">
                <button type="button" class="button cancel" data-close-modal>Cancelar</button>
                <a href="#" class="button primary" data-continue-link>Continuar</a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const continueLink = modal.querySelector("[data-continue-link]");
    const closeButton = modal.querySelector("[data-close-modal]");

    projectLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            continueLink.href = link.href;
            modal.classList.add("is-visible");
            closeButton.focus();
        });
    });

    closeButton.addEventListener("click", () => {
        modal.classList.remove("is-visible");
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("is-visible");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            modal.classList.remove("is-visible");
        }
    });
}
