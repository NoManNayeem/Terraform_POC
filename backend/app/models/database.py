"""SQLite database setup and session management."""
import sqlite3
from typing import Generator
from app.core.config import settings


def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """
    Get SQLite database connection.
    Creates database file if it doesn't exist.
    """
    conn = sqlite3.connect(settings.DATABASE_URL.replace("sqlite:///", ""))
    conn.row_factory = sqlite3.Row  # Enable column access by name
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """Initialize database with sample table."""
    conn = sqlite3.connect(settings.DATABASE_URL.replace("sqlite:///", ""))
    cursor = conn.cursor()
    
    # Create a simple items table for POC
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()

