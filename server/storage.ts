import { users, jobs, applications, type User, type InsertUser, type Job, type InsertJob, type Application, type InsertApplication } from "@shared/schema";
import { db, pool } from "./db";
import { eq, ilike, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createJob(job: InsertJob): Promise<Job>;
  getJobs(filters?: { search?: string, location?: string, type?: string }): Promise<(Job & { company: { name: string } })[]>;
  getJob(id: number): Promise<(Job & { company: { name: string } }) | undefined>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<void>;

  createApplication(app: InsertApplication): Promise<Application>;
  getApplicationsByJobId(jobId: number): Promise<(Application & { candidate: User })[]>;
  getApplicationsByCandidateId(candidateId: number): Promise<(Application & { job: Job & { company: { name: string } } })[]>;
  getApplicationsByCompanyId(companyId: number): Promise<(Application & { job: Job, candidate: User })[]>;
  updateApplicationStatus(id: number, status: Application['status']): Promise<Application>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async getJobs(filters?: { search?: string, location?: string, type?: string }): Promise<(Job & { company: { name: string } })[]> {
    const query = db.select({
      id: jobs.id,
      companyId: jobs.companyId,
      title: jobs.title,
      description: jobs.description,
      requirements: jobs.requirements,
      location: jobs.location,
      salaryRange: jobs.salaryRange,
      type: jobs.type,
      createdAt: jobs.createdAt,
      company: {
        name: users.name,
      }
    })
    .from(jobs)
    .innerJoin(users, eq(jobs.companyId, users.id));

    const conditions = [];
    if (filters?.search) {
      conditions.push(ilike(jobs.title, `%${filters.search}%`));
    }
    if (filters?.location) {
      conditions.push(ilike(jobs.location, `%${filters.location}%`));
    }
    if (filters?.type) {
      conditions.push(eq(jobs.type, filters.type));
    }

    if (conditions.length > 0) {
      // @ts-ignore
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async getJob(id: number): Promise<(Job & { company: { name: string } }) | undefined> {
    const [job] = await db.select({
      id: jobs.id,
      companyId: jobs.companyId,
      title: jobs.title,
      description: jobs.description,
      requirements: jobs.requirements,
      location: jobs.location,
      salaryRange: jobs.salaryRange,
      type: jobs.type,
      createdAt: jobs.createdAt,
      company: {
        name: users.name,
      }
    })
    .from(jobs)
    .innerJoin(users, eq(jobs.companyId, users.id))
    .where(eq(jobs.id, id));
    return job;
  }

  async updateJob(id: number, update: Partial<InsertJob>): Promise<Job> {
    const [job] = await db.update(jobs).set(update).where(eq(jobs.id, id)).returning();
    return job;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  async createApplication(insertApp: InsertApplication): Promise<Application> {
    const [app] = await db.insert(applications).values(insertApp).returning();
    return app;
  }

  async getApplicationsByJobId(jobId: number): Promise<(Application & { candidate: User })[]> {
    return await db.select({
        id: applications.id,
        jobId: applications.jobId,
        candidateId: applications.candidateId,
        status: applications.status,
        coverLetter: applications.coverLetter,
        createdAt: applications.createdAt,
        candidate: users,
      })
      .from(applications)
      .innerJoin(users, eq(applications.candidateId, users.id))
      .where(eq(applications.jobId, jobId));
  }

  async getApplicationsByCandidateId(candidateId: number): Promise<(Application & { job: Job & { company: { name: string } } })[]> {
    const apps = await db.select({
      application: applications,
      job: jobs,
      companyName: users.name
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(users, eq(jobs.companyId, users.id))
    .where(eq(applications.candidateId, candidateId));

    return apps.map(row => ({
      ...row.application,
      job: {
        ...row.job,
        company: { name: row.companyName }
      }
    }));
  }

  async getApplicationsByCompanyId(companyId: number): Promise<(Application & { job: Job, candidate: User })[]> {
    const apps = await db.select({
      application: applications,
      job: jobs,
      candidate: users
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(users, eq(applications.candidateId, users.id))
    .where(eq(jobs.companyId, companyId));

    return apps.map(row => ({
      ...row.application,
      job: row.job,
      candidate: row.candidate
    }));
  }

  async updateApplicationStatus(id: number, status: Application['status']): Promise<Application> {
    const [app] = await db.update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return app;
  }
}

export const storage = new DatabaseStorage();
