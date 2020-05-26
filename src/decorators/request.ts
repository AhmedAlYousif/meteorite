import { RequestMethods, Param } from '../types/routes.ts';
import { TempPaths, TempParams } from '../meteorStore.ts'

export function Request(path: string, method: RequestMethods) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        let doneIndexes: number[] = [];
        let thisParams: Param = {};
        TempParams.forEach((tempParam, i) => {
            if (tempParam.target == target, tempParam.key == propertyKey) {
                thisParams[tempParam.paramName] = {type: tempParam.type, index: tempParam.index, required: tempParam.required}
                doneIndexes.push(i);
            }
        });
        doneIndexes.reverse().forEach((i) => TempParams.splice(i, 1));
        TempPaths.push({ target: target, key: propertyKey, path: path, function: descriptor.value, method: method, params:thisParams });
    };
}

export const GetRequest = (path: string) => Request(path, 'GET');
export const PostRequest = (path: string) => Request(path, 'POST');
export const DeleteRequest = (path: string) => Request(path, 'DELETE');
export const PutRequest = (path: string) => Request(path, 'PUT');

