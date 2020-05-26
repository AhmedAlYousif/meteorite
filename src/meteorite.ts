import { serve, Server, Response } from './package.ts';
import { RequestMethods, } from "./types/routes.ts";
import { RootNode, TempPaths } from './meteorStore.ts'
import { MeteorServerArgs } from './types/meteorServerOptions.ts'


export * as decorators from './decorators/decorators.ts'

export module Meteorite {

    export let server: Server;

    export async function startServer(target: Object, showBanner?: boolean) {
        if (showBanner == undefined || showBanner) console.log(banner);
        if (TempPaths.length > 0) {
            console.warn(`warning: there are functions [${TempPaths.map(path => path.key).toString()}] decorated with (@Request) but not in a controller class.`);
        }
        if (target.hasOwnProperty("_meteorServerArgs")) {
            const serverOptions: MeteorServerArgs = Object.getOwnPropertyDescriptor(target, "_meteorServerArgs")?.value;
            server = serve(serverOptions.address || { port: 8080 });
            const host = Object.getOwnPropertyDescriptor(server.listener.addr, 'hostname')?.value + ':' + Object.getOwnPropertyDescriptor(server.listener.addr, 'port')?.value;
            console.log(`starting on ${host}`);
            for await (const req of server) {
                let done = false;
                const path = req.url.split('?')[0];
                const queryParamStr = req.url.split('?')[1];
                const method: RequestMethods = req.method.toUpperCase() as RequestMethods;
                const pathSegments = path.split('/');
                pathSegments.splice(0, 1);


                let queryParam = _getQueryParams(queryParamStr);
                let pathParams: { [key: string]: string } = {};

                let node = RootNode;
                pathSegments.forEach(segment => {
                    if (node.children.hasOwnProperty(segment)) {
                        node = node.children[segment];
                    } else if (node.children.hasOwnProperty('_meteor:_param')) {
                        node = node.children['_meteor:_param'];
                        if (node.paramName !== undefined) {
                            pathParams[node.paramName] = segment;
                        }
                    } else {
                        req.respond({ status: 404, body: `can not find request path: ${path}` });
                        done = true;
                    }
                });

                if (done) continue;
                const methodTarget = node.methods[method];
                if (methodTarget !== undefined) {
                    let object = Object.create(methodTarget.target);
                    try {
                        let params: any[] = [];
                        if (methodTarget.params.hasOwnProperty('_meteor:_all_param_path')) {
                            params[methodTarget.params['_meteor:_all_param_path'].index] = pathParams;
                        }
                        if (methodTarget.params.hasOwnProperty('_meteor:_all_param_query')) {
                            params[methodTarget.params['_meteor:_all_param_query'].index] = queryParam;
                        }
                        Object.keys(methodTarget.params).forEach(param => {
                            if (param != '_meteor:_all_param_path' && param != '_meteor:_all_param_query') {
                                if (pathParams[param] != null && methodTarget.params[param].type == 'PATH') {
                                    params[methodTarget.params[param].index] = pathParams[param];
                                }else if(queryParam != null && queryParam[param] != null  && methodTarget.params[param].type == 'QUERY'){
                                    params[methodTarget.params[param].index] = queryParam[param];
                                } else if (methodTarget.params[param].required == undefined || methodTarget.params[param].required) {
                                    req.respond({ status: 400, body: `missing required ${methodTarget.params[param].type.toLowerCase()} param ${param}` });
                                    done = true;
                                }
                            }
                        });
                        if (done) continue;
                        if (params.length > 0) {
                            const resValue = object[methodTarget.propertyKey](...params);
                            if (isInstanceOfResponse(resValue)) {
                                req.respond(resValue);
                            } else if(isInstanceOfBody(resValue)) {
                                req.respond({ status: 200, body: resValue });
                            } else throw `Handler ${methodTarget.propertyKey} did not return vaild response`
                        } else {
                            object[methodTarget.propertyKey](req);
                        }
                        // req.respond({ status: 204 });
                    } catch (error) {
                        req.respond({ status: 500, body: error.toString() });
                        done = true;
                    }
                } else {
                    req.respond({ status: 405, body: `${method} is not allowed when requesting ${path}` });
                }
            }
        } else {
            throw 'MeteoriteException: the target object is not decorated with @MeteorServer';
        }
    }

    function _getQueryParams(queryParam: string) {
        if (queryParam !== undefined) {
            const segments = queryParam.split('&');
            let params: { [key: string]: string } = {};
            segments.map(segment => params[segment.split('=')[0]] = (segment.split('=')[1] || ''));
            return params;
        }
    }

    function isInstanceOfResponse(object: any): object is Response {
        return object.hasOwnProperty('headers') || (object.hasOwnProperty('body') && isInstanceOfBody(object.body)) || object.hasOwnProperty('trailers') || object.hasOwnProperty('status');
    }
    function isInstanceOfBody (object:any):boolean{
        return typeof object == typeof '' || object instanceof Uint8Array || object.hasOwnProperty('read');
    }
}

const banner = `
\\  \\  \\  \\    \\  \\  
\\   \\    _____  \\
\\   \\ .-'  (_)'-.
\\   .'   _       '.
\\  /    (_)   _    \\
  ;  _       (_)  _ ;
  | (_)   _      (_)|
  ;   _  (_)        ;
   \\ (_)       _   /
    '.     _  (_).'
      '-._(_)_.-'
 __  __        _                      _  _        
|  \\/  |      | | by Ahmed Al Yousif (_)| |       
| \\  / |  ___ | |_  ___   ___   _ __  _ | |_  ___ 
| |\\/| | / _ \\| __|/ _ \\ / _ \\ | '__|| || __|/ _ \\
| |  | ||  __/| |_|  __/| (_) || |   | || |_|  __/
|_|  |_| \\___| \\__|\\___| \\___/ |_|   |_| \\__|\\___|
`;

