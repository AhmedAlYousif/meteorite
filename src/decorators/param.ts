import { TempParams } from '../meteorStore.ts';
import { ParamsTypes } from '../types/routes.ts';

export function Param(args:{param?:{paramName?:string, required?:boolean}, type:ParamsTypes}){
    return function(target: Object, propertyName: string, index: number){
        if(args.type == 'PATH' && args.param != null && args.param.required == false){
            throw `MeteoriteException: path param ${args.param.paramName} must be required`
        }
        TempParams.push({
            paramName: args.param?.paramName || `_meteor:_all_param_${args.type.toLowerCase()}`,
            target:target,
            key:propertyName,
            index: index,
            type: args.type,
            required: args.param?.required
        });
    }
}


export const PathParam = (paramName?:string) => Param({param:{paramName:paramName, required:true}, type:'PATH'})
export const QueryParam = (paramName?:string, required?:boolean) => Param({param:{paramName:paramName, required:required}, type:'QUERY'})