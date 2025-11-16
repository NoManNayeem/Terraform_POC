"""SQLite database setup and session management."""
import sqlite3
from typing import Generator
from app.core.config import settings
import threading

# Thread-local storage for database connections
_local = threading.local()


def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """
    Get SQLite database connection.
    Creates database file if it doesn't exist.
    Uses thread-local storage to avoid threading issues.
    """
    # Get or create connection for this thread
    if not hasattr(_local, 'connection') or _local.connection is None:
        db_path = settings.DATABASE_URL.replace("sqlite:///", "")
        _local.connection = sqlite3.connect(db_path, check_same_thread=False)
        _local.connection.row_factory = sqlite3.Row  # Enable column access by name
    
    try:
        yield _local.connection
    finally:
        # Don't close here - keep connection for thread lifetime
        pass


def close_db_connection():
    """Close the database connection for the current thread."""
    if hasattr(_local, 'connection') and _local.connection is not None:
        _local.connection.close()
        _local.connection = None


def init_db():
    """Initialize database with sample table."""
    db_path = settings.DATABASE_URL.replace("sqlite:///", "")
    conn = sqlite3.connect(db_path, check_same_thread=False)
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

