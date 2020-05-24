import { assert } from '../../package.test.ts';
import { MeteorServer} from './meteorServer.ts';
import { Server } from '../../package.ts';


Deno.test('if (@MeteorServer) decorated class has a server as property', () => {
    @MeteorServer({address: {port: 8080}})
    class MyServer { }
    const server:any = new MyServer();
    assert(server.hasOwnProperty('_meteorServer'));
    (server['_meteorServer'] as Server).close();
});

Deno.test('if (@MeteorServer) decorated class has a server as property of Server type', () => {
    @MeteorServer({address: {port: 8080}})
    class MyServer { }
    const server:any = new MyServer();
    assert(server['_meteorServer'] instanceof Server);
    (server['_meteorServer'] as Server).close();
});