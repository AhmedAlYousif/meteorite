import { serve } from "../../package.ts";

export function MeteorServer(args:{address?: string | Pick<Deno.ListenOptions, "port" | "hostname">, controllers?:Function[]}) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class extends constructor {
            _meteorServer = serve(args.address || { port: 8080 });
        }
    }
}