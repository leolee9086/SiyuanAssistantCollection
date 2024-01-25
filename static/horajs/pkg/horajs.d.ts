/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_env(): void;
/**
*/
export class BruteForceIndexUsize {
  free(): void;
/**
* @param {string} s
* @returns {boolean}
*/
  build(s: string): boolean;
/**
* @param {Float32Array} vs
* @param {number} idx
* @returns {boolean}
*/
  add(vs: Float32Array, idx: number): boolean;
/**
* @returns {boolean}
*/
  clear(): boolean;
/**
* @returns {number}
*/
  size(): number;
/**
* @param {Float32Array} flat_vs
* @param {number} length
* @param {Uint32Array} idx
* @returns {boolean}
*/
  bulk_add(flat_vs: Float32Array, length: number, idx: Uint32Array): boolean;
/**
* @param {Float32Array} vs
* @param {number} k
* @returns {Uint32Array}
*/
  search(vs: Float32Array, k: number): Uint32Array;
/**
* @returns {string}
*/
  name(): string;
/**
* @returns {Uint8Array}
*/
  dump_index(): Uint8Array;
/**
* @param {Uint8Array} serialized
* @returns {BruteForceIndexUsize}
*/
  static load_index(serialized: Uint8Array): BruteForceIndexUsize;
/**
* @param {number} dimension
* @returns {BruteForceIndexUsize}
*/
  static new(dimension: number): BruteForceIndexUsize;
}
/**
*/
export class HNSWIndexUsize {
  free(): void;
/**
* @param {string} s
* @returns {boolean}
*/
  build(s: string): boolean;
/**
* @param {Float32Array} vs
* @param {number} idx
* @returns {boolean}
*/
  add(vs: Float32Array, idx: number): boolean;
/**
* @returns {boolean}
*/
  clear(): boolean;
/**
* @returns {number}
*/
  size(): number;
/**
* @param {Float32Array} flat_vs
* @param {number} length
* @param {Uint32Array} idx
* @returns {boolean}
*/
  bulk_add(flat_vs: Float32Array, length: number, idx: Uint32Array): boolean;
/**
* @param {Float32Array} vs
* @param {number} k
* @returns {Uint32Array}
*/
  search(vs: Float32Array, k: number): Uint32Array;
/**
* @returns {string}
*/
  name(): string;
/**
* @returns {Uint8Array}
*/
  dump_index(): Uint8Array;
/**
* @param {Uint8Array} serialized
* @returns {HNSWIndexUsize}
*/
  static load_index(serialized: Uint8Array): HNSWIndexUsize;
/**
* @param {number} dimension
* @param {number} max_item
* @param {number} n_neigh
* @param {number} n_neigh0
* @param {number} ef_build
* @param {number} ef_search
* @param {boolean} has_deletion
* @returns {HNSWIndexUsize}
*/
  static new(dimension: number, max_item: number, n_neigh: number, n_neigh0: number, ef_build: number, ef_search: number, has_deletion: boolean): HNSWIndexUsize;
}
/**
*/
export class IVFPQIndexUsize {
  free(): void;
/**
* @param {string} s
* @returns {boolean}
*/
  build(s: string): boolean;
/**
* @param {Float32Array} vs
* @param {number} idx
* @returns {boolean}
*/
  add(vs: Float32Array, idx: number): boolean;
/**
* @returns {boolean}
*/
  clear(): boolean;
/**
* @returns {number}
*/
  size(): number;
/**
* @param {Float32Array} flat_vs
* @param {number} length
* @param {Uint32Array} idx
* @returns {boolean}
*/
  bulk_add(flat_vs: Float32Array, length: number, idx: Uint32Array): boolean;
/**
* @param {Float32Array} vs
* @param {number} k
* @returns {Uint32Array}
*/
  search(vs: Float32Array, k: number): Uint32Array;
/**
* @returns {string}
*/
  name(): string;
/**
* @returns {Uint8Array}
*/
  dump_index(): Uint8Array;
/**
* @param {Uint8Array} serialized
* @returns {IVFPQIndexUsize}
*/
  static load_index(serialized: Uint8Array): IVFPQIndexUsize;
/**
* @param {number} dimension
* @param {number} n_sub
* @param {number} sub_bits
* @param {number} n_kmeans_center
* @param {number} search_n_center
* @param {number} train_epoch
* @returns {IVFPQIndexUsize}
*/
  static new(dimension: number, n_sub: number, sub_bits: number, n_kmeans_center: number, search_n_center: number, train_epoch: number): IVFPQIndexUsize;
}
/**
*/
export class PQIndexUsize {
  free(): void;
/**
* @param {string} s
* @returns {boolean}
*/
  build(s: string): boolean;
/**
* @param {Float32Array} vs
* @param {number} idx
* @returns {boolean}
*/
  add(vs: Float32Array, idx: number): boolean;
/**
* @returns {boolean}
*/
  clear(): boolean;
/**
* @returns {number}
*/
  size(): number;
/**
* @param {Float32Array} flat_vs
* @param {number} length
* @param {Uint32Array} idx
* @returns {boolean}
*/
  bulk_add(flat_vs: Float32Array, length: number, idx: Uint32Array): boolean;
/**
* @param {Float32Array} vs
* @param {number} k
* @returns {Uint32Array}
*/
  search(vs: Float32Array, k: number): Uint32Array;
/**
* @returns {string}
*/
  name(): string;
/**
* @returns {Uint8Array}
*/
  dump_index(): Uint8Array;
/**
* @param {Uint8Array} serialized
* @returns {PQIndexUsize}
*/
  static load_index(serialized: Uint8Array): PQIndexUsize;
/**
* @param {number} dimension
* @param {number} n_sub
* @param {number} sub_bits
* @param {number} train_epoch
* @returns {PQIndexUsize}
*/
  static new(dimension: number, n_sub: number, sub_bits: number, train_epoch: number): PQIndexUsize;
}
/**
*/
export class SSGIndexUsize {
  free(): void;
/**
* @param {string} s
* @returns {boolean}
*/
  build(s: string): boolean;
/**
* @param {Float32Array} vs
* @param {number} idx
* @returns {boolean}
*/
  add(vs: Float32Array, idx: number): boolean;
/**
* @returns {boolean}
*/
  clear(): boolean;
/**
* @returns {number}
*/
  size(): number;
/**
* @param {Float32Array} flat_vs
* @param {number} length
* @param {Uint32Array} idx
* @returns {boolean}
*/
  bulk_add(flat_vs: Float32Array, length: number, idx: Uint32Array): boolean;
/**
* @param {Float32Array} vs
* @param {number} k
* @returns {Uint32Array}
*/
  search(vs: Float32Array, k: number): Uint32Array;
/**
* @returns {string}
*/
  name(): string;
/**
* @returns {Uint8Array}
*/
  dump_index(): Uint8Array;
/**
* @param {Uint8Array} serialized
* @returns {SSGIndexUsize}
*/
  static load_index(serialized: Uint8Array): SSGIndexUsize;
/**
* @param {number} dimension
* @param {number} neighbor_neighbor_size
* @param {number} init_k
* @param {number} index_size
* @param {number} angle
* @param {number} root_size
* @returns {SSGIndexUsize}
*/
  static new(dimension: number, neighbor_neighbor_size: number, init_k: number, index_size: number, angle: number, root_size: number): SSGIndexUsize;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly __wbg_bruteforceindexusize_free: (a: number) => void;
  readonly bruteforceindexusize_build: (a: number, b: number, c: number) => number;
  readonly bruteforceindexusize_add: (a: number, b: number, c: number, d: number) => number;
  readonly bruteforceindexusize_clear: (a: number) => number;
  readonly bruteforceindexusize_size: (a: number) => number;
  readonly bruteforceindexusize_bulk_add: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly bruteforceindexusize_search: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly bruteforceindexusize_name: (a: number, b: number) => void;
  readonly bruteforceindexusize_dump_index: (a: number, b: number) => void;
  readonly bruteforceindexusize_load_index: (a: number, b: number) => number;
  readonly bruteforceindexusize_new: (a: number) => number;
  readonly __wbg_hnswindexusize_free: (a: number) => void;
  readonly hnswindexusize_build: (a: number, b: number, c: number) => number;
  readonly hnswindexusize_add: (a: number, b: number, c: number, d: number) => number;
  readonly hnswindexusize_bulk_add: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly hnswindexusize_search: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly hnswindexusize_name: (a: number, b: number) => void;
  readonly hnswindexusize_dump_index: (a: number, b: number) => void;
  readonly hnswindexusize_load_index: (a: number, b: number) => number;
  readonly hnswindexusize_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly __wbg_pqindexusize_free: (a: number) => void;
  readonly pqindexusize_build: (a: number, b: number, c: number) => number;
  readonly pqindexusize_add: (a: number, b: number, c: number, d: number) => number;
  readonly pqindexusize_bulk_add: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly pqindexusize_search: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly pqindexusize_name: (a: number, b: number) => void;
  readonly pqindexusize_dump_index: (a: number, b: number) => void;
  readonly pqindexusize_load_index: (a: number, b: number) => number;
  readonly pqindexusize_new: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_ivfpqindexusize_free: (a: number) => void;
  readonly ivfpqindexusize_build: (a: number, b: number, c: number) => number;
  readonly ivfpqindexusize_add: (a: number, b: number, c: number, d: number) => number;
  readonly ivfpqindexusize_bulk_add: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly ivfpqindexusize_search: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly ivfpqindexusize_name: (a: number, b: number) => void;
  readonly ivfpqindexusize_dump_index: (a: number, b: number) => void;
  readonly ivfpqindexusize_load_index: (a: number, b: number) => number;
  readonly ivfpqindexusize_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly __wbg_ssgindexusize_free: (a: number) => void;
  readonly ssgindexusize_build: (a: number, b: number, c: number) => number;
  readonly ssgindexusize_add: (a: number, b: number, c: number, d: number) => number;
  readonly ssgindexusize_size: (a: number) => number;
  readonly ssgindexusize_bulk_add: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly ssgindexusize_search: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly ssgindexusize_name: (a: number, b: number) => void;
  readonly ssgindexusize_dump_index: (a: number, b: number) => void;
  readonly ssgindexusize_load_index: (a: number, b: number) => number;
  readonly ssgindexusize_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly init_env: () => void;
  readonly hnswindexusize_clear: (a: number) => number;
  readonly hnswindexusize_size: (a: number) => number;
  readonly pqindexusize_clear: (a: number) => number;
  readonly pqindexusize_size: (a: number) => number;
  readonly ivfpqindexusize_clear: (a: number) => number;
  readonly ivfpqindexusize_size: (a: number) => number;
  readonly ssgindexusize_clear: (a: number) => number;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_thread_destroy: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
