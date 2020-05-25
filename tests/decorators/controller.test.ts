import { assert, assertThrows } from '../package.test.ts';
import { Controller } from "../../src/decorators/decorators.ts";
import { RootNode } from '../../src/meteorStore.ts'

Deno.test({
    name: 'if (@Controller) decorated class has its path registered',
    fn: () => {
        class MyController { }
        Controller('/testPath')(MyController);
        assert(RootNode.children.hasOwnProperty('testPath'));
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Controller) decorated class has its path params registered',
    fn: () => {
        class MyController { }
        Controller('/testPath/:id')(MyController);
        assert(RootNode.children['testPath'].children.hasOwnProperty('_meteor:_param'));
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Controller) decorated class has its path params name saved',
    fn: () => {
        class MyController { }
        Controller('/testPath/:id')(MyController);
        assert(RootNode.children['testPath'].children['_meteor:_param'].paramName, 'id');
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Controller) decorated classes can have the same paths',
    fn: () => {
        class MyController { }
        const myController = new (Controller('/testPath/:id')(MyController));
        const myController1 = new (Controller('/testPath/:id')(MyController));
        assert(myController._meteorPath, myController1._meteorPath);
        _resetRootNode();
    }
});

Deno.test({
    name: 'if (@Controller) decorated classes can not have the same paths with different params names in the same location',
    fn: () => {
        class MyController { }
        Controller('/testPath/:id')(MyController);
        assertThrows(()=>{
            Controller('/testPath/:id1')(MyController);
        });
        _resetRootNode();
    }
});


function _resetRootNode() {
    RootNode.children = {};
    RootNode.methods = {};
}