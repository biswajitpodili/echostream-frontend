import { useAuth } from '@/context/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, RefreshCw, User, Calendar, Mail, AtSign, Hash, Play } from 'lucide-react';

export default function UserProfile() {
  const { 
    userDetails, 
    isAuthenticated, 
    isLoading, 
    logout, 
    refreshUser 
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Please log in to view your profile</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cover Image and Avatar Section */}
      <Card className="overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          {userDetails?.coverImage ? (
            <img 
              src={userDetails.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-pink-500/80" />
          )}
          
          {/* Profile Avatar - Positioned over cover image */}
          <div className="absolute -bottom-16 left-8">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              {userDetails?.avatar ? (
                <img 
                  src={userDetails.avatar} 
                  alt={userDetails.fullname}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="bg-background flex items-center justify-center h-full w-full">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </Avatar>
          </div>

          {/* Authentication Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant={isAuthenticated ? "default" : "destructive"} className="shadow-lg">
              {isAuthenticated ? "✓ Authenticated" : "Not Authenticated"}
            </Badge>
          </div>
        </div>

        {/* Profile Info */}
        <CardContent className="pt-20 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{userDetails?.fullname}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <AtSign className="h-4 w-4" />
                  <span>{userDetails?.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{userDetails?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  <span>{userDetails?.watchHistory?.length || 0} videos watched</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="destructive" 
                size="sm"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Details
            </CardTitle>
            <CardDescription>Your account information and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">User ID</span>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {userDetails?._id?.slice(-8) || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                <span className="text-sm font-medium">{userDetails?.fullname}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">Username</span>
                <span className="text-sm font-medium">@{userDetails?.username}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{userDetails?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity & Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Activity & Stats
            </CardTitle>
            <CardDescription>Your activity and account statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">Videos Watched</span>
                <Badge variant="secondary" className="font-mono">
                  {userDetails?.watchHistory?.length || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">Account Created</span>
                <span className="text-sm font-medium">
                  {userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">
                  {userDetails?.updatedAt ? new Date(userDetails.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-muted-foreground">Profile Images</span>
                <div className="flex gap-2">
                  <Badge variant={userDetails?.avatar ? "default" : "outline"} className="text-xs">
                    Avatar {userDetails?.avatar ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={userDetails?.coverImage ? "default" : "outline"} className="text-xs">
                    Cover {userDetails?.coverImage ? '✓' : '✗'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
