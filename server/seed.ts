import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seed() {
  const existingUser = await storage.getUserByUsername("company");
  if (existingUser) return;

  const password = await hashPassword("password123");

  const company = await storage.createUser({
    username: "company",
    password,
    role: "company",
    name: "TechCorp Solutions",
    email: "hr@techcorp.com",
    bio: "Leading innovator in software solutions.",
  });

  const candidate = await storage.createUser({
    username: "candidate",
    password,
    role: "candidate",
    name: "Jane Doe",
    email: "jane@example.com",
    bio: "Full stack developer with 5 years experience.",
  });

  const job1 = await storage.createJob({
    companyId: company.id,
    title: "Senior React Developer",
    description: "We are looking for an expert in React and Node.js.",
    requirements: "- 5+ years experience\n- React, Redux, Node.js\n- TypeScript",
    location: "Remote",
    salaryRange: "$120k - $150k",
    type: "Full-time",
  });

  const job2 = await storage.createJob({
    companyId: company.id,
    title: "Backend Engineer",
    description: "Join our backend team to build scalable APIs.",
    requirements: "- Go or Rust experience\n- Distributed systems",
    location: "New York, NY",
    salaryRange: "$130k - $160k",
    type: "Full-time",
  });

  await storage.createApplication({
    jobId: job1.id,
    candidateId: candidate.id,
    coverLetter: "I am very interested in this role. Here is my resume...",
  });

  console.log("Database seeded!");
}
