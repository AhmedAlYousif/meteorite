import { assert } from '../package.test.ts';
import { MeteorServer } from '../../src/decorators/decorators.ts';


Deno.test({
    name: 'if (@MeteorServer) decorated class has a server as property',
    fn: () => {
        class MyServer {}
        const myServer = new (MeteorServer({address: {port: 8080}})(MyServer));
        assert(myServer.hasOwnProperty('_meteorServerArgs'));
    }
});
