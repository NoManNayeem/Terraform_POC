"""API routes for the FastAPI application."""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
import sqlite3
from app.models.database import get_db_connection
from pydantic import BaseModel

router = APIRouter()


class ItemCreate(BaseModel):
    """Schema for creating an item."""
    name: str
    description: str = None


class ItemResponse(BaseModel):
    """Schema for item response."""
    id: int
    name: str
    description: str = None
    created_at: str = None

    class Config:
        from_attributes = True


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "backend"}


@router.get("/items", response_model=List[ItemResponse])
async def get_items(conn: sqlite3.Connection = Depends(get_db_connection)):
    """Get all items."""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM items ORDER BY created_at DESC")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


@router.post("/items", response_model=ItemResponse, status_code=201)
async def create_item(
    item: ItemCreate,
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Create a new item."""
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO items (name, description) VALUES (?, ?)",
        (item.name, item.description)
    )
    conn.commit()
    item_id = cursor.lastrowid
    
    cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    return dict(row)


@router.get("/items/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: int,
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Get a specific item by ID."""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    
    if not row:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return dict(row)


@router.delete("/items/{item_id}", status_code=204)
async def delete_item(
    item_id: int,
    conn: sqlite3.Connection = Depends(get_db_connection)
):
    """Delete an item by ID."""
    cursor = conn.cursor()
    cursor.execute("DELETE FROM items WHERE id = ?", (item_id,))
    conn.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return None

