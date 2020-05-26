import { assert, assertThrowsAsync, encode } from './package.test.ts';
import { MeteorServer, Param } from '../src/decorators/decorators.ts';
import { Meteorite } from '../src/meteorite.ts';
import { Request, Controller } from '../src/decorators/decorators.ts';
import { RootNode, TempPaths, TempParams } from '../src/meteorStore.ts';
import { ServerRequest } from '../src/package.ts'

const ignore = false;

Deno.test({
    name: 'if startServer method will start a deno server',
    fn: () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));
        Meteorite.startServer(myServer, false);
        assert(Meteorite.server !== undefined);
        Meteorite.server.close();
    }, ignore: ignore
});

Deno.test({
    name: 'if startServer method will throw error when the givin object is not decorated with @MeteorServer',
    fn: () => {
        assertThrowsAsync(async () => {
            await Meteorite.startServer({}, false);
        });
    }, ignore: ignore
});


Deno.test({
    name: 'if server will responde with 404 on unknown paths',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));
        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        assert(nread !== null);
        const resStr = new TextDecoder().decode(res.subarray(0, nread));
        assert(resStr.includes('404 Not Found'));
        Meteorite.server.close();
        conn.close();
    }, ignore: ignore
});

Deno.test({
    name: 'if server will responde with 405 on unknown methods',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));

        class MyController { subPath(){} }
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        Request('/hello', 'POST')(MyController, 'subPath', descriptor);

        Controller('')(MyController);

        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        assert(nread !== null);
        const resStr = new TextDecoder().decode(res.subarray(0, nread));
        assert(resStr.includes('405 Method Not Allowed'));
        Meteorite.server.close();
        conn.close();
        _resetRootNode();
    }, ignore: ignore
});

Deno.test({
    name: 'if server will responde with 500 when the request handler throws an error',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));

        class MyController { subPath(req:any){throw 'test';} }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        Request('/hello', 'GET')(myController, 'subPath', descriptor);

        Controller('')(MyController);

        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        const resStr = new TextDecoder().decode(res.subarray(0, nread || 0));
        assert(resStr.includes('500 Internal Server Error'));
        Meteorite.server.close();
        conn.close();
        _resetRootNode();
    }, ignore: ignore
});

Deno.test({
    name: 'if server will responde with the request handler response',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));

        class MyController {
            subPath(req:ServerRequest){
                req.respond({status: 200, body: 'hello tester'});
            }
        }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        Request('/hello', 'GET')(myController, 'subPath', descriptor);

        Controller('')(MyController);

        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        const resStr = new TextDecoder().decode(res.subarray(0, nread || 0));
        assert(resStr.includes('HTTP/1.1 200 OK'));
        assert(resStr.includes('hello tester'));
        Meteorite.server.close();
        conn.close();
        _resetRootNode();
    }, ignore: ignore
});

Deno.test({
    name: 'if server will pass path params to the request handler',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));

        class MyController {
            subPath(name:string){
                return `hello ${name}`;
            }
        }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        Param({param:{paramName:'name'}, type:'PATH'})(myController, 'subPath', 0);

        Request('/hello/:name', 'GET')(myController, 'subPath', descriptor);

        Controller('')(MyController);

        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello/tester HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        const resStr = new TextDecoder().decode(res.subarray(0, nread || 0));
        assert(resStr.includes('HTTP/1.1 200 OK'));
        assert(resStr.includes('hello tester'));
        Meteorite.server.close();
        conn.close();
        _resetRootNode();
    }, ignore: ignore
});

Deno.test({
    name: 'if server will pass two path params to the request handler',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));

        class MyController {
            subPath(greating:string,name:string){
                return `${greating} ${name}`;
            }
        }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        Param({param:{paramName:'greating'}, type:'PATH'})(myController, 'subPath', 0);
        Param({param:{paramName:'name'}, type:'PATH'})(myController, 'subPath', 1);

        Request('/:greating/:name', 'GET')(myController, 'subPath', descriptor);

        Controller('')(MyController);

        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello/tester HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        const resStr = new TextDecoder().decode(res.subarray(0, nread || 0));
        assert(resStr.includes('HTTP/1.1 200 OK'));
        assert(resStr.includes('hello tester'));
        Meteorite.server.close();
        conn.close();
        _resetRootNode();
    }, ignore: ignore
});

Deno.test({
    name: 'if server will pass all path params to the request handler',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));

        class MyController {
            subPath(pathParam:any){
                return `${pathParam['greating']} ${pathParam['name']}`;
            }
        }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        Param({type:'PATH'})(myController, 'subPath', 0);

        Request('/:greating/:name', 'GET')(myController, 'subPath', descriptor);

        Controller('')(MyController);

        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello/tester HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        const resStr = new TextDecoder().decode(res.subarray(0, nread || 0));
        assert(resStr.includes('HTTP/1.1 200 OK'));
        assert(resStr.includes('hello tester'));
        Meteorite.server.close();
        conn.close();
        _resetRootNode();
    }, ignore: ignore
});

Deno.test({
    name: 'if server will pass query params to the request handler',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));

        class MyController {
            subPath(name:string){
                return `hello ${name}`;
            }
        }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        Param({param:{paramName:'name'}, type:'QUERY'})(myController, 'subPath', 0);

        Request('/hello', 'GET')(myController, 'subPath', descriptor);

        Controller('')(MyController);

        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello?name=tester HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        const resStr = new TextDecoder().decode(res.subarray(0, nread || 0));
        assert(resStr.includes('HTTP/1.1 200 OK'));
        assert(resStr.includes('hello tester'));
        Meteorite.server.close();
        conn.close();
        _resetRootNode();
    }, ignore: ignore
});

Deno.test({
    name: 'if server will pass all path params and all query to the request handler',
    fn: async () => {
        class MyServer { }
        const myServer = new (MeteorServer({ address: { port: 8123 } })(MyServer));

        class MyController {
            subPath(pathParam:any, queryParams:any){
                return `${pathParam['greating']} ${queryParams['name']}`;
            }
        }
        const myController = new MyController();
        const descriptor:PropertyDescriptor = {value: MyController.prototype.subPath};

        Param({type:'PATH'})(myController, 'subPath', 0);
        Param({type:'QUERY'})(myController, 'subPath', 1);

        Request('/:greating', 'GET')(myController, 'subPath', descriptor);

        Controller('')(MyController);

        Meteorite.startServer(myServer, false);

        const conn = await Deno.connect({
            hostname: "127.0.0.1",
            port: 8123,
        });
        await Deno.writeAll(
            conn,
            encode("GET /hello?name=tester HTTP/1.1\r\n\r\n")
        );
        const res = new Uint8Array(100);
        const nread = await conn.read(res);
        const resStr = new TextDecoder().decode(res.subarray(0, nread || 0));
        assert(resStr.includes('HTTP/1.1 200 OK'));
        assert(resStr.includes('hello tester'));
        Meteorite.server.close();
        conn.close();
        _resetRootNode();
    }, ignore: ignore
});

function _resetRootNode() {
    RootNode.children = {};
    RootNode.methods = {};
    TempPaths.splice(0, TempPaths.length);
    TempParams.splice(0, TempParams.length);
}