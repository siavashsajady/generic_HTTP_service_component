import apiClient from './api-client';

interface Entity {
  id: number;
}

class HttpService {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  getAll<T>() {
    const controller = new AbortController();
    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  // This method simply calls the apiClient.delete method with the appropriate URL,
  //  constructed by appending the entity's id to the endpoint.
  delete(id: number) {
    return apiClient.delete(this.endpoint + '/' + id);
  }

  // The create method accepts an object entity of type T and sends it as the request
  // payload in a POST request to the endpoint using apiClient.post.
  create<T>(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  // The update method accepts an object entity of a type that extends the Entity interface.
  // It sends the object as the request payload in a PATCH request to the appropriate URL,
  // constructed by appending the entity's id to the endpoint.
  update<T extends Entity>(entity: T) {
    return apiClient.patch(this.endpoint + '/' + entity.id, entity);
  }
}

// This create function is a simple factory function that takes an endpoint as a parameter
// and returns a new instance of the HttpService class.
const create = (endpoint: string) => new HttpService(endpoint);

export default create;
