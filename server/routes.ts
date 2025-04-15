import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertStationSchema,
  insertReportSchema,
  insertFavoriteSchema
} from "@shared/schema";
import { z } from "zod";

// Helper function to validate request body against schema
function validateRequest<T>(req: Request, schema: z.ZodType<T>): T | null {
  try {
    return schema.parse(req.body);
  } catch (error) {
    return null;
  }
}

// Helper function to extract user ID from session
function getUserId(req: Request): number | null {
  // In a real app, this would come from the session
  // For now, we'll use a hardcoded demo user ID
  return 1;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');

  // Station endpoints
  app.get('/api/stations', async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      const stations = await storage.getAllStationsWithStats(userId || undefined);
      res.json(stations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stations" });
    }
  });

  app.get('/api/stations/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid station ID" });
      }

      const userId = getUserId(req);
      const station = await storage.getStationWithStats(id, userId || undefined);

      if (!station) {
        return res.status(404).json({ message: "Station not found" });
      }

      res.json(station);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch station" });
    }
  });

  app.post('/api/stations', async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const stationData = validateRequest(req, insertStationSchema);
      if (!stationData) {
        return res.status(400).json({ message: "Invalid station data" });
      }

      // Add the current user as creator
      stationData.createdBy = userId;

      const newStation = await storage.createStation(stationData);
      
      // Award points for adding a new station
      await storage.updateUserPoints(userId, 50);

      res.status(201).json(newStation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create station" });
    }
  });

  // Nearby stations
  app.get('/api/stations/nearby', async (req: Request, res: Response) => {
    try {
      const latitude = parseFloat(req.query.lat as string);
      const longitude = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 10; // Default 10km

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }

      const stations = await storage.getStationsNearby(latitude, longitude, radius);
      
      const userId = getUserId(req);
      if (userId) {
        // Get stats for each station
        const stationsWithStats = await Promise.all(
          stations.map(station => storage.getStationWithStats(station.id, userId))
        );
        return res.json(stationsWithStats.filter(Boolean));
      }

      res.json(stations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nearby stations" });
    }
  });

  // Report endpoints
  app.get('/api/stations/:id/reports', async (req: Request, res: Response) => {
    try {
      const stationId = parseInt(req.params.id);
      if (isNaN(stationId)) {
        return res.status(400).json({ message: "Invalid station ID" });
      }

      const reports = await storage.getReports(stationId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post('/api/reports', async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const reportData = validateRequest(req, insertReportSchema);
      if (!reportData) {
        return res.status(400).json({ message: "Invalid report data" });
      }

      // Add the current user as reporter
      reportData.userId = userId;

      const newReport = await storage.createReport(reportData);
      
      // Award points for adding a report
      await storage.updateUserPoints(userId, 20);

      res.status(201).json(newReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Favorite endpoints
  app.get('/api/favorites', async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const favorites = await storage.getFavoriteStations(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const favoriteData = validateRequest(req, insertFavoriteSchema);
      if (!favoriteData) {
        return res.status(400).json({ message: "Invalid favorite data" });
      }

      // Add the current user
      favoriteData.userId = userId;

      const newFavorite = await storage.createFavorite(favoriteData);
      res.status(201).json(newFavorite);
    } catch (error) {
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:stationId', async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const stationId = parseInt(req.params.stationId);
      if (isNaN(stationId)) {
        return res.status(400).json({ message: "Invalid station ID" });
      }

      const success = await storage.deleteFavorite(userId, stationId);
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // User profile
  app.get('/api/user/profile', async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send password in response
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
