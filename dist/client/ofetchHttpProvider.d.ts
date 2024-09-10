import { HttpProviderBase } from "../provider/httpProviderBase";
export declare class OfetchHttpProvider implements HttpProviderBase {
    get(url: string, opts: {
        query: {
            [key: string]: string;
        };
    }): Promise<any>;
    post<T>(url: string, data: unknown): Promise<T>;
}
