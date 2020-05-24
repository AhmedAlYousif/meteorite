import { RouteNode, RequestMethods } from "./types/routes.ts";


export let RootNode: RouteNode = {children:{}, methods:{}};

export let TempPaths: {target:Object, key:string, path:string, function:any, method:RequestMethods}[] = [];