import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Star, Settings, Bookmark, Clock, TrendingUp, MessageSquare, Edit2, LogOut, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SeasonBadge } from '../components/ui';
import { useAuth, getAuthToken } from '../context';
import { TIPS, DESTINATIONS } from '../data';
import { getCurrentSeason, formatDate } from '../utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface UserPost {
  id: string;
  title: string;
  content: string;
  tag: string;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  created_at: string;
}

interface UserStats {
  postsCount: number;
  tipsCount: number;
  bookmarksCount: number;
  totalUpvotes: number;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const currentSeason = getCurrentSeason();
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's posts and stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAuthToken();
        
        // Fetch posts
        const postsResponse = await fetch(`${API_URL}/v1/user/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (postsResponse.ok) {
          const data = await postsResponse.json();
          setUserPosts(data.data || []);
        }

        // Fetch stats
        const statsResponse = await fetch(`${API_URL}/v1/user/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setUserStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoadingPosts(false);
      }
    };
    
    if (user) {
      fetchUserData();
      setEditName(user.name);
      setEditBio(user.bio || '');
    }
  }, [user]);
  
  // Mock saved destinations (first 3)
  const savedDestinations = DESTINATIONS.slice(0, 3);
  
  // Mock recent activity
  const recentActivity = TIPS.slice(0, 3);

  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await updateProfile({ name: editName, bio: editBio });
    setSaving(false);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl bg-slate-100 shadow-sm object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-lg shadow-sm">
                <SeasonBadge season={currentSeason} size="sm" showLabel={false} />
              </div>
            </motion.div>
            
            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl font-bold text-slate-900 border-b-2 border-emerald-500 focus:outline-none bg-transparent w-full"
                    placeholder="Your name"
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="text-sm text-slate-600 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full resize-none"
                    placeholder="Tell us about yourself..."
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-1" /> Save</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h1>
                  <p className="text-sm text-slate-500 mb-2">{user.email}</p>
                  {user.bio && <p className="text-sm text-slate-600 mb-2">{user.bio}</p>}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(user.created_at)}
                    </span>
                    {user.is_native && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Local Expert
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit Profile
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <MessageSquare className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">{userStats?.postsCount || 0}</div>
            <div className="text-sm text-slate-500">Posts</div>
          </Card>
          <Card className="p-4 text-center">
            <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">{userStats?.tipsCount || 0}</div>
            <div className="text-sm text-slate-500">Tips</div>
          </Card>
          <Card className="p-4 text-center">
            <Bookmark className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">{userStats?.bookmarksCount || 0}</div>
            <div className="text-sm text-slate-500">Bookmarks</div>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">{userStats?.totalUpvotes || 0}</div>
            <div className="text-sm text-slate-500">Upvotes</div>
          </Card>
        </div>
        
        {/* Posts and Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Your Posts
            </h2>
            {loadingPosts ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="border-b border-slate-100 pb-3 last:border-0">
                    <h3 className="font-medium text-slate-900 mb-1">{post.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-full capitalize">{post.tag}</span>
                      <span>↑ {post.upvotes}</span>
                      <span>💬 {post.reply_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">No posts yet. Start sharing your experiences!</p>
            )}
          </Card>
          
          {/* Saved Destinations */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              Saved Destinations
            </h2>
            <div className="space-y-3">
              {savedDestinations.map((dest) => (
                <div key={dest.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 text-sm">{dest.name}</h3>
                    <p className="text-xs text-slate-500">{dest.category}</p>
                  </div>
                  <SeasonBadge season={currentSeason} size="sm" showLabel={false} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
