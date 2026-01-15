# 🧪 Testing Guide

Complete testing strategy for AI Resume & Career Intelligence System

## Manual Testing

### 1. Local Setup Testing

**Objective:** Verify all services initialize correctly

**Steps:**
```bash
# Terminal 1 - Start Backend
cd backend
source .venv/bin/activate
python -m uvicorn app:app --reload

# Should see:
# ✅ 🚀 Initializing AI services...
# ✅ ✅ All services initialized successfully!
# ✅ INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Verify:**
- [x] No import errors
- [x] Services initialize within 30 seconds
- [x] API responds to health check

### 2. API Endpoint Testing

#### Test 1: Health Check
```bash
curl http://localhost:8000/health

# Expected Response (200 OK):
{
  "status": "healthy",
  "services": {
    "embedder": true,
    "scorer": true,
    "llm_reasoner": true,
    "skill_extractor": true
  }
}
```

#### Test 2: Resume Analysis (Full Flow)

**Sample Resume Text:**
```
John Doe
john.doe@email.com | +1 (555) 123-4567

EXPERIENCE
Senior Software Engineer | TechCorp | Jan 2022 - Present
- Led development of ML pipeline using Python and PyTorch
- Built REST APIs with FastAPI and Node.js
- Managed AWS infrastructure using Terraform

Software Engineer | StartupXYZ | Jun 2020 - Dec 2021
- Developed React frontend applications
- Wrote SQL queries for PostgreSQL database
- Implemented CI/CD pipelines with GitHub Actions

EDUCATION
B.S. Computer Science | State University | 2020

SKILLS
Languages: Python, JavaScript, Java, SQL
Frameworks: React, FastAPI, Django, Express.js
Tools: AWS, Docker, Kubernetes, Git, JIRA
```

**Sample Job Description:**
```
Senior Full-Stack Engineer

Requirements:
- 5+ years of software development experience
- Strong proficiency in Python and JavaScript/TypeScript
- Experience with FastAPI or Django
- Knowledge of Docker and Kubernetes
- Experience with AWS cloud platform
- SQL and NoSQL database experience
- Git version control experience

Nice to Have:
- Machine Learning experience
- React or Vue.js frontend skills
- DevOps background
```

**Test Command:**
```bash
curl -X POST http://localhost:8000/analyze \
  -F "resume=@sample_resume.pdf" \
  -F "job_description=Senior Full-Stack Engineer..."

# Expected Response:
{
  "success": true,
  "data": {
    "score": 82,
    "sub_scores": {
      "skills_match": 85.0,
      "experience_relevance": 78.0,
      "keyword_coverage": 88.0,
      "role_alignment": 75.0
    },
    "rejection_reasons": [],
    "missing_skills": [],
    "present_skills": ["Python", "JavaScript", "FastAPI", "Docker", ...],
    "required_skills": ["Python", "JavaScript", "FastAPI", "Docker", ...],
    "learning_roadmap": {...}
  }
}
```

#### Test 3: Skills Gap Analysis

```bash
curl -X POST http://localhost:8000/skills-gap \
  -F "resume=@resume.pdf" \
  -F "job_description=Job description text..."

# Expected Response:
{
  "success": true,
  "data": {
    "required_skills": ["Python", "React", "Docker", ...],
    "present_skills": ["Python", "JavaScript", ...],
    "missing_skills": ["React", "Docker", ...],
    "match_percentage": 75.5
  }
}
```

### 3. Frontend Component Testing

#### Test 1: Resume Upload Component
- [x] Drag and drop accepts PDF files
- [x] Drag and drop accepts DOCX files
- [x] Drag and drop rejects other file types
- [x] File size limit enforced (10MB)
- [x] Remove button works
- [x] File info displays correctly

**Test Script:**
```typescript
// In browser console on /analyze page
const uploadComponent = document.querySelector('[class*="UploadResume"]');
console.log("Upload component mounted:", !!uploadComponent);

