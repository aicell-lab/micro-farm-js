
export class AmmoSingleton {
    private static instance: typeof import("ammojs-typed").default | null = null;
    static async init() {
        if (!this.instance) {
            this.instance = (await (await import("ammojs-typed")).default()) as typeof import("ammojs-typed").default;
        }
    }
    static get() {
        if (!this.instance) {
            throw new Error("Ammo has not been initialized. Call AmmoSingleton.init() first.");
        }
        return this.instance;
    }
}

