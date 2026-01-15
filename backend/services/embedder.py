"""
Text Embedding Service
Handles semantic embeddings using Sentence Transformers.
"""

import os
from typing import List, Union, Optional
import numpy as np

from sentence_transformers import SentenceTransformer


class Embedder:
    """
    Text embedding service using Sentence Transformers (SBERT).
    Provides semantic similarity capabilities for resume-JD matching.
    """
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the embedder with a pre-trained model.
        
        Args:
            model_name: HuggingFace model name. Default is a fast, efficient model.
                       Options:
                       - "all-MiniLM-L6-v2" (fast, 384 dims)
                       - "all-mpnet-base-v2" (better quality, 768 dims)
                       - "paraphrase-multilingual-MiniLM-L12-v2" (multilingual)
        """
        self.model_name = os.getenv("EMBEDDING_MODEL", model_name)
        self.model = SentenceTransformer(self.model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
    
    def embed(self, text: Union[str, List[str]]) -> np.ndarray:
        """
        Generate embeddings for text(s).
        
        Args:
            text: Single text string or list of texts
            
        Returns:
            Numpy array of embeddings. Shape: (embedding_dim,) for single text,
            (n_texts, embedding_dim) for multiple texts.
        """
        if isinstance(text, str):
            return self.model.encode(text, convert_to_numpy=True)
        return self.model.encode(text, convert_to_numpy=True)
    
    def embed_batch(self, texts: List[str], batch_size: int = 32) -> np.ndarray:
        """
        Embed multiple texts in batches for memory efficiency.
        
        Args:
            texts: List of texts to embed
            batch_size: Number of texts to process at once
            
        Returns:
            Numpy array of embeddings, shape (n_texts, embedding_dim)
        """
        return self.model.encode(
            texts,
            batch_size=batch_size,
            convert_to_numpy=True,
            show_progress_bar=False
        )
    
    def similarity(self, text1: str, text2: str) -> float:
        """
        Calculate cosine similarity between two texts.
        
        Args:
            text1: First text
            text2: Second text
            
        Returns:
            Cosine similarity score (0-1, higher is more similar)
        """
        emb1 = self.embed(text1)
        emb2 = self.embed(text2)
        
        return self._cosine_similarity(emb1, emb2)
    
    def similarity_matrix(self, texts1: List[str], texts2: List[str]) -> np.ndarray:
        """
        Calculate pairwise similarity matrix between two lists of texts.
        
        Args:
            texts1: First list of texts
            texts2: Second list of texts
            
        Returns:
            Similarity matrix, shape (len(texts1), len(texts2))
        """
        emb1 = self.embed_batch(texts1)
        emb2 = self.embed_batch(texts2)
        
        # Normalize embeddings
        emb1_norm = emb1 / np.linalg.norm(emb1, axis=1, keepdims=True)
        emb2_norm = emb2 / np.linalg.norm(emb2, axis=1, keepdims=True)
        
        return np.dot(emb1_norm, emb2_norm.T)
    
    def _cosine_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Calculate cosine similarity between two vectors."""
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return float(np.dot(vec1, vec2) / (norm1 * norm2))
    
    def get_similar_chunks(
        self,
        query: str,
        documents: List[str],
        top_k: int = 5,
        threshold: float = 0.3
    ) -> List[tuple]:
        """
        Find most similar document chunks to a query.
        
        Args:
            query: Query text
            documents: List of document chunks
            top_k: Number of top results to return
            threshold: Minimum similarity threshold
            
        Returns:
            List of (index, similarity_score, document_text) tuples
        """
        query_emb = self.embed(query)
        doc_embs = self.embed_batch(documents)
        
        # Calculate similarities
        similarities = [
            self._cosine_similarity(query_emb, doc_emb)
            for doc_emb in doc_embs
        ]
        
        # Get top-k indices
        sorted_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in sorted_indices:
            if similarities[idx] >= threshold:
                results.append((
                    int(idx),
                    float(similarities[idx]),
                    documents[idx]
                ))
        
        return results
    
    def chunk_text(self, text: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
        """
        Split text into overlapping chunks for better embedding coverage.
        
        Args:
            text: Input text
            chunk_size: Number of words per chunk
            overlap: Number of overlapping words between chunks
            
        Returns:
            List of text chunks
        """
        words = text.split()
        chunks = []
        
        if len(words) <= chunk_size:
            return [text]
        
        step = chunk_size - overlap
        for i in range(0, len(words) - overlap, step):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
        
        return chunks
