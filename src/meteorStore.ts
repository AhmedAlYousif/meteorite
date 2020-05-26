import { RouteNode, RequestMethods, ParamsTypes, Param } from "./types/routes.ts";


export let RootNode: RouteNode = {children:{}, methods:{}};

export let TempPaths: {target:Object, key:string, path:string, function:any, method:RequestMethods, params:Param}[] = [];

export let TempParams: {paramName:string, target:Object, key:string, index:number, type:ParamsTypes, required?:boolean}[] = [];

