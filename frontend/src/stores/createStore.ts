// src/stores/createStore.ts
import { defineStore } from 'pinia';
import { ref, type Ref, computed } from 'vue';
import _ from 'lodash';

type StateMap<T extends Record<string, any>> = {
  [K in keyof T]: Ref<T[K]>;
};

type SetterMap<T extends Record<string, any>> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type GeneratedStore<T extends Record<string, any>> = StateMap<T> & SetterMap<T>;

type LooseStore = Record<string, any>; 

export function createStore<T extends Record<string, any>>(
  id: string,
  defaults: T,
) {
  return defineStore(id, () => {
    const keys = Object.keys(defaults) as (keyof T)[];
    const stateRefsMap: LooseStore = {};
    const finalStore = keys.reduce(
      (acc: LooseStore, key) => {
        const stateRef = ref(defaults[key]) as Ref<T[typeof key]>;
        stateRefsMap[key as string] = stateRef;
        acc[key as string] = computed(() => stateRef.value);

        const capitalizedKey = _.upperFirst(key as string);
        const setterName = `set${capitalizedKey}`;
        
        acc[setterName] = (value: T[typeof key]) => {
          stateRef.value = value;
        };
        return acc;
      }, 
      {} as LooseStore
    );

    return finalStore as GeneratedStore<T>;
  });
}
