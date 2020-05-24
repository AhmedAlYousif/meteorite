import { Controller, Request } from "../src/decorators/decorators.ts";
import { ServerRequest } from "https://deno.land/std@0.53.0/http/server.ts";


@Controller('')
export class Hello {

    @Request('/hello', 'GET')
    myReqeust(req: ServerRequest){
        req.respond({body: 'hi'});
    }
}
