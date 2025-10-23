/**
 * Clase simple de cola de trabajo asíncrona.
 * Permite agregar funciones (jobs) y procesarlas en orden.
 */

class QueueJob {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    /**
     * Agrega un job a la cola
     * @param {Function} job - Función asíncrona que retorna una promesa
     */
    add(job) {
        if (typeof job !== 'function') {
            throw new TypeError("❌ El job debe ser una función asíncrona");
        }
        this.queue.push(job);
        this.process();
    }

    /**
     * Procesa la cola de jobs de manera secuencial
     */
    async process() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const job = this.queue.shift();
            try {
                await job();
            } catch (error) {
                console.error("❌ Error en job de la cola:", error.message);
            }
        }

        this.processing = false;
    }

    /**
     * Retorna la cantidad de jobs pendientes
     * @returns {number}
     */
    size() {
        return this.queue.length;
    }

    /**
     * Vacía la cola
     */
    clear() {
        this.queue = [];
    }
}

module.exports = QueueJob;
