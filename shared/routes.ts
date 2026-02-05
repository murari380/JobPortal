import { z } from 'zod';
import { insertUserSchema, insertJobSchema, insertApplicationSchema, users, jobs, applications } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  jobs: {
    list: {
      method: 'GET' as const,
      path: '/api/jobs',
      input: z.object({
        search: z.string().optional(),
        location: z.string().optional(),
        type: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect & { company: { name: string } }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/jobs/:id',
      responses: {
        200: z.custom<typeof jobs.$inferSelect & { company: { name: string } }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/jobs',
      input: insertJobSchema.omit({ companyId: true }), // companyId comes from session
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/jobs/:id',
      input: insertJobSchema.omit({ companyId: true }).partial(),
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        403: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/jobs/:id',
      responses: {
        200: z.void(),
        403: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  applications: {
    create: {
      method: 'POST' as const,
      path: '/api/applications',
      input: insertApplicationSchema.omit({ candidateId: true }), // candidateId from session
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    listForCompany: {
      method: 'GET' as const,
      path: '/api/company/applications',
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect & { 
          job: typeof jobs.$inferSelect, 
          candidate: typeof users.$inferSelect 
        }>()),
      },
    },
    listForCandidate: {
      method: 'GET' as const,
      path: '/api/candidate/applications',
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect & { 
          job: typeof jobs.$inferSelect & { company: { name: string } }
        }>()),
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/applications/:id/status',
      input: z.object({ status: z.enum(["pending", "accepted", "rejected"]) }),
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        403: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
