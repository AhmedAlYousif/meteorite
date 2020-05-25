

export type MeteorServerArgs = {
    address?: string | Pick<Deno.ListenOptions, "port" | "hostname">,
    controllers?:Function[]
};