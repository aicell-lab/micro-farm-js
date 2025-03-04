type AmmoType = typeof import("ammojs-typed").default;

export class AmmoSingleton {
    private static instance: AmmoType | null = null;

    static async init(): Promise<void> {
        if (!this.instance) {
            const AmmoModule = await import("ammojs-typed");
            this.instance = (await AmmoModule.default()) as AmmoType;
        }
    }

    static get(): AmmoType {
        if (!this.instance) {
            throw new Error("Ammo.js has not been initialized. Call AmmoSingleton.init() first.");
        }
        return this.instance;
    }
}
