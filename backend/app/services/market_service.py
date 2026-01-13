"""
Job Market Intelligence Service
"""

from typing import Dict, List
from app.models.schemas import (
    JobMarketResponse,
    SkillDemand,
    SalaryRange,
    DemandTrend,
)


# Job market data (in production, this would come from APIs or databases)
MARKET_DATA = {
    "sde": {
        "role": "Software Development Engineer",
        "demandTrend": DemandTrend.INCREASING,
        "averageSalary": SalaryRange(min=120000, max=180000, currency="USD"),
        "topSkills": [
            SkillDemand(name="TypeScript", demand=92),
            SkillDemand(name="React", demand=88),
            SkillDemand(name="Node.js", demand=85),
            SkillDemand(name="AWS", demand=82),
            SkillDemand(name="Python", demand=78),
            SkillDemand(name="Docker", demand=75),
            SkillDemand(name="Kubernetes", demand=70),
            SkillDemand(name="GraphQL", demand=65),
        ],
        "topCompanies": ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Stripe", "Airbnb"],
        "jobCount": 15420,
    },
    "frontend": {
        "role": "Frontend Developer",
        "demandTrend": DemandTrend.INCREASING,
        "averageSalary": SalaryRange(min=100000, max=160000, currency="USD"),
        "topSkills": [
            SkillDemand(name="React", demand=95),
            SkillDemand(name="TypeScript", demand=90),
            SkillDemand(name="Next.js", demand=85),
            SkillDemand(name="CSS/Tailwind", demand=82),
            SkillDemand(name="JavaScript", demand=80),
            SkillDemand(name="Vue.js", demand=65),
            SkillDemand(name="Testing", demand=60),
            SkillDemand(name="GraphQL", demand=55),
        ],
        "topCompanies": ["Vercel", "Stripe", "Shopify", "Figma", "Notion", "Discord"],
        "jobCount": 12350,
    },
    "backend": {
        "role": "Backend Developer",
        "demandTrend": DemandTrend.STABLE,
        "averageSalary": SalaryRange(min=115000, max=175000, currency="USD"),
        "topSkills": [
            SkillDemand(name="Python", demand=90),
            SkillDemand(name="Node.js", demand=88),
            SkillDemand(name="SQL", demand=85),
            SkillDemand(name="AWS", demand=82),
            SkillDemand(name="Docker", demand=78),
            SkillDemand(name="PostgreSQL", demand=75),
            SkillDemand(name="Redis", demand=68),
            SkillDemand(name="Go", demand=62),
        ],
        "topCompanies": ["Amazon", "Google", "Meta", "Uber", "Lyft", "Doordash"],
        "jobCount": 11200,
    },
    "fullstack": {
        "role": "Full Stack Developer",
        "demandTrend": DemandTrend.INCREASING,
        "averageSalary": SalaryRange(min=110000, max=170000, currency="USD"),
        "topSkills": [
            SkillDemand(name="React", demand=92),
            SkillDemand(name="Node.js", demand=90),
            SkillDemand(name="TypeScript", demand=88),
            SkillDemand(name="PostgreSQL", demand=82),
            SkillDemand(name="AWS", demand=78),
            SkillDemand(name="Docker", demand=72),
            SkillDemand(name="Next.js", demand=70),
            SkillDemand(name="MongoDB", demand=65),
        ],
        "topCompanies": ["Startups", "Amazon", "Microsoft", "Shopify", "Atlassian"],
        "jobCount": 18500,
    },
    "devops": {
        "role": "DevOps Engineer",
        "demandTrend": DemandTrend.INCREASING,
        "averageSalary": SalaryRange(min=130000, max=190000, currency="USD"),
        "topSkills": [
            SkillDemand(name="AWS", demand=95),
            SkillDemand(name="Kubernetes", demand=92),
            SkillDemand(name="Docker", demand=90),
            SkillDemand(name="Terraform", demand=88),
            SkillDemand(name="CI/CD", demand=85),
            SkillDemand(name="Python", demand=78),
            SkillDemand(name="Linux", demand=75),
            SkillDemand(name="Ansible", demand=68),
        ],
        "topCompanies": ["Amazon", "Google", "Netflix", "Spotify", "Datadog"],
        "jobCount": 9800,
    },
    "ml-engineer": {
        "role": "Machine Learning Engineer",
        "demandTrend": DemandTrend.INCREASING,
        "averageSalary": SalaryRange(min=150000, max=220000, currency="USD"),
        "topSkills": [
            SkillDemand(name="Python", demand=98),
            SkillDemand(name="PyTorch", demand=92),
            SkillDemand(name="TensorFlow", demand=88),
            SkillDemand(name="SQL", demand=82),
            SkillDemand(name="AWS/GCP", demand=78),
            SkillDemand(name="MLOps", demand=75),
            SkillDemand(name="Transformers", demand=72),
            SkillDemand(name="LLMs", demand=85),
        ],
        "topCompanies": ["OpenAI", "Google DeepMind", "Meta AI", "Anthropic", "Nvidia"],
        "jobCount": 7200,
    },
    "data-analyst": {
        "role": "Data Analyst",
        "demandTrend": DemandTrend.STABLE,
        "averageSalary": SalaryRange(min=80000, max=130000, currency="USD"),
        "topSkills": [
            SkillDemand(name="SQL", demand=95),
            SkillDemand(name="Python", demand=88),
            SkillDemand(name="Excel", demand=85),
            SkillDemand(name="Tableau", demand=82),
            SkillDemand(name="Power BI", demand=78),
            SkillDemand(name="Statistics", demand=75),
            SkillDemand(name="R", demand=60),
            SkillDemand(name="dbt", demand=55),
        ],
        "topCompanies": ["Google", "Meta", "Amazon", "McKinsey", "Deloitte"],
        "jobCount": 14300,
    },
    "data-scientist": {
        "role": "Data Scientist",
        "demandTrend": DemandTrend.STABLE,
        "averageSalary": SalaryRange(min=120000, max=180000, currency="USD"),
        "topSkills": [
            SkillDemand(name="Python", demand=95),
            SkillDemand(name="SQL", demand=90),
            SkillDemand(name="Machine Learning", demand=88),
            SkillDemand(name="Statistics", demand=85),
            SkillDemand(name="Pandas", demand=82),
            SkillDemand(name="Scikit-learn", demand=78),
            SkillDemand(name="Deep Learning", demand=72),
            SkillDemand(name="NLP", demand=68),
        ],
        "topCompanies": ["Meta", "Google", "Netflix", "Spotify", "Airbnb"],
        "jobCount": 8500,
    },
}


class MarketService:
    """Service for job market intelligence"""
    
    def get_market_data(self, job_role: str) -> JobMarketResponse:
        """Get job market data for a role"""
        data = MARKET_DATA.get(job_role, MARKET_DATA["sde"])
        
        return JobMarketResponse(
            role=data["role"],
            demandTrend=data["demandTrend"],
            averageSalary=data["averageSalary"],
            topSkills=data["topSkills"],
            topCompanies=data["topCompanies"],
            jobCount=data["jobCount"],
        )
