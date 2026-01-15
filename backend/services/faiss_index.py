"""
FAISS Index Service
Provides vector similarity search using Facebook AI Similarity Search.
"""

import os
from typing import List, Tuple, Optional
import numpy as np

try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False
    print("Warning: FAISS not available. Using numpy-based similarity search.")


class FAISSIndex:
    """
    FAISS-based vector index for fast similarity search.
    Falls back to numpy-based search if FAISS is not available.
    """
    
    def __init__(self, embedding_dim: int = 384):
        """
        Initialize the FAISS index.
        
        Args:
            embedding_dim: Dimension of embedding vectors (must match embedder output)
        """
        self.embedding_dim = embedding_dim
        self.documents: List[str] = []
        self.index = None
        self.embeddings: Optional[np.ndarray] = None
        
        if FAISS_AVAILABLE:
            # Use IndexFlatIP for cosine similarity (with normalized vectors)
            self.index = faiss.IndexFlatIP(embedding_dim)
    
    def add(self, embeddings: np.ndarray, documents: List[str]) -> None:
        """
        Add documents and their embeddings to the index.
        
        Args:
            embeddings: Document embeddings, shape (n_docs, embedding_dim)
            documents: List of document texts corresponding to embeddings
        """
        if len(embeddings) != len(documents):
            raise ValueError("Number of embeddings must match number of documents")
        
        # Normalize embeddings for cosine similarity
        normalized = self._normalize(embeddings)
        
        if FAISS_AVAILABLE:
            self.index.add(normalized.astype(np.float32))
        else:
            if self.embeddings is None:
                self.embeddings = normalized
            else:
                self.embeddings = np.vstack([self.embeddings, normalized])
        
        self.documents.extend(documents)
    
    def search(
        self,
        query_embedding: np.ndarray,
        top_k: int = 5,
        threshold: float = 0.0
    ) -> List[Tuple[int, float, str]]:
        """
        Search for most similar documents.
        
        Args:
            query_embedding: Query vector
            top_k: Number of results to return
            threshold: Minimum similarity threshold
            
        Returns:
            List of (index, similarity_score, document) tuples
        """
        if len(self.documents) == 0:
            return []
        
        # Normalize query
        query_norm = self._normalize(query_embedding.reshape(1, -1))
        
        if FAISS_AVAILABLE:
            distances, indices = self.index.search(
                query_norm.astype(np.float32),
                min(top_k, len(self.documents))
            )
            
            results = []
            for dist, idx in zip(distances[0], indices[0]):
                if idx != -1 and dist >= threshold:
                    results.append((int(idx), float(dist), self.documents[idx]))
            return results
        else:
            # Numpy fallback
            similarities = np.dot(self.embeddings, query_norm.T).flatten()
            sorted_indices = np.argsort(similarities)[::-1][:top_k]
            
            results = []
            for idx in sorted_indices:
                if similarities[idx] >= threshold:
                    results.append((
                        int(idx),
                        float(similarities[idx]),
                        self.documents[idx]
                    ))
            return results
    
    def batch_search(
        self,
        query_embeddings: np.ndarray,
        top_k: int = 5,
        threshold: float = 0.0
    ) -> List[List[Tuple[int, float, str]]]:
        """
        Search for multiple queries at once.
        
        Args:
            query_embeddings: Query vectors, shape (n_queries, embedding_dim)
            top_k: Number of results per query
            threshold: Minimum similarity threshold
            
        Returns:
            List of result lists, one per query
        """
        results = []
        for query_emb in query_embeddings:
            results.append(self.search(query_emb, top_k, threshold))
        return results
    
    def clear(self) -> None:
        """Clear all documents from the index."""
        self.documents = []
        if FAISS_AVAILABLE:
            self.index = faiss.IndexFlatIP(self.embedding_dim)
        else:
            self.embeddings = None
    
    def _normalize(self, vectors: np.ndarray) -> np.ndarray:
        """L2 normalize vectors for cosine similarity."""
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1, norms)  # Avoid division by zero
        return vectors / norms
    
    def save(self, path: str) -> None:
        """Save index to disk."""
        if FAISS_AVAILABLE:
            faiss.write_index(self.index, f"{path}.index")
        else:
            np.save(f"{path}.npy", self.embeddings)
        
        # Save documents
        with open(f"{path}.docs", "w", encoding="utf-8") as f:
            for doc in self.documents:
                f.write(doc.replace("\n", "\\n") + "\n")
    
    def load(self, path: str) -> None:
        """Load index from disk."""
        if FAISS_AVAILABLE:
            self.index = faiss.read_index(f"{path}.index")
        else:
            self.embeddings = np.load(f"{path}.npy")
        
        # Load documents
        self.documents = []
        with open(f"{path}.docs", "r", encoding="utf-8") as f:
            for line in f:
                self.documents.append(line.strip().replace("\\n", "\n"))
    
    @property
    def size(self) -> int:
        """Return number of documents in index."""
        return len(self.documents)
