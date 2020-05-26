
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
### Handle request using `ServerRequest`:
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
### Handle request using `@PathParam` or `@QueryParam`:
`helloController.ts`
```typescript
import { Controller, Request } from "https://deno.land/x/meteorite@vx.x.x/src/decorators/decorators.ts";
import { ServerRequest } from "https://deno.land/x/meteorite@vx.x.x/src/package.ts";

@Controller('')
export class Hello {

    @GetRequest('/:greeting')
    greet(
        @PathParam('greeting') greeting:string,
        @QueryParam('name', false) name:string
    ){
        if(name == null){
            return `${greeting} there!`;
        } else {
            return `${greeting} ${name}!`;
        }
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


## More on `@Param`, `@PathParam` & `@QueryParam`

### Get all path param or query params
```typescript
  method(@Param(type:'PATH') pathParams:any){

  }
  //or
  method(@PathParam() pathParams:any){
    
  }
```
so if you have `/path/:param/:id`
you will can get the path param values like:
`pathParam.param` & `pathParam.id`

You can do the same for the query params:
```typescript
  method(@Param(type:'QUERY') queryParams:any){

  }
  //or
  method(@QueryParam() queryParams:any){
    
  }
```

### Get one param
```typescript
  method(@Param({param:{paramName:'id'}, type:'PATH'}) id:string){

  }
  //or
  method(@PathParam('id') id:string){
    
  }

  //this will throw error. path params can not be not required
  method(@Param({param:{paramName:'id', required:false}, type:'PATH'}) id:string){

  }
```

```typescript
  method(@Param({param:{paramName:'id'}, type:'QUERY'}) id:string){

  }
  //or
  method(@QueryParam('id') id:string){
    
  }

  //not required
  method(@Param({param:{paramName:'id', required:false}, type:'QUERY'}) id:string){

  }
  //or
  method(@QueryParam('id', false) id:string){
    
  }
```

if the method is using one of those decorators to handle the request it should return the required body where  `body: Uint8Array | Reader | string` or an object of type [`Response`](https://deno.land/std/http/server.ts#L350);

if the handler only return the body, the status code will always be `200` as long as there is no error.

## TODO

### Decorators:
-   [x] `@MeteorServer`
-   [x] `@Controller`
-   [x] `@Request` [`@GetRequest`, `@PostRequest`, `@DeleteRequest`, `@PutRequest`]
-   [x] `@Param` [`@PathParam`, `@QueryParam`]
-   [ ] `@ServerRequst`
-   [ ] `@Body`
-   [ ] `@Header`
-   [ ] `@Accepts`
