import * as horaJs from "./pkg/horajs.js";
import { InitInput } from "./pkg/horajs.js";
export type HoraJsType = typeof horaJs;
export declare const getHora: (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory) => Promise<HoraJsType>;
export default getHora;
