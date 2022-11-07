import request from '../config';

/** posts */
export async function getItems(base: string, params: any, options?: Record<string, any>) {
  return request<{ items: any; totalItems?: number; totalPages?: number; currentPage?: number }>(
    `/${base}`,
    {
      method: 'GET',
      params,
      ...(options || {}),
    },
  );
}

/** get post */
export async function getItemByID(base: string, id: string, options?: Record<string, any>) {
  return request(`/${base}/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** add new post */
export async function addItem(base: string, data: any, options?: Record<string, any>) {
  return request(`/${base}`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** update post*/
export async function updateItem(
  base: string,
  id: string,
  data: any,
  options?: Record<string, any>,
) {
  return request(`/${base}/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** update post*/
export async function deleteItem(base: string, id: string, options?: Record<string, any>) {
  return request(`/${base}/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
