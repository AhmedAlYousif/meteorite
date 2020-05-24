import { assert, assertThrows } from '../../package.test.ts';
import { Request } from "./request.ts";
import { Controller } from "../controller/controller.ts";
import { RootNode, TempPaths } from '../../meteorStore.ts'


Deno.test('if (@Request) decorated method has its path registered under the class path', () => {
    @Controller('/testPath')
    class MyController {
        @Request('/getPath', 'GET')
        getPath(){}
    }
    assert(RootNode.children['testPath'].children.hasOwnProperty('getPath'));
});

Deno.test('if (@Request) decorated method saves the method', () => {
    @Controller('/testPath')
    class MyController {
        @Request('/getPath1', 'GET')
        getPath(){}
    }
    assert(RootNode.children['testPath'].children['getPath1'].methods.hasOwnProperty('GET'));
});

Deno.test('if (@Request) decorator can save different request methods for the same path', () => {
    @Controller('/testPath')
    class MyController {
        @Request('/path2', 'PUT')
        putPath(){}
        @Request('/path2', 'POST')
        postPath(){}
    }
    assert(RootNode.children['testPath'].children['path2'].methods.hasOwnProperty('PUT'));
    assert(RootNode.children['testPath'].children['path2'].methods.hasOwnProperty('POST'));
});

Deno.test('if (@Request) decorator can not save a request method for the same path more than one time', () => {
    assertThrows(() => {
        @Controller('/testPath')
        class MyController {
            @Request('/path3', 'POST')
            postPath(){}
            @Request('/path3', 'POST')
            postPath1(){}
        }
    });
});

Deno.test('if (@Request) decorator can save different request methods for the same path and clean temp store', () => {
    @Controller('/testPath')
    class MyController1 {
        @Request('/path4', 'PUT')
        putPath(){}
        @Request('/path4', 'POST')
        postPath(){}
    }
    assert(TempPaths.every(tempPath => !(tempPath.target instanceof MyController1)));
});