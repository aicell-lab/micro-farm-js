import { hyphaWebsocketClient } from "hypha-rpc";

const serverUrl = "https://hypha.aicell.io";
interface LoginContext {
    login_url: string;
}
const loginCallback = (context: LoginContext): void => {
    window.open(context.login_url);
};
async function startServer(serverUrl: string): Promise<void> {
    const token = await hyphaWebsocketClient.login({
        server_url: serverUrl,
        login_callback: loginCallback,
    });
    const server = await hyphaWebsocketClient.connectToServer({
        server_url: serverUrl,
        token: token,
    });
    const myService = await server.registerService({
        id: "hello-world",
        name: "Hello World",
        description: "A simple hello world service",
        config: {
            visibility: "public",
            require_context: false,
        },
        methods: {
            hello: {
                params: true,
                handler: (name: string) => {
                    console.log("Hello " + name);
                    return "Hello " + name;
                },
            },
        },
    });
    console.log(`Hello world service registered at workspace: ${server.config.workspace}, id: ${myService.id}`);
    console.log(`You can use this service using the service id: ${myService.id}`);
    console.log(`Test via HTTP proxy:\n${serverUrl}/${encodeURIComponent(server.config.workspace)}/services/hello-world/hello?name=John`);
}

export async function registerServer(): Promise<void> {
    startServer(serverUrl).catch(console.error);
}