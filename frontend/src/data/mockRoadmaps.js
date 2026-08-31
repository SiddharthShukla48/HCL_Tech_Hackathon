export const mockRoadmapList = [
  {
    id: "roadmap_001",
    title: "Data Analysis with SQL & Python",
    shortDescription: "A beginner-friendly path to become job-ready in data analysis.",
    progressPercent: 0,
    completed: false,
    durationWeeks: 8,
    skillTags: ["SQL", "Python"]
  }
];

export const mockRoadmapDetail = {
  id: "roadmap_001",
  title: "Data Analysis with SQL & Python",
  description: "Full description here...",
  durationWeeks: 8,
  skillTags: ["SQL", "Python", "Pandas"],
  prerequisites: ["Basic computer literacy", "High school math"],
  milestonesOverview: [
    "Query relational databases confidently",
    "Clean and analyze data with Pandas",
    "Build your first dashboard"
  ],
  steps: [
    {
      id: "step_1",
      title: "SQL Fundamentals",
      durationWeeks: 2,
      description: "Learn SELECT, JOIN, and aggregate queries.",
      skillsGained: ["SQL basics", "Joins"],
      subtopics: ["SELECT statements", "WHERE & filtering", "JOINs", "GROUP BY"],
      completed: true
    }
  ],
  resources: [
    { id: "res_1", title: "SQL for Data Analysis", description: "Hands-on SQL course.", type: "course", link: "https://...", completed: false },
    { id: "res_2", title: "Practical SQL", description: "Book for beginners.", type: "book", link: "https://...", completed: false }
  ]
};
