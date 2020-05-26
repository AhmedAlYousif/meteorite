import { RouteNode, RequestMethods, Param } from '../types/routes.ts';
import { RootNode, TempPaths } from '../meteorStore.ts'

export function Controller(path: string) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        let node = RootNode;
        node = saveSegmentsOfPath(path, node);
        let doneIndexes: number[] = [];
        TempPaths.forEach((tempPath, i) => {
            if (constructor.prototype.hasOwnProperty(tempPath.key) && constructor.prototype[tempPath.key] == tempPath.function) {
                saveSegmentsOfPath(tempPath.path, node, { target: tempPath.target, key: tempPath.key, method: tempPath.method, params:tempPath.params });
                doneIndexes.push(i);
            }
        });
        doneIndexes.reverse().forEach((i) => TempPaths.splice(i, 1));
        return class extends constructor {
            _meteorPath = path;
        }
    }
}

function saveSegmentsOfPath(path: string, node: RouteNode, targetInfo?: { target: Object, key: string, method: RequestMethods, params:Param }) {
    const pathSegments = path.split('/');
    if (path.startsWith('/')) {
        pathSegments.splice(0, 1);
    }
    pathSegments.forEach((segment) => {
        if (segment.length != 0) {
            if (segment.startsWith(':')) {
                segment = segment.replace(':', '');
                if (!node.children.hasOwnProperty('_meteor:_param')) {
                    node.children['_meteor:_param'] = { children: {}, paramName: segment, methods: {} };
                } else {
                    if (segment !== node.children['_meteor:_param'].paramName) {
                        throw `MeteoriteException: can not have different params (${node.children['_meteor:_param'].paramName}, ${segment}) at the same path position. This is unsupport: /foo/:id , /foo/:name`;
                    }
                }
                node = node.children['_meteor:_param'];
            } else {
                if (!node.children.hasOwnProperty(segment)) {
                    node.children[segment] = { children: {}, methods: {} };
                }
                node = node.children[segment];
            }
        }
    });
    if (targetInfo != undefined) {
        if (node.methods[targetInfo.method] === undefined) {
            node.methods[targetInfo.method] = { target: targetInfo.target, propertyKey: targetInfo.key, params: targetInfo.params };
        } else {
            throw `MeteoriteException: can not have use the same route for more than one function for each http request method. [${targetInfo.method}] is used for multiple functions on the same request path`;
        }
    }
    return node;
}




