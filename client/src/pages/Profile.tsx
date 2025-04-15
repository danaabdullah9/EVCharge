import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";

const Profile = () => {
  // Fetch user profile
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user/profile']
  });
  
  // Dummy achievement data (would come from backend in a real app)
  const achievements = [
    { name: "First Station", description: "Added your first charging station", completed: true },
    { name: "Power User", description: "Added 5 reports", completed: true },
    { name: "Explorer", description: "Visited 10 different stations", completed: false },
    { name: "Community Hero", description: "Reach 200 contribution points", completed: false },
  ];
  
  // Ranks based on points
  const getRank = (points: number) => {
    if (points >= 500) return "EV Master";
    if (points >= 250) return "EV Expert";
    if (points >= 100) return "EV Enthusiast";
    return "EV Newcomer";
  };
  
  // Next rank threshold
  const getNextRankThreshold = (points: number) => {
    if (points < 100) return 100;
    if (points < 250) return 250;
    if (points < 500) return 500;
    return 1000;
  };
  
  // Progress to next rank
  const getProgressToNextRank = (points: number) => {
    const nextThreshold = getNextRankThreshold(points);
    const prevThreshold = nextThreshold === 100 ? 0 : 
                          nextThreshold === 250 ? 100 : 
                          nextThreshold === 500 ? 250 : 500;
    
    return Math.round(((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-green-600 text-white text-2xl">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{user?.username}</h1>
                  <Badge className="bg-blue-600 mt-1">{getRank(user?.points || 0)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Points and Progress */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold">Contribution Points</h2>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-3xl font-bold text-green-600">{user?.points || 0}</span>
                <span className="text-sm text-gray-500">
                  {getProgressToNextRank(user?.points || 0)}% to {getRank(getNextRankThreshold(user?.points || 0))}
                </span>
              </div>
              <Progress 
                value={getProgressToNextRank(user?.points || 0)} 
                className="h-2 bg-gray-200"
              />
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="text-lg font-bold text-gray-800">50</span>
                  <p className="text-sm text-gray-600">Points per station</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="text-lg font-bold text-gray-800">20</span>
                  <p className="text-sm text-gray-600">Points per report</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Achievements */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold">Achievements</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      achievement.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <i className={`fas ${achievement.completed ? 'fa-check' : 'fa-lock'}`}></i>
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.name}</h3>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Activity & Stats */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold">Activity</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <span className="text-xl font-bold text-gray-800">3</span>
                  <p className="text-sm text-gray-600">Stations Added</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <span className="text-xl font-bold text-gray-800">12</span>
                  <p className="text-sm text-gray-600">Reports Submitted</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <span className="text-xl font-bold text-gray-800">2</span>
                  <p className="text-sm text-gray-600">Favorites</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <span className="text-xl font-bold text-gray-800">8</span>
                  <p className="text-sm text-gray-600">Stations Visited</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Profile;
