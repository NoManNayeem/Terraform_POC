'use client'

import { useState, useEffect } from 'react'
import { getItems, createItem, deleteItem, Item } from '@/lib/api'

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getItems()
      setItems(data)
    } catch (err) {
      setError('Failed to load items. Make sure the backend is running.')
      console.error('Error loading items:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setSubmitting(true)
      setError(null)
      await createItem({ name: name.trim(), description: description.trim() || null })
      setName('')
      setDescription('')
      await loadItems()
    } catch (err) {
      setError('Failed to create item')
      console.error('Error creating item:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      setError(null)
      await deleteItem(id)
      await loadItems()
    } catch (err) {
      setError('Failed to delete item')
      console.error('Error deleting item:', err)
    }
  }

  return (
    <div className="container">
      <h1>FastAPI + Next.js POC</h1>
      <p>This is a proof of concept application demonstrating FastAPI backend with Next.js frontend.</p>

      <div className="card">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            className="input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Items ({items.length})</h2>
        {loading ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>No items yet. Add one above!</p>
        ) : (
          <ul style={{ listStyle: 'none' }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong>{item.name}</strong>
                  {item.description && <p style={{ marginTop: '0.5rem', color: '#666' }}>{item.description}</p>}
                  <small style={{ color: '#999' }}>
                    Created: {new Date(item.created_at).toLocaleString()}
                  </small>
                </div>
                <button
                  className="button"
                  onClick={() => handleDelete(item.id)}
                  style={{ backgroundColor: '#d32f2f' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>API Information</h3>
        <p>Backend API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}</p>
        <p>Health Check: <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/health`} target="_blank" rel="noopener noreferrer">Check Backend Health</a></p>
      </div>
    </div>
  )
}

