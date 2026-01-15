"""
Skill Extractor Utility
Extracts and matches skills from resumes and job descriptions.
"""

import re
from typing import List, Set, Dict, Optional
from collections import defaultdict


class SkillExtractor:
    """
    Skill extraction and matching for resumes and job descriptions.
    Uses pattern matching and skill taxonomy for accurate extraction.
    """
    
    def __init__(self):
        """Initialize skill extractor with skill taxonomy."""
        self.skill_categories = self._load_skill_taxonomy()
        self.all_skills = self._flatten_skills()
    
    def _load_skill_taxonomy(self) -> Dict[str, List[str]]:
        """Load comprehensive skill taxonomy by category."""
        return {
            "programming_languages": [
                "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C",
                "Go", "Golang", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala",
                "R", "MATLAB", "Perl", "Lua", "Haskell", "Elixir", "Clojure",
                "Objective-C", "Dart", "Julia", "F#", "VB.NET", "Assembly",
                "Groovy", "Erlang", "Fortran", "COBOL", "Bash", "Shell", "PowerShell"
            ],
            "web_frontend": [
                "React", "React.js", "ReactJS", "Angular", "Vue", "Vue.js", "VueJS",
                "Svelte", "Next.js", "NextJS", "Nuxt.js", "Gatsby", "HTML", "HTML5",
                "CSS", "CSS3", "SASS", "SCSS", "Less", "Tailwind", "TailwindCSS",
                "Bootstrap", "Material UI", "MUI", "Chakra UI", "Styled Components",
                "jQuery", "Webpack", "Vite", "Parcel", "Rollup", "esbuild",
                "Redux", "MobX", "Zustand", "Recoil", "GraphQL", "Apollo",
                "Ember.js", "Backbone.js", "Alpine.js", "Lit", "Stencil"
            ],
            "web_backend": [
                "Node.js", "NodeJS", "Express", "Express.js", "Fastify", "NestJS",
                "Django", "Flask", "FastAPI", "Spring", "Spring Boot", "Rails",
                "Ruby on Rails", "Laravel", "Symfony", "ASP.NET", ".NET Core",
                "Phoenix", "Gin", "Echo", "Fiber", "Actix", "Rocket",
                "Koa", "Hapi", "Strapi", "Prisma", "TypeORM", "Sequelize",
                "SQLAlchemy", "Hibernate", "Entity Framework"
            ],
            "databases": [
                "SQL", "MySQL", "PostgreSQL", "Postgres", "MongoDB", "Redis",
                "Elasticsearch", "SQLite", "Oracle", "SQL Server", "MSSQL",
                "Cassandra", "DynamoDB", "Firebase", "Firestore", "CouchDB",
                "Neo4j", "MariaDB", "InfluxDB", "TimescaleDB", "CockroachDB",
                "Supabase", "PlanetScale", "Fauna", "Realm", "RethinkDB"
            ],
            "cloud_platforms": [
                "AWS", "Amazon Web Services", "Azure", "Microsoft Azure",
                "GCP", "Google Cloud", "Google Cloud Platform", "Heroku",
                "Vercel", "Netlify", "DigitalOcean", "Linode", "Vultr",
                "Cloudflare", "Railway", "Render", "Fly.io", "IBM Cloud",
                "Oracle Cloud", "Alibaba Cloud"
            ],
            "devops_infrastructure": [
                "Docker", "Kubernetes", "K8s", "Terraform", "Ansible", "Puppet",
                "Chef", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI",
                "Travis CI", "ArgoCD", "Helm", "Istio", "Prometheus", "Grafana",
                "ELK Stack", "Elasticsearch", "Logstash", "Kibana", "Datadog",
                "New Relic", "Splunk", "Vagrant", "Packer", "Consul", "Vault",
                "Nginx", "Apache", "HAProxy", "Traefik", "Kong"
            ],
            "machine_learning": [
                "Machine Learning", "ML", "Deep Learning", "DL", "Neural Networks",
                "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "sklearn",
                "XGBoost", "LightGBM", "CatBoost", "Pandas", "NumPy", "SciPy",
                "Matplotlib", "Seaborn", "Plotly", "Jupyter", "Hugging Face",
                "Transformers", "BERT", "GPT", "LLM", "Large Language Models",
                "NLP", "Natural Language Processing", "Computer Vision", "CV",
                "OpenCV", "YOLO", "CNN", "RNN", "LSTM", "GAN", "VAE",
                "Reinforcement Learning", "MLOps", "MLflow", "Kubeflow", "Weights & Biases",
                "Feature Engineering", "Model Deployment", "A/B Testing"
            ],
            "data_engineering": [
                "Data Engineering", "ETL", "ELT", "Apache Spark", "PySpark",
                "Hadoop", "Hive", "Pig", "Kafka", "Apache Kafka", "Airflow",
                "Apache Airflow", "Luigi", "Prefect", "Dagster", "dbt",
                "Snowflake", "Redshift", "BigQuery", "Databricks", "Delta Lake",
                "Apache Flink", "Apache Beam", "Kinesis", "Pub/Sub", "Fivetran"
            ],
            "mobile_development": [
                "iOS", "Android", "React Native", "Flutter", "Swift", "SwiftUI",
                "Kotlin", "Java", "Objective-C", "Xamarin", "Ionic", "Cordova",
                "PhoneGap", "Expo", "Mobile Development", "App Development"
            ],
            "testing": [
                "Unit Testing", "Integration Testing", "E2E Testing", "TDD",
                "Test-Driven Development", "BDD", "Jest", "Mocha", "Chai",
                "Cypress", "Playwright", "Selenium", "Puppeteer", "pytest",
                "unittest", "JUnit", "TestNG", "RSpec", "PHPUnit", "Jasmine",
                "Testing Library", "Enzyme", "Vitest", "MSTest", "xUnit"
            ],
            "version_control": [
                "Git", "GitHub", "GitLab", "Bitbucket", "SVN", "Mercurial",
                "Version Control", "Source Control"
            ],
            "methodologies": [
                "Agile", "Scrum", "Kanban", "Lean", "XP", "Extreme Programming",
                "Waterfall", "DevOps", "CI/CD", "Continuous Integration",
                "Continuous Deployment", "Code Review", "Pair Programming"
            ],
            "soft_skills": [
                "Communication", "Leadership", "Teamwork", "Problem Solving",
                "Critical Thinking", "Time Management", "Project Management",
                "Stakeholder Management", "Mentoring", "Presentation Skills",
                "Technical Writing", "Collaboration", "Adaptability"
            ],
            "security": [
                "Cybersecurity", "Security", "OAuth", "JWT", "Authentication",
                "Authorization", "Encryption", "SSL/TLS", "HTTPS", "Penetration Testing",
                "OWASP", "Security Auditing", "IAM", "RBAC", "SAST", "DAST"
            ],
            "api_protocols": [
                "REST", "RESTful", "GraphQL", "gRPC", "SOAP", "WebSocket",
                "WebSockets", "API Design", "OpenAPI", "Swagger", "Postman",
                "Insomnia", "API Gateway", "Microservices"
            ]
        }
    
    def _flatten_skills(self) -> Set[str]:
        """Create a flat set of all skills for quick lookup."""
        all_skills = set()
        for skills in self.skill_categories.values():
            all_skills.update(skill.lower() for skill in skills)
        return all_skills
    
    def extract_from_jd(self, jd_text: str) -> List[str]:
        """
        Extract required skills from a job description.
        
        Args:
            jd_text: Job description text
            
        Returns:
            List of extracted skill names
        """
        found_skills = set()
        text_lower = jd_text.lower()
        
        # Match skills from taxonomy
        for category, skills in self.skill_categories.items():
            for skill in skills:
                skill_lower = skill.lower()
                # Use word boundary matching
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.add(skill)
        
        # Also extract skills from requirements section
        requirements_patterns = [
            r"(?i)requirements?[:\s]*(.+?)(?=\n\n|responsibilities|benefits|$)",
            r"(?i)qualifications?[:\s]*(.+?)(?=\n\n|responsibilities|$)",
            r"(?i)must have[:\s]*(.+?)(?=\n\n|nice to have|$)",
            r"(?i)required skills?[:\s]*(.+?)(?=\n\n|$)"
        ]
        
        for pattern in requirements_patterns:
            match = re.search(pattern, jd_text, re.DOTALL)
            if match:
                section = match.group(1)
                section_skills = self._extract_from_section(section)
                found_skills.update(section_skills)
        
        return sorted(list(found_skills))
    
    def extract_from_resume(self, resume_text: str) -> List[str]:
        """
        Extract skills present in a resume.
        
        Args:
            resume_text: Resume text
            
        Returns:
            List of extracted skill names
        """
        found_skills = set()
        text_lower = resume_text.lower()
        
        # Match skills from taxonomy
        for category, skills in self.skill_categories.items():
            for skill in skills:
                skill_lower = skill.lower()
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.add(skill)
        
        # Extract from skills section specifically
        skills_section = self._extract_skills_section(resume_text)
        if skills_section:
            section_skills = self._extract_from_section(skills_section)
            found_skills.update(section_skills)
        
        return sorted(list(found_skills))
    
    def _extract_skills_section(self, text: str) -> Optional[str]:
        """Extract the skills section from resume."""
        patterns = [
            r"(?i)(?:skills|technical skills|core competencies|technologies)[:\s]*(.+?)(?=\n\n(?:experience|education|projects)|$)",
            r"(?i)(?:proficient in|experienced with)[:\s]*(.+?)(?=\n\n|$)"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1)
        
        return None
    
    def _extract_from_section(self, section: str) -> Set[str]:
        """Extract skills from a text section."""
        found_skills = set()
        section_lower = section.lower()
        
        for category, skills in self.skill_categories.items():
            for skill in skills:
                skill_lower = skill.lower()
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                if re.search(pattern, section_lower):
                    found_skills.add(skill)
        
        return found_skills
    
    def find_missing_skills(
        self,
        resume_skills: List[str],
        jd_skills: List[str]
    ) -> List[str]:
        """
        Find skills required by JD but missing from resume.
        
        Args:
            resume_skills: Skills found in resume
            jd_skills: Skills required in job description
            
        Returns:
            List of missing skills
        """
        resume_set = set(skill.lower() for skill in resume_skills)
        missing = []
        
        for skill in jd_skills:
            if skill.lower() not in resume_set:
                missing.append(skill)
        
        return missing
    
    def categorize_skills(self, skills: List[str]) -> Dict[str, List[str]]:
        """
        Categorize a list of skills.
        
        Args:
            skills: List of skill names
            
        Returns:
            Dictionary mapping categories to skills
        """
        categorized = defaultdict(list)
        
        for skill in skills:
            skill_lower = skill.lower()
            categorized_flag = False
            
            for category, category_skills in self.skill_categories.items():
                for cat_skill in category_skills:
                    if cat_skill.lower() == skill_lower:
                        categorized[category].append(skill)
                        categorized_flag = True
                        break
                
                if categorized_flag:
                    break
            
            if not categorized_flag:
                categorized["other"].append(skill)
        
        return dict(categorized)
    
    def calculate_skill_match_score(
        self,
        resume_skills: List[str],
        jd_skills: List[str]
    ) -> Dict:
        """
        Calculate detailed skill match metrics.
        
        Args:
            resume_skills: Skills from resume
            jd_skills: Skills from JD
            
        Returns:
            Dictionary with match metrics
        """
        if not jd_skills:
            return {
                "match_percentage": 100.0,
                "matched_count": len(resume_skills),
                "required_count": 0,
                "missing_count": 0
            }
        
        resume_set = set(skill.lower() for skill in resume_skills)
        jd_set = set(skill.lower() for skill in jd_skills)
        
        matched = resume_set.intersection(jd_set)
        missing = jd_set - resume_set
        extra = resume_set - jd_set
        
        match_percentage = (len(matched) / len(jd_set)) * 100
        
        return {
            "match_percentage": round(match_percentage, 1),
            "matched_count": len(matched),
            "required_count": len(jd_skills),
            "missing_count": len(missing),
            "extra_skills_count": len(extra),
            "matched_skills": sorted([s for s in jd_skills if s.lower() in matched]),
            "missing_skills": sorted([s for s in jd_skills if s.lower() in missing])
        }
    
    def get_skill_importance(self, skill: str, jd_text: str) -> str:
        """
        Determine the importance of a skill based on JD context.
        
        Args:
            skill: Skill name
            jd_text: Job description text
            
        Returns:
            'required', 'preferred', or 'mentioned'
        """
        skill_lower = skill.lower()
        jd_lower = jd_text.lower()
        
        # Check if in required section
        required_patterns = [
            r"(?:required|must have|essential|mandatory)[^.]*" + re.escape(skill_lower),
            re.escape(skill_lower) + r"[^.]*(?:required|must|essential)"
        ]
        
        for pattern in required_patterns:
            if re.search(pattern, jd_lower):
                return "required"
        
        # Check if in preferred section
        preferred_patterns = [
            r"(?:preferred|nice to have|bonus|plus)[^.]*" + re.escape(skill_lower),
            re.escape(skill_lower) + r"[^.]*(?:preferred|plus|bonus)"
        ]
        
        for pattern in preferred_patterns:
            if re.search(pattern, jd_lower):
                return "preferred"
        
        return "mentioned"
