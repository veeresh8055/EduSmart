import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useModuleStores = create(
    devtools(
        (set)=>({
            module:null,
            setModule:(moduleData)=>set({module:moduleData}),
            clearModule:()=>set({module:null})
        }),
        {name:'ModuleStore'}
    )
)