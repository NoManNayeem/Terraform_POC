/**
 * API client for communicating with the FastAPI backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface Item {
  id: number
  name: string
  description: string | null
  created_at: string
}

export interface CreateItemRequest {
  name: string
  description: string | null
}

/**
 * Fetch all items from the backend.
 */
export async function getItems(): Promise<Item[]> {
  const response = await fetch(`${API_URL}/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch items: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Create a new item.
 */
export async function createItem(item: CreateItemRequest): Promise<Item> {
  const response = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })

  if (!response.ok) {
    throw new Error(`Failed to create item: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get a specific item by ID.
 */
export async function getItem(id: number): Promise<Item> {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch item: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Delete an item by ID.
 */
export async function deleteItem(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete item: ${response.statusText}`)
  }
}

