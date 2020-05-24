import { assertEquals, assert, assertThrows } from '../../package.test.ts';
import { Controller } from "./controller.ts";
import { RootNode } from '../../meteorStore.ts'


Deno.test('if (@Controller) decorated class has a path as property', () => {
    @Controller('/testPath/:id')
    class MyController { }
    const myController = new MyController();
    assert(myController.hasOwnProperty('_meteorPath'));
});

Deno.test('if (@Controller) decorated class has its path registered', () => {
    @Controller('/testPath/:id')
    class MyController {}
    assert(RootNode.children.hasOwnProperty('testPath'));
});

Deno.test('if (@Controller) decorated class has its path params registered', () => {
    @Controller('/testPath/:id')
    class MyController { }
    assert(RootNode.children['testPath'].children.hasOwnProperty('_meteor:_param'));
});

Deno.test('if (@Controller) decorated class has its path params name saved', () => {
    @Controller('/testPath/:id')
    class MyController { }
    assertEquals(RootNode.children['testPath'].children['_meteor:_param'].paramName, 'id');
});

Deno.test('if (@Controller) decorated classes can have the same paths', () => {
    @Controller('/testPath/:id')
    class MyController { }
    @Controller('/testPath/:id')
    class test { }
});

Deno.test('if (@Controller) decorated classes can not have the same paths with different params names in the same location', () => {
    assertThrows(() => {
        @Controller('/testPath/:id')
        class MyController { }
        @Controller('/testPath/:wrongParam')
        class test { }
    });
});