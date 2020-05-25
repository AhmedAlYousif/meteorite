
[![test](https://github.com/AhmedAlYousif/meteorite/workflows/test/badge.svg)](https://github.com/AhmedAlYousif/meteorite/actions?query=workflow%3Atest)

# Meteorite
### A framework to build REST APIs in [Deno](https://deno.land/) runtime.

## Example

`myServer.ts`
```typescript
import { Meteorite } from 'https://deno.land/x/meteorite@vx.x.x/src/meteorite.ts';
import { MeteorServer } from 'https://deno.land/x/meteorite@vx.x.x/src/decorators/decorators.ts';
import { Hello } from './helloController.ts';

@MeteorServer({
    address: { port: 8080 },
    controllers: [
        Hello
    ]
})
class MyServer { }

//start the server
Meteorite.startServer(new MyServer());
```

`helloController.ts`
```typescript
import { Controller, Request } from "https://deno.land/x/meteorite@vx.x.x/src/decorators/decorators.ts";
import { ServerRequest } from "https://deno.land/x/meteorite@vx.x.x/src/package.ts";

@Controller('')
export class Hello {

    @GetRequest('/hello')
    myReqeust(req: ServerRequest){
        req.respond({body: 'hi'});
    }
}
```

`tsconfig.json`
```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### run
`deno run --allow-net -c tsconfig.json myServer.ts`

Then try the browser `http://localhost:8080/hello`



## TODO

### Decorators:
-   [x] `@MeteorServer`
-   [x] `@Controller`
-   [x] `@Request` [`@GetRequest`, `@PostRequest`, `@DeleteRequest`, `@PutRequest`]
-   [ ] `@ServerRequst`
-   [ ] `@PathParam`
-   [ ] `@QueryParam`
-   [ ] `@Body`
-   [ ] `@Header`
-   [ ] `@Accepts`
