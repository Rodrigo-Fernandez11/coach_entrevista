import { PrismaClient } from "../app/generated/prisma/client";
import type { QuestionCategory, QuestionLevel } from "../app/generated/prisma/enums";

const prisma = new PrismaClient();

interface QuestionSeed {
  text: string;
  category: QuestionCategory;
  level: QuestionLevel;
  roleTag: string;
}

const questions: QuestionSeed[] = [
  // ── Behavioral · Junior ──────────────────────────────────
  {
    text: "Tell me about a time you had to learn a new technology quickly. What was your approach?",
    category: "behavioral",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a situation where you made a mistake on a project. How did you handle it?",
    category: "behavioral",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you worked on a team project. What was your role?",
    category: "behavioral",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a time when you had to meet a tight deadline. What did you do?",
    category: "behavioral",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you received critical feedback from a mentor or senior developer. How did you respond?",
    category: "behavioral",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a challenging bug you encountered in a personal or academic project. How did you debug it?",
    category: "behavioral",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you had to explain a technical concept to someone non-technical.",
    category: "behavioral",
    level: "junior",
    roleTag: "software-engineer",
  },

  // ── Behavioral · Mid ──────────────────────────────────────
  {
    text: "Tell me about a time you improved a process or codebase that had significant technical debt.",
    category: "behavioral",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a time you disagreed with a technical decision made by your team. How did you handle it?",
    category: "behavioral",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you mentored a junior developer or helped a colleague grow their skills.",
    category: "behavioral",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a situation where you had to balance multiple competing priorities. What did you do?",
    category: "behavioral",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you took ownership of a problem that wasn't strictly your responsibility.",
    category: "behavioral",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a time when a project you were leading went off track. What actions did you take?",
    category: "behavioral",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you had to advocate for a technical decision to non-technical stakeholders.",
    category: "behavioral",
    level: "mid",
    roleTag: "software-engineer",
  },

  // ── Behavioral · Senior ───────────────────────────────────
  {
    text: "Tell me about a time you drove a significant architectural change in a production system.",
    category: "behavioral",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a time you had to make a high-stakes technical decision with incomplete information.",
    category: "behavioral",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you influenced engineering culture or established best practices across a team.",
    category: "behavioral",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a situation where you had to push back on a product requirement due to technical constraints.",
    category: "behavioral",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you dealt with a major production incident. What was your role and what did you learn?",
    category: "behavioral",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Describe a time you hired or grew a team member significantly. What approach did you take?",
    category: "behavioral",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Tell me about a time you had to balance engineering excellence with shipping speed. What tradeoffs did you make?",
    category: "behavioral",
    level: "senior",
    roleTag: "software-engineer",
  },

  // ── Technical · Junior ────────────────────────────────────
  {
    text: "Explain the difference between `var`, `let`, and `const` in JavaScript and when you'd use each.",
    category: "technical",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "What is the difference between REST and GraphQL? When would you choose one over the other?",
    category: "technical",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Explain how the event loop works in JavaScript.",
    category: "technical",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "What is a Promise and how does `async/await` relate to it?",
    category: "technical",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Explain the difference between SQL and NoSQL databases. Give an example of when you'd use each.",
    category: "technical",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "What is version control and why is it important? Describe a typical Git workflow.",
    category: "technical",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "What is the difference between `null` and `undefined` in JavaScript?",
    category: "technical",
    level: "junior",
    roleTag: "software-engineer",
  },

  // ── Technical · Mid ───────────────────────────────────────
  {
    text: "Explain the CAP theorem and describe a system design decision that depended on it.",
    category: "technical",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "What is the difference between optimistic and pessimistic locking? When would you use each?",
    category: "technical",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Describe how you would design a caching strategy for a read-heavy API endpoint.",
    category: "technical",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Explain the SOLID principles. Give an example of how you've applied one of them in your work.",
    category: "technical",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "What is a database index? Explain the tradeoffs of adding an index to a table.",
    category: "technical",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Describe the difference between horizontal and vertical scaling. When would you choose each?",
    category: "technical",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "What is idempotency and why is it important in API design? Give an example.",
    category: "technical",
    level: "mid",
    roleTag: "software-engineer",
  },

  // ── Technical · Senior ────────────────────────────────────
  {
    text: "Design a system that handles 1 million requests per second for a URL shortener. Walk me through your architecture.",
    category: "technical",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Explain event sourcing and CQRS. When would you recommend this pattern and what are the tradeoffs?",
    category: "technical",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "How would you design a distributed rate limiter that works across multiple servers?",
    category: "technical",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Explain the tradeoffs between microservices and a monolith. In what scenarios would you recommend each?",
    category: "technical",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "How would you approach migrating a large PostgreSQL table with zero downtime?",
    category: "technical",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Describe how you would implement observability (logging, metrics, tracing) for a distributed system.",
    category: "technical",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Explain how you would design a multi-tenant SaaS architecture with data isolation requirements.",
    category: "technical",
    level: "senior",
    roleTag: "software-engineer",
  },

  // ── Situational · Junior ──────────────────────────────────
  {
    text: "Your code review has 10 comments and you're unsure how to address three of them. What do you do?",
    category: "situational",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "You've been assigned a task but realize mid-way through that the requirements are unclear. What do you do?",
    category: "situational",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "You find a bug in production that you introduced. Your team lead is in a meeting. What is your next step?",
    category: "situational",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "A colleague asks you to review their PR but you're working on an urgent task yourself. How do you handle this?",
    category: "situational",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "You're asked to estimate a task but you've never done anything like it before. How do you approach the estimate?",
    category: "situational",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "You're pair-programming with a senior developer who uses an approach you've never seen. What do you do?",
    category: "situational",
    level: "junior",
    roleTag: "software-engineer",
  },
  {
    text: "Your local environment keeps crashing and blocking your work. What steps do you take?",
    category: "situational",
    level: "junior",
    roleTag: "software-engineer",
  },

  // ── Situational · Mid ─────────────────────────────────────
  {
    text: "You discover that a feature shipped last week has a critical security vulnerability. What do you do?",
    category: "situational",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Your team is behind on a sprint and the PM wants to cut scope. How do you facilitate that conversation?",
    category: "situational",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "A new engineer on your team is struggling with onboarding. How do you support them?",
    category: "situational",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "You're asked to add a feature to a codebase that has no tests. How do you approach it?",
    category: "situational",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "Two senior engineers on your team have a heated disagreement about the technical approach for a feature. You're the tech lead. What do you do?",
    category: "situational",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "You're asked to reduce the p99 latency of an endpoint from 2 seconds to 200ms. Walk me through your process.",
    category: "situational",
    level: "mid",
    roleTag: "software-engineer",
  },
  {
    text: "A third-party API your feature depends on is suddenly deprecated. You have two weeks to ship. What do you do?",
    category: "situational",
    level: "mid",
    roleTag: "software-engineer",
  },

  // ── Situational · Senior ──────────────────────────────────
  {
    text: "Your engineering team wants to rewrite the core system from scratch. The business wants new features. How do you navigate this?",
    category: "situational",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "You've been told to cut the infrastructure bill by 40% without degrading reliability. What's your plan?",
    category: "situational",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "A key engineer on your team has given notice and leaves in two weeks. You have critical projects in-flight. What do you do?",
    category: "situational",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "The CTO asks you to evaluate whether to adopt a new framework for the next major project. How do you structure your evaluation?",
    category: "situational",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "Your team's deployment pipeline has become a bottleneck — releases take 90 minutes and fail 30% of the time. What do you do?",
    category: "situational",
    level: "senior",
    roleTag: "software-engineer",
  },
  {
    text: "You're onboarding as the new engineering manager of a team with low morale and high turnover. What are your first 90 days?",
    category: "situational",
    level: "senior",
    roleTag: "software-engineer",
  },
];

async function main() {
  console.log(`Seeding ${questions.length} questions…`);

  // Clear existing questions to avoid duplicates on re-seed
  await prisma.question.deleteMany();

  const result = await prisma.question.createMany({
    data: questions,
    skipDuplicates: true,
  });

  const total = await prisma.question.count();

  console.log(`Created ${result.count} questions. Total in DB: ${total}`);

  if (total < 50) {
    throw new Error(`Seed failed: expected ≥ 50 questions, got ${total}`);
  }

  console.log("Seed complete!");

  // Distribution report
  const byCategory = await prisma.question.groupBy({
    by: ["category"],
    _count: true,
  });
  const byLevel = await prisma.question.groupBy({
    by: ["level"],
    _count: true,
  });

  console.log("\nDistribution by category:");
  byCategory.forEach((r: { category: string; _count: number }) =>
    console.log(`  ${r.category}: ${r._count}`)
  );

  console.log("\nDistribution by level:");
  byLevel.forEach((r: { level: string; _count: number }) =>
    console.log(`  ${r.level}: ${r._count}`)
  );
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
