# AI-Powered Personalized Learning Path Recommender

An intelligent learning assistant that generates personalized, structured learning roadmaps based on a learner's goals, interests, and skill level. Built with React, FastAPI, Neo4j, and LLM-powered AI.

## Overview

This project delivers an end-to-end solution for personalized learning path recommendations. Learners engage through a conversational interface to describe their learning goals, and the system responds with a structured, milestone-based learning roadmap tailored to their needs.

### Problem Statement

Online learning platforms offer thousands of courses, but learners struggle to:
- Identify the right **sequence** of resources for their goals
- Account for **skill gaps** and prerequisites
- Find **personalized** recommendations based on their level and interests
- Understand **why** each recommendation matters
- **Adapt** as they progress

This solution bridges that gap by combining conversational AI, knowledge graphs, and intelligent recommendation logic.

---

## Key Features

✨ **Conversational Goal Parsing**
- Natural language interface to describe learning objectives
- AI-powered understanding of learner intent (via Groq LLM)
- Automatic skill gap identification

🎯 **Personalized Learning Paths**
- Structured roadmaps organized into milestones
- Prerequisite-aware step sequencing (topologically sorted)
- Domain-specific knowledge (Data Science, Web Development, and extensible)

📚 **Intelligent Resource Recommendation**
- Curated learning resources (courses, tutorials, projects) per topic
- Resource ranking by quality score, provider, and learner fit
- Multiple formats (video, article, project, assessment)

📊 **Progress Dashboard**
- Real-time learning progress tracking
- Skill distribution visualization
- Milestone completion status
- Recommended next actions

💡 **Explainable AI**
- Clear reasoning for each recommendation
- Prerequisite explanations
- Resource selection rationale
- Natural language descriptions of learning paths

---

## Architecture

### Tech Stack

**Frontend:**
- **React** (with Vite) - Modern, component-based UI
- **React Router** - Client-side navigation
- **TailwindCSS + DaisyUI** - Responsive, accessible styling
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Clean, consistent iconography

**Backend:**
- **FastAPI** (Python) - High-performance REST API
- **Uvicorn** - ASGI server
- **Neo4j** - Graph database for knowledge representation
- **Groq API** - LLM for goal parsing and path explanation
- **Python 3.11+** with `uv` for dependency management

**Knowledge Graph & Recommendation:**
- Neo4j knowledge graph stores topics, prerequisites, and resources
- Topological sorting for prerequisite-aware sequencing
- Kahn's algorithm for stable topic ordering
- LLM-based goal-to-domain mapping

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  React Frontend (Vite)                  │
│  ┌──────────────────┬──────────────────┬──────────────┐  │
│  │  Chat Interface  │  Roadmap Viewer  │  Dashboard   │  │
│  │  (Goal Input)    │  (Path Display)  │  (Progress)  │  │
│  └──────────────────┴──────────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                    REST API (JSON)
                           │
         ┌─────────────────────────────────────┐
         │      FastAPI Backend                │
         ├─────────────────────────────────────┤
         │  • /api/roadmaps                    │
         │  • /api/roadmaps/{id}               │
         │  • /api/chat/generate-roadmap       │
         │  • /api/dashboard                   │
         │  • /api/chat/question (clarify)     │
         └─────────────────────────────────────┘
                   │              │
          ┌────────┘              └────────┐
          │                                 │
    ┌─────────────┐                  ┌──────────────┐
    │  Neo4j KG   │                  │  Groq LLM    │
    │  (Topics,   │                  │  (Goal       │
    │   Prereqs,  │                  │   Parsing,   │
    │  Resources) │                  │   Explain)   │
    └─────────────┘                  └──────────────┘
