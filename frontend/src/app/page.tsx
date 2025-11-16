'use client'

import { useState, useEffect } from 'react'
import { getItems, createItem, deleteItem, Item } from '@/lib/api'
import { 
  FiRocket, 
  FiPlus, 
  FiPackage, 
  FiClock, 
  FiTrash2, 
  FiInfo, 
  FiCheckCircle, 
  FiAlertCircle,
  FiLoader,
  FiInbox,
  FiExternalLink
} from 'react-icons/fi'

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
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
      setSuccess(null)
      await createItem({ name: name.trim(), description: description.trim() || null })
      setName('')
      setDescription('')
      setSuccess('Item added successfully!')
      await loadItems()
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to create item. Please try again.')
      console.error('Error creating item:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      setError(null)
      setSuccess(null)
      await deleteItem(id)
      setSuccess('Item deleted successfully!')
      await loadItems()
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to delete item. Please try again.')
      console.error('Error deleting item:', err)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>
          <FiRocket className="header-icon" />
          FastAPI + Next.js POC
        </h1>
        <p>Modern Full-Stack Application with AWS ECS Deployment</p>
      </div>

      <div className="card">
        <h2>
          <FiPlus className="icon" />
          Add New Item
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="item-name">Item Name</label>
            <input
              id="item-name"
              type="text"
              className="input"
              placeholder="Enter item name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="item-description">Description (Optional)</label>
            <input
              id="item-description"
              type="text"
              className="input"
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <button type="submit" className="button" disabled={submitting || !name.trim()}>
            {submitting ? (
              <>
                <FiLoader className="spinning-icon" />
                Adding...
              </>
            ) : (
              <>
                <FiPlus />
                Add Item
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert error">
          <FiAlertCircle className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert success">
          <FiCheckCircle className="alert-icon" />
          <span>{success}</span>
        </div>
      )}

      <div className="card">
        <h2>
          <FiPackage className="icon" />
          Items
          <span className="badge">{items.length}</span>
        </h2>
        {loading ? (
          <div className="loading">
            <FiLoader className="loading-spinner-icon" />
            <span>Loading items...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <FiInbox className="empty-state-icon" />
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No items yet</p>
            <p>Add your first item above to get started!</p>
          </div>
        ) : (
          <ul className="items-list">
            {items.map((item) => (
              <li key={item.id} className="item-card">
                <div className="item-content">
                  <div className="item-name">{item.name}</div>
                  {item.description && (
                    <div className="item-description">{item.description}</div>
                  )}
                  <div className="item-meta">
                    <FiClock className="meta-icon" />
                    <span>Created: {new Date(item.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <button
                    className="button button-danger"
                    onClick={() => handleDelete(item.id)}
                    title="Delete item"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card info-card">
        <h3>
          <FiInfo className="icon" />
          API Information
        </h3>
        <p>
          <strong>Backend API URL:</strong>{' '}
          <code style={{ 
            background: 'rgba(102, 126, 234, 0.1)', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>
            {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
          </code>
        </p>
        <p>
          <strong>Health Check:</strong>{' '}
          <a 
            href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/health`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Check Backend Health
            <FiExternalLink className="link-icon" />
          </a>
        </p>
        <p>
          <strong>API Documentation:</strong>{' '}
          <a 
            href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/docs`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Swagger Docs
            <FiExternalLink className="link-icon" />
          </a>
        </p>
      </div>
    </div>
  )
}
