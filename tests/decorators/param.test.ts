import { assert, assertThrows, assertEquals } from '../package.test.ts';
import { Request, Controller, Param, PathParam, QueryParam } from '../../src/decorators/decorators.ts';
import { RootNode, TempPaths, TempParams } from '../../src/meteorStore.ts';

Deno.test({
    name: 'if (@Param) decorated property register a method param to get one path param',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        Param({param:{paramName:'id'}, type:'PATH'})(myController, 'getPath', 0);

        Request('/get/:id', 'GET')(myController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assertEquals(RootNode.children['testPath'].children['get'].children['_meteor:_param'].methods.GET?.params['id'].type, 'PATH');
        
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Param) decorated property register a method param to get one query param',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        Param({param:{paramName:'id'}, type:'QUERY'})(myController, 'getPath', 0);

        Request('/get/:id', 'GET')(myController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assertEquals(RootNode.children['testPath'].children['get'].children['_meteor:_param'].methods.GET?.params['id'].type, 'QUERY');
        
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Param) decorated property register a method param to get all path params',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        Param({type:'PATH'})(myController, 'getPath', 0);

        Request('/get/:id', 'GET')(myController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assertEquals(RootNode.children['testPath'].children['get'].children['_meteor:_param'].methods.GET?.params['_meteor:_all_param_path'].type, 'PATH');
        
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Param) decorated property register a method param to get all query params',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        Param({type:'QUERY'})(myController, 'getPath', 0);

        Request('/get/:id', 'GET')(myController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assertEquals(RootNode.children['testPath'].children['get'].children['_meteor:_param'].methods.GET?.params['_meteor:_all_param_query'].type, 'QUERY');
        
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Param) decorated property can not register non required method param to get one path param',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();

        assertThrows(() => Param({param:{paramName:'id', required:false}, type:'PATH'})(myController, 'getPath', 0));
        
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@PathParam) decorated property register a method param to get one path param',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        PathParam('id')(myController, 'getPath', 0);

        Request('/get/:id', 'GET')(myController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assertEquals(RootNode.children['testPath'].children['get'].children['_meteor:_param'].methods.GET?.params['id'].type, 'PATH');
        
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@PathParam) decorated property register a method param to get all path param',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        PathParam()(myController, 'getPath', 0);

        Request('/get/:id', 'GET')(myController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assertEquals(RootNode.children['testPath'].children['get'].children['_meteor:_param'].methods.GET?.params['_meteor:_all_param_path'].type, 'PATH');
        
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@QueryParam) decorated property register a method param to get one query param',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        QueryParam('id')(myController, 'getPath', 0);

        Request('/get/:id', 'GET')(myController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assertEquals(RootNode.children['testPath'].children['get'].children['_meteor:_param'].methods.GET?.params['id'].type, 'QUERY');
        
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@QueryParam) decorated property register a method param to get all query param',
    fn: () => {
        
        class MyController { getPath(pathParam:string){} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        QueryParam()(myController, 'getPath', 0);

        Request('/get/:id', 'GET')(myController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assertEquals(RootNode.children['testPath'].children['get'].children['_meteor:_param'].methods.GET?.params['_meteor:_all_param_query'].type, 'QUERY');
        
        _resetRootNode();
    }
});

function _resetRootNode() {
    RootNode.children = {};
    RootNode.methods = {};
    TempPaths.splice(0, TempPaths.length);
    TempParams.splice(0, TempParams.length);
}