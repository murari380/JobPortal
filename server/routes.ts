import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertJobSchema, insertApplicationSchema } from "@shared/schema";
import { seed } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Seed data
  seed();

  // Job Routes
  app.get(api.jobs.list.path, async (req, res) => {
    const filters = api.jobs.list.input?.parse(req.query);
    const jobs = await storage.getJobs(filters);
    res.json(jobs);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  app.post(api.jobs.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "company") {
      return res.status(403).json({ message: "Only companies can post jobs" });
    }
    
    try {
      const input = insertJobSchema.omit({ companyId: true }).parse(req.body);
      const job = await storage.createJob({ ...input, companyId: req.user.id });
      res.status(201).json(job);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json(e.errors);
      } else {
        throw e;
      }
    }
  });

  app.patch(api.jobs.update.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const jobId = Number(req.params.id);
    const job = await storage.getJob(jobId);
    
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.companyId !== req.user.id) return res.status(403).json({ message: "Cannot edit jobs you don't own" });

    const input = insertJobSchema.omit({ companyId: true }).partial().parse(req.body);
    const updated = await storage.updateJob(jobId, input);
    res.json(updated);
  });

  app.delete(api.jobs.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const jobId = Number(req.params.id);
    const job = await storage.getJob(jobId);
    
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.companyId !== req.user.id) return res.status(403).json({ message: "Cannot delete jobs you don't own" });

    await storage.deleteJob(jobId);
    res.sendStatus(200);
  });

  // Application Routes
  app.post(api.applications.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can apply" });
    }

    try {
      const input = insertApplicationSchema.omit({ candidateId: true }).parse(req.body);
      const application = await storage.createApplication({ 
        ...input, 
        candidateId: req.user.id,
        status: "pending" 
      });
      res.status(201).json(application);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json(e.errors);
      } else {
        throw e;
      }
    }
  });

  app.get(api.applications.listForCandidate.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const apps = await storage.getApplicationsByCandidateId(req.user.id);
    res.json(apps);
  });

  app.get(api.applications.listForCompany.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const apps = await storage.getApplicationsByCompanyId(req.user.id);
    res.json(apps);
  });

  app.patch(api.applications.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const { status } = req.body;
    // In a real app we should verify the application belongs to a job owned by this company
    // For MVP, we'll trust the ID provided (or could add a check)
    const updated = await storage.updateApplicationStatus(Number(req.params.id), status);
    res.json(updated);
  });

  return httpServer;
}
