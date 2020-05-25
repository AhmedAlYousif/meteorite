import { MeteorServerArgs } from '../types/meteorServerOptions.ts'

export function MeteorServer(args:MeteorServerArgs) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class extends constructor {            
            _meteorServerArgs = args;
        }
    }
}