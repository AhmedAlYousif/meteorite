import { assert, assertThrows, assertEquals } from '../package.test.ts';
import { Request, Controller, GetRequest, PostRequest, DeleteRequest, PutRequest } from '../../src/decorators/decorators.ts';
import { RootNode, TempPaths } from '../../src/meteorStore.ts';

Deno.test({
    name: 'if (@Request) decorated method has its path registered under the class path',
    fn: () => {
        class MyController { getPath(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        Request('/get', 'GET')(MyController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assert(RootNode.children['testPath'].children.hasOwnProperty('get'));
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Request) decorator can save different request methods for the same path',
    fn: () => {
        class MyController { getPath(){} postPath(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};
        const descriptor1:PropertyDescriptor = {value: MyController.prototype.postPath};

        Request('/subPath', 'GET')(MyController, 'getPath', descriptor);
        Request('/subPath', 'POST')(MyController, 'postPath', descriptor1);

        Controller('/testPath')(MyController);

        assert(RootNode.children['testPath'].children['subPath'].methods.hasOwnProperty('GET'));
        assert(RootNode.children['testPath'].children['subPath'].methods.hasOwnProperty('POST'));
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Request) decorator can not save a request method for the same path more than one time',
    fn: () => {
        class MyController { subPath(){} subPath1(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};
        const descriptor1:PropertyDescriptor = {value: MyController.prototype.subPath1};

        Request('/subPath', 'POST')(MyController, 'subPath', descriptor);
        Request('/subPath', 'POST')(MyController, 'subPath1', descriptor1);

        assertThrows(()=>{
            Controller('/testPath')(MyController);
        });

        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Request) decorator can save different request methods for the same path and clean temp store',
    fn: () => {
        class MyController { subPath(){} subPath1(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};
        const descriptor1:PropertyDescriptor = {value: MyController.prototype.subPath1};

        Request('/getPath', 'GET')(MyController, 'subPath', descriptor);
        Request('/postPath', 'POST')(MyController, 'subPath1', descriptor1);

        Controller('/testPath')(MyController);
        assertEquals(TempPaths.length, 0);

        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Request) decorated method saves a givin method',
    fn: () => {
        class MyController { getPath(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.getPath};

        Request('/get', 'GET')(MyController, 'getPath', descriptor);

        Controller('/testPath')(MyController);

        assert(RootNode.children['testPath'].children['get'].methods.hasOwnProperty('GET'));
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@GetRequest) decorated method saves a GET method',
    fn: () => {
        class MyController { subPath(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        GetRequest('/subPath')(MyController, 'subPath', descriptor);

        Controller('/testPath')(MyController);

        assert(RootNode.children['testPath'].children['subPath'].methods.hasOwnProperty('GET'));
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@PostRequest) decorated method saves a POST method',
    fn: () => {
        class MyController { subPath(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        PostRequest('/subPath')(MyController, 'subPath', descriptor);

        Controller('/testPath')(MyController);

        assert(RootNode.children['testPath'].children['subPath'].methods.hasOwnProperty('POST'));
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@PutRequest) decorated method saves a PUT method',
    fn: () => {
        class MyController { subPath(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        PutRequest('/subPath')(MyController, 'subPath', descriptor);

        Controller('/testPath')(MyController);

        assert(RootNode.children['testPath'].children['subPath'].methods.hasOwnProperty('PUT'));
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@DeleteRequest) decorated method saves a DELETE method',
    fn: () => {
        class MyController { subPath(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        DeleteRequest('/subPath')(MyController, 'subPath', descriptor);

        Controller('/testPath')(MyController);

        assert(RootNode.children['testPath'].children['subPath'].methods.hasOwnProperty('DELETE'));
        _resetRootNode();
    }
});

function _resetRootNode() {
    RootNode.children = {};
    RootNode.methods = {};
    TempPaths.splice(0, TempPaths.length);
}