```

---

## Project Structure

```
HCL_Tech_Hackathon/
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── App.jsx                   # Main app component & bootstrap
│   │   ├── main.jsx                  # React entry point
│   │   ├── index.css                 # Global styles
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Hero/welcome page
│   │   │   ├── Chat.jsx              # Chat interface for goal input
│   │   │   ├── Dashboard.jsx         # Learning progress dashboard
│   │   │   ├── Roadmaps.jsx          # List of generated roadmaps
│   │   │   └── RoadmapDetails.jsx    # Full roadmap with steps & resources
│   │   ├── components/
│   │   │   ├── ChatInput.jsx         # User input box in chat
│   │   │   ├── Header.jsx            # Navigation header
│   │   │   ├── Sidebar.jsx           # Collapsible navigation menu
│   │   │   ├── ThemeToggle.jsx       # Dark/light mode
│   │   │   ├── ThinkingLoader.jsx    # Loading animation
│   │   │   └── landing/              # Landing page sub-components
│   │   │       ├── Hero.jsx, Features.jsx, FAQs.jsx, etc.
│   │   ├── contexts/
│   │   │   └── RoadmapContext.jsx    # Global roadmap state management
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx         # Main app layout
│   │   │   └── HomeLayout.jsx        # Landing page layout
│   │   ├── services/
│   │   │   └── api.js                # Centralized API layer
│   │   └── data/
│   │       ├── mockRoadmaps.js       # (Legacy - not used in production)
│   │       ├── mockDashboard.js      # (Legacy - not used in production)
│   │       └── mockUser.js           # (Legacy - not used in production)
│   ├── vite.config.js                # Vite configuration
│   ├── package.json                  # Frontend dependencies
│   └── index.html                    # HTML entry point
│
├── backend/                           # FastAPI Python application
│   ├── main.py                       # FastAPI app entry point (uvicorn main:app)
│   ├── pyproject.toml                # Python dependencies
│   ├── src/
│   │   ├── main.py                   # FastAPI endpoints and bootstrap
│   │   ├── agents.py                 # AI logic: goal parsing, path generation
│   │   ├── kg.py                     # Neo4j knowledge graph queries
│   │   ├── ingest.py                 # (Data ingestion utilities)
│   │   ├── _check_neo4j.py           # (Neo4j connection test)
│   │   └── _check_groq.py            # (Groq API connection test)
│   ├── data/
│   │   ├── seed_topics.json          # Topic definitions & prerequisites
│   │   └── seed_resources.json       # Learning resources metadata
│   └── frontend/
│       └── app.py                    # (Legacy Streamlit prototype - deprecated)
│
└── README.md                          # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **Neo4j** running (local or cloud instance)
- **Groq API Key** (free tier available at https://console.groq.com)
- **uv** package manager (install via `pip install uv`)

### Environment Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd HCL_Tech_Hackathon/backend
   ```

2. Create a `.env` file with your credentials:
   ```env
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_password
   GROQ_API_KEY=your_groq_api_key
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

4. Seed the Neo4j database (one-time setup):
   ```bash
   uv run python3 src/ingest.py
   ```
   This loads topics, prerequisites, and resources from `data/seed_*.json`.

5. Start the FastAPI server:
   ```bash
   uv run uvicorn main:app --reload --port 8000
   ```
   Server runs at `http://localhost:8000`

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd HCL_Tech_Hackathon/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173` (or as displayed in terminal)

4. To build for production:
   ```bash
   npm run build
   ```
   Output goes to `frontend/dist/`

---

## How It Works

### 1. Learner Initiates a Goal
- User lands on the app and opens the **Chat** page
- They describe their goal in natural language: *"I want to learn web development"*, *"Teach me Python for data science"*, etc.

### 2. Conversational Clarification
- The system asks 2 clarifying questions:
  - *"What is your current skill level?"* (beginner/intermediate/advanced)
  - *"Are you more interested in a technical path, project-focused, or role-based?"*
- User responds to refine the recommendation

### 3. AI Goal Parsing
- The backend's `agents.parse_goal()` function:
  - Uses the **Groq LLM** to understand the learner's intent
  - Maps free-text input to specific domains and topics from the knowledge graph
  - Identifies skill gaps and prerequisites
  - Returns: `{domain: "Web Development", target_topic_ids: ["wd_html_css", ...]}`

### 4. Learning Path Generation
- `agents.generate_learning_path()` constructs a personalized roadmap:
  - Builds a domain-specific topic graph (topics + prerequisite edges)
  - Applies **topological sort** (Kahn's algorithm) to sequence topics
  - Filters by skill level and learner interests
  - Organizes into **milestones** (3 topics per milestone by default)
  - Retrieves top-3 curated resources per topic from Neo4j

### 5. Roadmap Display
- Roadmap is shown in the chat with a **"View Generated Roadmap"** link
- Users click through to see:
  - Milestone breakdowns
  - Step prerequisites and explanations
  - Recommended learning resources
  - Progress tracking per step

### 6. Progress Tracking
- Users mark steps and resources as complete
- Dashboard aggregates progress:
  - Overall completion percentage
  - Skills distribution
  - Recommended next actions

---

## API Endpoints

### Roadmap Endpoints

**GET `/api/roadmaps`**
- Returns list of all available roadmap domains and summaries
- Response:
  ```json
  [
    {
      "id": "data-science",
      "title": "Data Science",
      "shortDescription": "A structured learning path...",
      "durationWeeks": 14,
      "skillTags": ["Python Basics", "Statistics", "ML Fundamentals"],
      "progressPercent": 0,
      "completed": false
    }
  ]
  ```

**GET `/api/roadmaps/{roadmap_id}`**
- Returns full roadmap detail with milestones, steps, and resources
- Response:
  ```json
  {
    "id": "web-development",
    "domain": "Web Development",
    "title": "Web Development",
    "totalTopics": 7,
    "milestones": [
      {
        "id": "wd_milestone_1",
        "title": "Foundations",
        "steps": [
          {
            "id": "wd_html_css",
            "topic": {"id": "wd_html_css", "name": "HTML & CSS", ...},
            "prerequisites": [],
            "reason": "No prerequisites...",
            "resources": [
              {
                "id": "res_1",
                "title": "MDN Web Docs: HTML",
                "type": "documentation",
                "provider": "MDN",
                "rating": 4.9,
                "url": "https://developer.mozilla.org/...",
                "estHours": 12
              }
            ]
          }
        ]
      }
    ]
  }
  ```

### Chat Endpoints

**POST `/api/chat/generate-roadmap`**
- Generates a roadmap based on user goal
- Request:
  ```json
  {
    "message": "I want to learn web development"
  }
  ```
- Response:
  ```json
  {
    "role": "assistant",
    "type": "roadmap_summary",
    "content": "I've mapped out a personalized Web Development roadmap...",
    "roadmapId": "web-development"
  }
  ```

**POST `/api/chat/question`**
- Returns a clarifying question for the conversation flow
- Request:
  ```json
  {
    "step": 1
  }
  ```
- Response:
  ```json
  {
    "role": "assistant",
    "type": "question",
    "content": "What is your current skill level..."
  }
  ```

### Dashboard Endpoint

**GET `/api/dashboard`**
- Returns overall learning statistics and recommended actions
- Response:
  ```json
  {
    "overallProgressPercent": 15,
    "roadmapsCompleted": 0,
    "totalRoadmaps": 2,
    "skillDistribution": [
      {"skill": "Data Science", "level": 35},
      {"skill": "Web Development", "level": 42}
    ],
    "weeklyActivity": [
      {"week": "Week 1", "hoursSpent": 3},
      {"week": "Week 2", "hoursSpent": 5}
    ],
    "nextActions": [
      {"id": "ds-python", "text": "Complete 'Python Basics' in Data Science", "roadmapId": "data-science"}
    ]
  }
  ```

---

## Knowledge Graph Schema

The Neo4j knowledge graph models the learning domain:

### Node Types

**Topic**
- Properties: `id`, `name`, `domain`, `difficulty_level`, `description`
- Represents a single learning topic (e.g., "HTML & CSS", "Python Basics")

**Resource**
- Properties: `id`, `title`, `type`, `provider`, `rating`, `url`, `est_hours`, `difficulty`
- Represents a learning material (course, tutorial, project, assessment)

### Relationship Types

**PREREQUISITE_OF**
- Connects topics: `(Topic_A)-[:PREREQUISITE_OF]->(Topic_B)`
- Means: Topic_A must be learned before Topic_B

**TEACHES**
- Connects resources to topics: `(Resource)-[:TEACHES {score: float}]->(Topic)`
- Score indicates relevance/quality (higher = better)

### Example Domain: Web Development
```
Topics:
  - HTML & CSS (beginner)
  - JavaScript Basics (beginner)
  - Responsive Design (beginner)
  - Frontend Framework / React (intermediate)
  - Backend Basics / Node.js (intermediate)
  - Databases (intermediate)
  - Full-Stack Capstone Project (advanced)

Prerequisites:
  - HTML & CSS → JavaScript Basics
  - HTML & CSS → Responsive Design
  - JavaScript Basics → Frontend Framework
  - JavaScript Basics → Backend Basics
  - Backend Basics → Databases
  - Frontend Framework → Full-Stack Project
  - Databases → Full-Stack Project
```

---

## Key Components & Algorithms

### 1. Goal Parsing (`agents.parse_goal`)
**Algorithm:** LLM-based semantic matching
- Takes free-text user goal (e.g., "I want to build mobile apps")
- Passes list of all available topics + their names to Groq LLM
- LLM matches goal to specific domain and target topics
- Returns validated domain and topic IDs

**Why it works:** LLM understands natural language nuance without hard-coded rules.

### 2. Learning Path Generation (`agents.generate_learning_path`)
**Algorithm:** Topological sort with milestone grouping

1. **Build Domain Graph:**
   - Fetch all topics in the selected domain
   - Fetch prerequisite edges (PREREQUISITE_OF relationships)
   - Build adjacency lists (forward and reverse)

2. **Filter by Skill Level:**
   - Remove topics above learner's skill level
   - Remove completed topics (if available in profile)

3. **Topological Sort (Kahn's Algorithm):**
   - Compute in-degree for each topic
   - Process topics with in-degree 0 (no prerequisites)
   - Sort by difficulty level, then by name (stable ordering)
   - Add to output list and decrement dependent in-degrees
   - Repeat until all topics are ordered

4. **Group into Milestones:**
   - Chunk sorted topics into groups of 3 (configurable)
   - Each milestone represents a learning sprint

5. **Fetch Resources:**
   - For each topic, retrieve top-3 resources from Neo4j
   - Resources are pre-ranked by quality score at ingest time

**Why it works:** Topological sort ensures prerequisites are always taught before dependents. Stable sorting makes the path predictable and intuitive.

### 3. Explainability (`agents.explain_path_intro`, `agents.phrase_explanation`)
**Algorithm:** LLM-powered natural language generation
- Takes structured roadmap data (domain, topics, milestones)
- Generates human-friendly explanations
- Explains **why** each topic is important and **when** to learn it
- Uses resource metadata to justify recommendations

---

## How to Use the Application

### For Learners

1. **Start on Landing Page**
   - Explore features and FAQ
   - Click "Start Learning" to go to Chat

2. **Chat Interface**
   - Type your learning goal: *"I want to learn machine learning"*
   - Answer 2 clarifying questions to refine the recommendation
   - Review the personalized roadmap

3. **Roadmap Page**
   - View your generated roadmap with milestones
   - Click on a roadmap to see full details
   - Each step shows prerequisites and top resources

4. **Progress Tracking**
   - Check off completed steps and resources
   - Track overall progress on the Dashboard
   - See recommended next actions

5. **Dashboard**
   - View learning statistics and progress
   - See skill distribution and weekly activity
   - Identify gaps and recommended next steps

### Clearing State

- **Clear Chat:** Click "Clear Chat" button in the chat interface
  - Resets conversation history
  - Clears local browser state
  - Ready to start a new goal
- Note: Roadmaps are stored in app memory only (not persisted to storage)

---

## Extending the System

### Adding New Domains

1. **Update Seed Data** (`backend/data/seed_topics.json`):
   ```json
   {
     "id": "ml_fundamentals",
     "name": "ML Fundamentals",
     "domain": "Machine Learning",
     "difficulty_level": "intermediate",
     "description": "Core concepts in machine learning..."
   }
   ```

2. **Add Prerequisites** in `seed_topics.json`:
   ```json
   {
     "from": "ml_math_basics",
     "to": "ml_fundamentals"
   }
   ```

3. **Add Resources** (`backend/data/seed_resources.json`):
   ```json
   {
     "id": "res_ml_course",
     "title": "Machine Learning Specialization",
     "type": "course",
     "provider": "Coursera",
     "rating": 4.8,
     "url": "https://...",
     "est_hours": 60,
     "teaches": "ml_fundamentals"
   }
   ```

4. **Re-ingest** the data:
   ```bash
   uv run python3 src/ingest.py
   ```

### Customizing Milestone Size

Edit `backend/src/agents.py`:
```python
MILESTONE_SIZE = 5  # Change from 3 to 5 topics per milestone
```

### Adjusting LLM Temperature

Edit `backend/src/agents.py`:
```python
def _llm(system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
    # temperature=0.0 is deterministic, 1.0 is creative
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'backend'"
**Solution:** Run uvicorn from the `backend/` directory:
```bash
cd backend && uv run uvicorn main:app --reload --port 8000
```

### Issue: Neo4j Connection Failed
**Solution:** Verify credentials in `.env`:
```env
NEO4J_URI=bolt://localhost:7687  # Check host, port
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_actual_password
```

### Issue: Groq API Key Error
**Solution:** 
1. Generate a key at https://console.groq.com
2. Set `GROQ_API_KEY` in `.env`
3. Free tier has rate limits (~40 requests/day)

### Issue: Frontend shows 2 roadmaps on startup
**Solution:** Roadmaps now only load after a user generates one via chat. This is intentional.

### Issue: Same roadmap returned for different goals
**Solution:** Fixed! The app now preserves the original user goal through clarifying questions, ensuring correct domain mapping.

---

## Performance & Scaling Considerations

- **Caching:** Topics and prerequisites are fetched fresh per request (can be cached)
- **LLM Calls:** Each goal parsing and explanation is a Groq API call (rate limits apply)
- **Neo4j:** Graph queries are indexed on `Topic.id` and `Topic.domain`
- **Frontend State:** Roadmaps are stored in React Context (in-memory, lost on page refresh)

For production:
- Implement Redis caching for frequently accessed domains
- Add rate limiting to the FastAPI backend
- Cache LLM responses for common goals
- Persist user profiles and progress to a database

---

## Future Enhancements

🚀 **Planned Features**
- [ ] User authentication and persistent profiles
- [ ] Adaptive difficulty based on performance
- [ ] Real-time resource availability and reviews
- [ ] Integration with actual course platforms (Coursera, Udemy, etc.)
- [ ] Collaborative learning paths (team/cohort-based)
- [ ] Skill assessment quizzes before and after each milestone
- [ ] Spaced repetition recommendations
- [ ] Integration with learning calendars and schedules
- [ ] Multi-language support
- [ ] Mobile app version

---

## Contributing

To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is provided as-is for educational and hackathon purposes.

---

## Team & Acknowledgments

Built as a solution for the **HCL Tech Hackathon 2026**.

**Key Technologies:**
- React & Vite for modern frontend development
- FastAPI for high-performance backend
- Neo4j for intelligent knowledge representation
- Groq API for LLM-powered AI reasoning

---

## Contact & Support

For questions or issues:
- Check the **Troubleshooting** section above
- Review API documentation in this README
- Inspect backend logs: `uvicorn main:app --log-level debug`
- Check frontend console: DevTools → Console tab

---

**Happy Learning! 🎓**
