


export type RequestMethods = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE';

type MethodTarget = {
    [method in RequestMethods]?:{target:Object, propertyKey:string};
}

type Routes = {
    [path:string]:RouteNode;
}

export type RouteNode = {
    paramName?:string;
    methods:MethodTarget;
    children:Routes;
}