import { Meteorite } from '../src/meteorite.ts';
import { MeteorServer } from '../src/decorators/decorators.ts';
import { Hello } from './helloController.ts';

@MeteorServer({
    address: { port: 8080 },
    controllers: [
        Hello
    ]
})
class MyServer { }

Meteorite.startServer(new MyServer());