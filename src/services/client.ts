export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestConfig<TBody = unknown, TResponse = unknown> {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: TBody;
  onHttpError?: (error: Error) => void;
  onRequestError?: (error: Error) => void;
  onComplete?: () => void;
  onSuccess?: (data: TResponse) => void;
}

export class Client {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL ? baseURL.replace(/\/+$/, "") : "";
  }

  private buildURL(endpoint: string) {
    return `${this.baseURL}/${endpoint.replace(/^\/+/, "")}`;
  }

  private async request<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    config: RequestConfig<TBody, TResponse> = {},
  ): Promise<TResponse> {
    const url = this.buildURL(endpoint);
    const {
      method = "GET",
      headers = {},
      body,
      onHttpError,
      onRequestError,
      onComplete,
      onSuccess,
    } = config;

    const init: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, init);

      if (!response.ok) {
        const message = await response.text();
        const error = new Error(`HTTP ${response.status}: ${message}`);
        onHttpError?.(error);
        throw error;
      }

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : ((await response.text()) as unknown as TResponse);

      onSuccess?.(data);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        onRequestError?.(err);
      }
      throw err;
    } finally {
      onComplete?.();
    }
  }

  async get<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig<undefined, TResponse>, "method" | "body">,
  ) {
    return await this.request<TResponse>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  async post<TResponse, TBody>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody, TResponse>, "method" | "body">,
  ) {
    return await this.request<TResponse, TBody>(endpoint, {
      ...config,
      method: "POST",
      body,
    });
  }

  async put<TResponse, TBody>(
    endpoint: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody, TResponse>, "method" | "body">,
  ) {
    return await this.request<TResponse, TBody>(endpoint, {
      ...config,
      method: "PUT",
      body,
    });
  }

  async delete<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig<undefined, TResponse>, "method" | "body">,
  ) {
    return await this.request<TResponse>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }
}
