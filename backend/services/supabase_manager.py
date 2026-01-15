"""
Supabase Integration Module - Optional Database & Auth
For future features like storing user analysis history and authentication
"""

import os
from typing import Optional, Dict, Any
from supabase import create_client, Client

class SupabaseManager:
    """Manage Supabase connection and operations"""
    
    def __init__(self):
        """Initialize Supabase client"""
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.client: Optional[Client] = None
        
        if self.url and self.key:
            self.client = create_client(self.url, self.key)
    
    def is_connected(self) -> bool:
        """Check if Supabase is configured"""
        return self.client is not None
    
    async def save_analysis(self, user_id: str, analysis_data: Dict[str, Any]) -> bool:
        """Save resume analysis to database
        
        Args:
            user_id: User identifier
            analysis_data: Analysis results {score, skills, roadmap, etc}
        
        Returns:
            Success status
        """
        if not self.client:
            return False
        
        try:
            response = self.client.table("analyses").insert({
                "user_id": user_id,
                "data": analysis_data
            }).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error saving analysis: {e}")
            return False
    
    async def get_user_analyses(self, user_id: str) -> list:
        """Get all analyses for a user
        
        Args:
            user_id: User identifier
        
        Returns:
            List of analyses
        """
        if not self.client:
            return []
        
        try:
            response = self.client.table("analyses").select("*").eq(
                "user_id", user_id
            ).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching analyses: {e}")
            return []


# Initialize Supabase manager (optional)
supabase = SupabaseManager()
