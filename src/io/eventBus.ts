import { UIEventMap } from "./uiEvent";

export type EventCallback<Payload> = (payload: Payload) => void;

export class EventBus<Events extends Record<string, unknown>> {
    private listeners: {
        [K in keyof Events]?: EventCallback<Events[K]>[];
    } = {};
    private eventQueue: { event: keyof Events; payload: any }[] = [];

    on<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>): void {
        this.listeners[event] ??= [];
        this.listeners[event]!.push(callback);
    }

    off<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>): void {
        this.listeners[event] = (this.listeners[event] || []).filter(cb => cb !== callback);
    }


    queue<K extends keyof Events>(event: K, payload: Events[K]): void {
        this.eventQueue.push({ event, payload });
    }

    processEvents(): void {
        while (this.eventQueue.length > 0) {
            const { event, payload } = this.eventQueue.shift()!;
            (this.listeners[event] || []).forEach(cb => cb(payload));
        }
    }

    clearQueue(): void {
        this.eventQueue = [];
    }

}


export const uiEventBus = new EventBus<UIEventMap>();
