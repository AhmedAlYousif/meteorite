


export type RequestMethods = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE';
export type ParamsTypes = 'PATH' | 'QUERY';

export type Param = {
    [paramName:string]:{type:ParamsTypes, index:number, required?:boolean}
}

type MethodTarget = {
    [method in RequestMethods]?:{target:Object, propertyKey:string, params:Param};
}

type Routes = {
    [path:string]:RouteNode;
}

export type RouteNode = {
    paramName?:string;
    methods:MethodTarget;
    children:Routes;
}