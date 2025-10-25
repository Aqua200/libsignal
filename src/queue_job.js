export default class QueueJob {
  
  #queue = [];

   #isProcessing = false;

  
  add(job) {
    if (typeof job !== 'function') {
      return Promise.reject(new TypeError("El trabajo debe ser una función que devuelve una promesa."));
    }

    return new Promise((resolve, reject) => {
      this.#queue.push({ job, resolve, reject });
      this.#processNext();
    });
  }

  
  async #processNext() {
    if (this.#isProcessing) {
      return;
    }

    this.#isProcessing = true;

    while (this.#queue.length > 0) {
      const { job, resolve, reject } = this.#queue.shift();
      
      try {
        const result = await job();
        resolve(result);
      } catch (error) {
        console.error("❌ Error en un trabajo de la cola:", error);
        reject(error);
      }
    }

    this.#isProcessing = false;
  }

  
  get size() {
    return this.#queue.length;
  }
  
  
  get isProcessing() {
    return this.#isProcessing;
  }

  
  clear() {
    this.#queue = [];
  }
}