// Try uploading a file
// 1. Drag PDF file to drop zone
// 2. Verify success message
// 3. Click remove button
// 4. Verify file cleared
```

#### Test 2: Job Description Input
- [x] Textarea accepts multi-line text
- [x] Paste button works
- [x] Sample JD loads correctly
- [x] Word count updates in real-time
- [x] Disabled state when analyzing

#### Test 3: Score Card Display
- [x] Score displays as 0-100 number
- [x] Color changes based on score
- [x] Sub-scores display correctly
- [x] Loading skeleton shows during analysis
- [x] Score interpretation updates

### 4. End-to-End Test Flow

**Scenario 1: High Match (80+)**
1. Upload strong resume (Python, React, AWS, Docker)
2. Paste job description for Senior Full-Stack
3. Expected: Score 80+, no rejection reasons, minimal missing skills
4. Verify: Roadmap shows advanced/consolidation skills

**Scenario 2: Medium Match (60-79)**
1. Upload resume with some relevant skills
2. Paste demanding job description
3. Expected: Score 60-79, 2-4 rejection reasons, 5-8 missing skills
4. Verify: Roadmap has structured 30-60-90 plan

**Scenario 3: Low Match (<60)**
1. Upload junior resume (HTML, CSS, basic JavaScript)
2. Paste senior role (5+ years, advanced technologies)
3. Expected: Score <60, clear rejection reasons, 10+ missing skills
4. Verify: Roadmap focuses on fundamentals

---

## Automated Test Suite

### Backend Tests

Create `backend/tests/test_api.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_health_check():
    """Test API health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze_invalid_file():
    """Test analysis rejects invalid file type"""
    data = {"job_description": "Sample job description"}
    files = {"resume": ("test.txt", b"invalid", "text/plain")}
    response = client.post("/analyze", data=data, files=files)
    assert response.status_code == 400

def test_analyze_missing_fields():
    """Test analysis requires all fields"""
    response = client.post("/analyze", data={})
    assert response.status_code == 422

def test_extract_text_pdf():
    """Test PDF text extraction"""
    with open("sample_resume.pdf", "rb") as f:
        files = {"file": ("resume.pdf", f, "application/pdf")}
        response = client.post("/extract-text", files=files)
    assert response.status_code == 200
    assert "text" in response.json()

def test_skills_gap():
    """Test skills gap analysis"""
    with open("sample_resume.pdf", "rb") as f:
        data = {"job_description": "Senior Developer..."}
        files = {"resume": ("resume.pdf", f, "application/pdf")}
        response = client.post("/skills-gap", data=data, files=files)
    assert response.status_code == 200
    result = response.json()
    assert "missing_skills" in result["data"]
    assert "present_skills" in result["data"]
```

**Run Tests:**
```bash
pip install pytest pytest-asyncio
pytest backend/tests/ -v
```

### Frontend Tests

Create `frontend/__tests__/components.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { UploadResume } from '@/components/resume/UploadResume'
import { ScoreCard } from '@/components/results/ScoreCard'

describe('UploadResume Component', () => {
  it('renders upload area', () => {
    render(<UploadResume onFileSelect={() => {}} selectedFile={null} />)
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument()
  })

  it('accepts file selection', async () => {
    const onFileSelect = jest.fn()
    render(<UploadResume onFileSelect={onFileSelect} selectedFile={null} />)
    
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
    const input = screen.getByRole('input')
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(onFileSelect).toHaveBeenCalled()
  })
})

describe('ScoreCard Component', () => {
  it('displays score correctly', () => {
    const props = {
      score: 85,
      subScores: {
        skills_match: 85,
        experience_relevance: 80,
        keyword_coverage: 90,
        role_alignment: 82
      }
    }
    render(<ScoreCard {...props} />)
    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText(/excellent match/i)).toBeInTheDocument()
  })
})
```

**Run Tests:**
```bash
npm install --save-dev @testing-library/react jest
npm test
```

---

## Performance Testing

### Load Testing

Use Apache JMeter or K6:

```javascript
// load-test.js (K6)
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const response = http.get('http://localhost:8000/health');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

**Run:**
```bash
k6 run load-test.js
```

### Response Time Benchmarks

| Endpoint | Target | Acceptable |
|----------|--------|-----------|
| `/health` | <100ms | <200ms |
| `/analyze` (1MB PDF) | <5s | <10s |
| `/extract-text` | <2s | <5s |
| `/skills-gap` | <3s | <6s |

---

## Edge Cases to Test

1. **Large Files**
   - Upload 10MB PDF (should fail)
   - Upload 5MB PDF (should succeed)

2. **Empty/Invalid Content**
   - Resume with no text
   - Job description with only spaces
   - Corrupted PDF file

3. **Special Characters**
   - Résumé with accents
   - Multiple languages in resume
   - Special symbols and formatting

4. **Network Issues**
   - Slow uploads (simulate with throttling)
   - Connection timeout during analysis
   - Slow API responses

5. **Concurrent Requests**
   - Multiple users analyzing simultaneously
   - Same user uploading multiple resumes
   - Rapid requests to same endpoint

---

## Deployment Testing Checklist

Before production deployment:

- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Load testing completed
- [ ] Backend health check responsive
- [ ] Frontend loads without errors
- [ ] Resume upload works
- [ ] Analysis completes in <10s
- [ ] Skill extraction accurate
- [ ] Roadmap generates properly
- [ ] Error handling tested
- [ ] CORS configuration verified
- [ ] Environment variables set
- [ ] Database connections stable
- [ ] Monitoring/alerts configured

---

## Quick Test Summary

**✅ Must Pass Before Deployment:**
1. Health endpoint responds
2. Can upload and analyze resume
3. Receives valid score (0-100)
4. Gets missing skills list
5. Gets learning roadmap
6. Frontend connects to API
7. No console errors
8. Response time < 10 seconds

**Time Estimate:** 30-45 minutes for full test suite
