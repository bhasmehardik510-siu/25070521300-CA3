import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq, or } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: any;
  firebaseUser?: DecodedIdToken;
}

export const authenticateRequest = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers['x-user-id'] as string;

  try {
    // 1. Direct user-id header (convenient for prototype & fast switching)
    if (userIdHeader) {
      const matched = await db.select().from(users).where(eq(users.id, userIdHeader)).limit(1);
      if (matched.length > 0) {
        req.user = matched[0];
        return next();
      }
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1].trim();

      // Check if it's a direct user ID from our database first
      const directUser = await db.select().from(users).where(eq(users.id, token)).limit(1);
      if (directUser.length > 0) {
        req.user = directUser[0];
        return next();
      }

      // Try verifying with Firebase ID token
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        req.firebaseUser = decodedToken;

        // Find or link user by uid or email
        const userMatches = await db
          .select()
          .from(users)
          .where(or(eq(users.uid, decodedToken.uid), eq(users.email, decodedToken.email || '')))
          .limit(1);

        if (userMatches.length > 0) {
          req.user = userMatches[0];
        } else {
          // Auto create user from Google profile
          const newUserId = `usr-${decodedToken.uid.substring(0, 10)}`;
          const inserted = await db
            .insert(users)
            .values({
              id: newUserId,
              uid: decodedToken.uid,
              email: decodedToken.email || `${decodedToken.uid}@alumni.edu`,
              name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Alumni Member',
              avatarUrl: decodedToken.picture,
              role: 'STUDENT', // Default to student unless matched/updated
            })
            .returning();
          req.user = inserted[0];
        }
        return next();
      } catch {
        // Not a valid Firebase token; continue to next
      }
    }
  } catch (error) {
    console.error('Error during authentication middleware:', error);
  }

  next();
};

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Authentication required.' });
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Access denied: Administrator privileges required.' });
  }
  next();
};
