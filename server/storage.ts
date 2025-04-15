import { 
  users, User, InsertUser, 
  stations, Station, InsertStation,
  reports, Report, InsertReport,
  favorites, Favorite, InsertFavorite,
  StationWithStats
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User | undefined>;
  
  // Station operations
  getStations(): Promise<Station[]>;
  getStation(id: number): Promise<Station | undefined>;
  getStationsNearby(lat: number, lng: number, radiusKm: number): Promise<Station[]>;
  createStation(station: InsertStation): Promise<Station>;
  updateStationStatus(id: number, status: string): Promise<Station | undefined>;
  
  // Report operations
  getReports(stationId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
  // Favorite operations
  getFavorites(userId: number): Promise<Favorite[]>;
  getFavoriteStations(userId: number): Promise<Station[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(userId: number, stationId: number): Promise<boolean>;
  
  // Analytics
  getStationWithStats(id: number, userId?: number): Promise<StationWithStats | undefined>;
  getAllStationsWithStats(userId?: number): Promise<StationWithStats[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stations: Map<number, Station>;
  private reports: Map<number, Report[]>;
  private favorites: Map<number, Favorite[]>;
  private currentUserId: number;
  private currentStationId: number;
  private currentReportId: number;
  private currentFavoriteId: number;

  constructor() {
    this.users = new Map();
    this.stations = new Map();
    this.reports = new Map();
    this.favorites = new Map();
    this.currentUserId = 1;
    this.currentStationId = 1;
    this.currentReportId = 1;
    this.currentFavoriteId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, points: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    user.points += points;
    this.users.set(userId, user);
    return user;
  }

  // Station operations
  async getStations(): Promise<Station[]> {
    return Array.from(this.stations.values());
  }

  async getStation(id: number): Promise<Station | undefined> {
    return this.stations.get(id);
  }

  async getStationsNearby(lat: number, lng: number, radiusKm: number): Promise<Station[]> {
    // Simple calculation for nearby stations based on latitude/longitude
    return Array.from(this.stations.values()).filter(station => {
      const distance = this.calculateDistance(
        lat, lng, 
        station.latitude, station.longitude
      );
      return distance <= radiusKm;
    });
  }

  async createStation(insertStation: InsertStation): Promise<Station> {
    const id = this.currentStationId++;
    const now = new Date();
    const station: Station = { 
      ...insertStation, 
      id,
      createdAt: now,
      lastUpdated: now
    };
    this.stations.set(id, station);
    return station;
  }

  async updateStationStatus(id: number, status: string): Promise<Station | undefined> {
    const station = this.stations.get(id);
    if (!station) return undefined;
    
    station.status = status;
    station.lastUpdated = new Date();
    this.stations.set(id, station);
    return station;
  }

  // Report operations
  async getReports(stationId: number): Promise<Report[]> {
    return this.reports.get(stationId) || [];
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const now = new Date();
    const report: Report = { ...insertReport, id, timestamp: now };
    
    const stationReports = this.reports.get(report.stationId) || [];
    stationReports.push(report);
    this.reports.set(report.stationId, stationReports);
    
    // Update station status based on report
    await this.updateStationStatus(report.stationId, report.status);
    
    return report;
  }

  // Favorite operations
  async getFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .flat()
      .filter(fav => fav.userId === userId);
  }

  async getFavoriteStations(userId: number): Promise<Station[]> {
    const userFavorites = await this.getFavorites(userId);
    return userFavorites.map(fav => {
      const station = this.stations.get(fav.stationId);
      return station!;
    }).filter(Boolean);
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = { ...insertFavorite, id };
    
    const userFavorites = this.favorites.get(favorite.userId) || [];
    
    // Check if favorite already exists
    const exists = userFavorites.some(fav => 
      fav.stationId === favorite.stationId && fav.userId === favorite.userId
    );
    
    if (!exists) {
      userFavorites.push(favorite);
      this.favorites.set(favorite.userId, userFavorites);
    }
    
    return favorite;
  }

  async deleteFavorite(userId: number, stationId: number): Promise<boolean> {
    const userFavorites = this.favorites.get(userId) || [];
    const filteredFavorites = userFavorites.filter(
      fav => fav.stationId !== stationId
    );
    
    if (filteredFavorites.length === userFavorites.length) {
      return false; // Nothing was removed
    }
    
    this.favorites.set(userId, filteredFavorites);
    return true;
  }

  // Analytics and stats
  async getStationWithStats(id: number, userId?: number): Promise<StationWithStats | undefined> {
    const station = this.stations.get(id);
    if (!station) return undefined;
    
    const stationReports = this.reports.get(id) || [];
    
    // Calculate stats
    const rating = this.calculateAverageRating(stationReports);
    const availability = this.calculateAvailability(stationReports);
    const reliability = this.calculateReliability(stationReports);
    
    // Check if favorited by user
    let isFavorite = false;
    if (userId) {
      const userFavorites = this.favorites.get(userId) || [];
      isFavorite = userFavorites.some(fav => fav.stationId === id);
    }
    
    // Get detailed reports with user info
    const detailedReports = stationReports
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)
      .map(report => {
        const user = this.users.get(report.userId);
        return { ...report, user: user! };
      });
    
    // Format last reported time
    const lastReported = stationReports.length > 0 
      ? this.formatTimeSince(stationReports[0].timestamp)
      : "No reports yet";
    
    return {
      ...station,
      rating,
      reviewCount: stationReports.length,
      availability,
      reliability,
      isFavorite,
      reports: detailedReports,
      lastReported
    };
  }

  async getAllStationsWithStats(userId?: number): Promise<StationWithStats[]> {
    const stationIds = Array.from(this.stations.keys());
    const stationsWithStats = await Promise.all(
      stationIds.map(id => this.getStationWithStats(id, userId))
    );
    
    return stationsWithStats.filter(Boolean) as StationWithStats[];
  }

  // Helper methods
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  }
  
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  private calculateAverageRating(reports: Report[]): number {
    if (reports.length === 0) return 0;
    const sum = reports.reduce((acc, report) => acc + report.rating, 0);
    return parseFloat((sum / reports.length).toFixed(1));
  }
  
  private calculateAvailability(reports: Report[]): number {
    if (reports.length === 0) return 50; // Default availability
    
    // Get recent reports (last 24 hours)
    const recentReports = reports.filter(r => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return r.timestamp > yesterday;
    });
    
    if (recentReports.length === 0) return 70; // Default if no recent reports
    
    // Calculate availability based on status
    const availableCount = recentReports.filter(r => r.status === 'available').length;
    const busyCount = recentReports.filter(r => r.status === 'busy').length;
    
    // Weight: available = 100%, busy = 50%, unavailable = 0%
    const availability = (
      (availableCount * 100) + 
      (busyCount * 50)
    ) / recentReports.length;
    
    return Math.round(availability);
  }
  
  private calculateReliability(reports: Report[]): number {
    if (reports.length < 3) return 80; // Default reliability
    
    // Factors affecting reliability:
    // 1. Consistent status reports
    // 2. Higher average ratings
    // 3. Fewer reported issues
    
    const avgRating = this.calculateAverageRating(reports);
    const ratingFactor = avgRating * 10; // Scale from 0-50
    
    // Check consistency of status reports
    const statusCounts = reports.reduce((acc: Record<string, number>, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});
    
    const totalReports = reports.length;
    const mostCommonStatusCount = Math.max(...Object.values(statusCounts));
    const consistencyFactor = (mostCommonStatusCount / totalReports) * 50;
    
    // Calculate reliability score
    const reliability = Math.min(100, ratingFactor + consistencyFactor);
    return Math.round(reliability);
  }
  
  private formatTimeSince(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  }
  
  private initializeDemoData() {
    // Create demo users
    const user1: InsertUser = {
      username: "sarah_ev",
      password: "password123",
      email: "sarah@example.com",
      profileImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=50&h=50&q=80"
    };
    
    const user2: InsertUser = {
      username: "khalid_m",
      password: "password123",
      email: "khalid@example.com",
      profileImage: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=50&h=50&q=80"
    };
    
    const user3: InsertUser = {
      username: "amal_z",
      password: "password123",
      email: "amal@example.com",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80"
    };
    
    // Create and store users
    const createdUser1 = { ...user1, id: this.currentUserId++, points: 120 };
    const createdUser2 = { ...user2, id: this.currentUserId++, points: 85 };
    const createdUser3 = { ...user3, id: this.currentUserId++, points: 240 };
    
    this.users.set(createdUser1.id, createdUser1);
    this.users.set(createdUser2.id, createdUser2);
    this.users.set(createdUser3.id, createdUser3);
    
    // Create demo stations
    const riyadhStation: InsertStation = {
      name: "Riyadh Central EV Station",
      address: "King Fahd Rd, Riyadh 12344",
      latitude: 24.7136,
      longitude: 46.6753,
      chargerType: "CCS / Type 2",
      powerOutput: 150,
      hours: "24/7",
      price: "0.75 SAR/kWh",
      amenities: ["WiFi", "Café", "Restroom", "Shopping"],
      status: "available",
      createdBy: createdUser1.id
    };
    
    const jeddahStation: InsertStation = {
      name: "Jeddah Mall Charging Hub",
      address: "Corniche Rd, Jeddah 23521",
      latitude: 21.5433,
      longitude: 39.1728,
      chargerType: "Tesla / CCS",
      powerOutput: 250,
      hours: "10 AM - 12 AM",
      price: "0.85 SAR/kWh",
      amenities: ["WiFi", "Café", "Restroom", "Shopping"],
      status: "busy",
      createdBy: createdUser2.id
    };
    
    const madinahStation: InsertStation = {
      name: "Al Madinah EV Station",
      address: "King Fahd Rd, Al Madinah 42351",
      latitude: 24.4672,
      longitude: 39.6151,
      chargerType: "CCS / CHAdeMO",
      powerOutput: 150,
      hours: "24/7",
      price: "0.75 SAR/kWh",
      amenities: ["WiFi", "Café", "Restroom"],
      status: "available",
      createdBy: createdUser3.id
    };
    
    // Create and store stations
    const now = new Date();
    const dayAgo = new Date(now);
    dayAgo.setDate(dayAgo.getDate() - 1);
    
    const createdRiyadhStation: Station = {
      ...riyadhStation,
      id: this.currentStationId++,
      createdAt: dayAgo,
      lastUpdated: now
    };
    
    const createdJeddahStation: Station = {
      ...jeddahStation,
      id: this.currentStationId++,
      createdAt: dayAgo,
      lastUpdated: now
    };
    
    const createdMadinahStation: Station = {
      ...madinahStation,
      id: this.currentStationId++,
      createdAt: dayAgo,
      lastUpdated: now
    };
    
    this.stations.set(createdRiyadhStation.id, createdRiyadhStation);
    this.stations.set(createdJeddahStation.id, createdJeddahStation);
    this.stations.set(createdMadinahStation.id, createdMadinahStation);
    
    // Create demo reports
    const riyadhReports: InsertReport[] = [
      {
        stationId: createdRiyadhStation.id,
        userId: createdUser1.id,
        status: "available",
        rating: 5,
        comment: "Great experience, all chargers working perfectly!",
        issues: []
      },
      {
        stationId: createdRiyadhStation.id,
        userId: createdUser2.id,
        status: "available",
        rating: 4,
        comment: "Good location, but could use more chargers during peak hours.",
        issues: []
      }
    ];
    
    const jeddahReports: InsertReport[] = [
      {
        stationId: createdJeddahStation.id,
        userId: createdUser3.id,
        status: "busy",
        rating: 3,
        comment: "Always busy in the evenings. Had to wait 20 minutes.",
        issues: ["Wait time"]
      },
      {
        stationId: createdJeddahStation.id,
        userId: createdUser1.id,
        status: "busy",
        rating: 4,
        comment: "Nice location with good amenities but gets busy.",
        issues: []
      }
    ];
    
    const madinahReports: InsertReport[] = [
      {
        stationId: createdMadinahStation.id,
        userId: createdUser1.id,
        status: "available",
        rating: 5,
        comment: "Working great. All chargers operational and the café has a nice selection of snacks.",
        issues: []
      },
      {
        stationId: createdMadinahStation.id,
        userId: createdUser2.id,
        status: "available",
        rating: 3,
        comment: "One charger was out of order. Staff were helpful but it took a while to get started.",
        issues: ["Out of service"]
      }
    ];
    
    // Create and store reports
    const processReports = (reportsData: InsertReport[]) => {
      const processedReports: Report[] = [];
      
      reportsData.forEach((report, index) => {
        const timeOffset = index * 2; // hours ago
        const reportTime = new Date();
        reportTime.setHours(reportTime.getHours() - timeOffset);
        
        const createdReport: Report = {
          ...report,
          id: this.currentReportId++,
          timestamp: reportTime
        };
        
        processedReports.push(createdReport);
      });
      
      return processedReports;
    };
    
    this.reports.set(createdRiyadhStation.id, processReports(riyadhReports));
    this.reports.set(createdJeddahStation.id, processReports(jeddahReports));
    this.reports.set(createdMadinahStation.id, processReports(madinahReports));
    
    // Create some favorites
    const userFavorites: InsertFavorite[] = [
      {
        userId: createdUser1.id,
        stationId: createdMadinahStation.id
      },
      {
        userId: createdUser2.id,
        stationId: createdRiyadhStation.id
      }
    ];
    
    // Store favorites
    userFavorites.forEach(fav => {
      const favorite: Favorite = {
        ...fav,
        id: this.currentFavoriteId++
      };
      
      const userFavs = this.favorites.get(favorite.userId) || [];
      userFavs.push(favorite);
      this.favorites.set(favorite.userId, userFavs);
    });
  }
}

export const storage = new MemStorage();
