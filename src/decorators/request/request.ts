import { RequestMethods } from '../../types/routes.ts';
import { TempPaths } from '../../meteorStore.ts'

export function Request(path: string, method:RequestMethods) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        TempPaths.push({target:target, key:propertyKey, path:path, function: descriptor.value, method:method});
    };
}

export const GetRequest = (path: string) => Request(path, 'GET');
export const PostRequest = (path: string) => Request(path, 'POST');
export const DeleteRequest = (path: string) => Request(path, 'DELETE');
export const PutRequest = (path: string) => Request(path, 'PUT');

