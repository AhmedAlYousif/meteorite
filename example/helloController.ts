import { Controller, Request, GetRequest, PathParam, QueryParam } from "../src/decorators/decorators.ts";
import { ServerRequest } from "https://deno.land/std@0.53.0/http/server.ts";


@Controller('/greetings')
export class Hello {

    @Request('/hello', 'GET')
    myReqeust(req: ServerRequest){
        req.respond({body: 'hi'});
    }

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

    @GetRequest('/:greeting/:name')
    greetWithName(
        @PathParam('greeting') greeting:string,
        @PathParam('name') name:string
    ){
        return {status: 418, body:`${greeting} ${name}!`};
    }
}
