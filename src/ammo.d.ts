declare module "ammo.js" {
    import * as AmmoTyped from "ammojs-typed";

    const Ammo: () => Promise<typeof AmmoTyped> & { default: typeof AmmoTyped };

    export default Ammo;
}
