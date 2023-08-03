import { Event, EventTemplate } from './event';
declare enum HttpMethod {
    Get = "get",
    Post = "post"
}
/**
 * Generate token for NIP-98 flow.
 *
 * @example
 * const sign = window.nostr.signEvent
 * await getToken('https://example.com/login', 'post', sign, true)
 */
export declare function getToken(loginUrl: string, httpMethod: HttpMethod | string, sign: <K extends number = number>(e: EventTemplate<K>) => Promise<Event<K>> | Event<K>, includeAuthorizationScheme?: boolean): Promise<string>;
/**
 * Validate token for NIP-98 flow.
 *
 * @example
 * await validateToken('Nostr base64token', 'https://example.com/login', 'post')
 */
export declare function validateToken(token: string, url: string, method: string): Promise<boolean>;
export {};
