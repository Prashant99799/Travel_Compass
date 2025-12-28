import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, MessageSquare, ThumbsUp, ThumbsDown,
  Clock, TrendingUp, Edit2, Trash2, Send, X, ChevronDown, ChevronUp,
  Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { useAuth, getAuthToken } from '../context';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  tag: string;
  destination_name: string | null;
  is_edited: boolean;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  created_at: string;
  author_name: string;
  author_avatar: string | null;
  userVote?: 'UP' | 'DOWN' | null;
}

interface Reply {
  id: string;
  post_id: string;
  content: string;
  parent_reply_id: string | null;
  is_edited: boolean;
  upvotes: number;
  downvotes: number;
  created_at: string;
  author_name: string;
  author_avatar: string | null;
}

type SortOption = 'trending' | 'recent';
type TagFilter = 'all' | 'review' | 'question' | 'tip' | 'experience' | 'recommendation';

export const PostsPage: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [tagFilter, setTagFilter] = useState<TagFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create post modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tag: 'review' as TagFilter, imageUrl: '' });
  const [creating, setCreating] = useState(false);
  
  // Expanded post for replies
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/v1/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch replies for a post
  const fetchReplies = async (postId: string) => {
    try {
      const response = await fetch(`${API_URL}/v1/posts/${postId}/replies`);
      if (response.ok) {
        const data = await response.json();
        setReplies(prev => ({ ...prev, [postId]: data.data || [] }));
      }
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    setCreating(true);
    try {
      const authToken = getAuthToken();
      const response = await fetch(`${API_URL}/v1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prev => [data.data, ...prev]);
        setShowCreateModal(false);
        setNewPost({ title: '', content: '', tag: 'review', imageUrl: '' });
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setCreating(false);
    }
  };

  // Vote on post
  const handleVote = async (postId: string, voteType: 'UP' | 'DOWN') => {
    if (!isAuthenticated) return;

    try {
      const authToken = getAuthToken();
      const response = await fetch(`${API_URL}/v1/votes/post/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        // Refresh posts to get updated vote counts
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  // Submit reply
  const handleSubmitReply = async (postId: string) => {
    if (!newReply.trim()) return;

    setSubmittingReply(true);
    try {
      const authToken = getAuthToken();
      const response = await fetch(`${API_URL}/v1/posts/${postId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ content: newReply }),
      });

      if (response.ok) {
        const data = await response.json();
        setReplies(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.data],
        }));
        setNewReply('');
        // Update reply count
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, reply_count: p.reply_count + 1 } : p
        ));
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  // Toggle expanded post
  const toggleExpandPost = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      if (!replies[postId]) {
        fetchReplies(postId);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      if (tagFilter !== 'all' && post.tag !== tagFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return post.title.toLowerCase().includes(query) ||
               post.content.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'trending') {
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const tagColors: Record<string, string> = {
    review: 'bg-blue-100 text-blue-700',
    question: 'bg-purple-100 text-purple-700',
    tip: 'bg-green-100 text-green-700',
    experience: 'bg-orange-100 text-orange-700',
    recommendation: 'bg-pink-100 text-pink-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Community Posts</h1>
              <p className="text-slate-600 mt-1">
                Share reviews, ask questions, and connect with travelers
              </p>
            </div>
            {isAuthenticated ? (
              <Button 
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowCreateModal(true)}
              >
                New Post
              </Button>
            ) : (
              <Button 
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => window.location.href = '/login'}
                variant="outline"
              >
                Sign in to Post
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            
            {/* Sort Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('trending')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${sortBy === 'trending' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${sortBy === 'recent' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                <Clock className="w-4 h-4" />
                Recent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-slate-600 mr-2">Filter:</span>
            {(['all', 'review', 'question', 'tip', 'experience', 'recommendation'] as TagFilter[]).map(tag => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                  ${tagFilter === tag 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
            <p className="text-slate-600 mb-4">Be the first to share your travel experience!</p>
            {isAuthenticated && (
              <Button onClick={() => setShowCreateModal(true)}>Create Post</Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-md transition-shadow">
                    {/* Post Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src={post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=random`}
                        alt={post.author_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-slate-900">{post.author_name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColors[post.tag] || 'bg-slate-100 text-slate-600'}`}>
                            {post.tag}
                          </span>
                          {post.is_edited && (
                            <span className="text-xs text-slate-400">(edited)</span>
                          )}
                        </div>
                        <span className="text-sm text-slate-500">
                          {format(new Date(post.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
                    <p className="text-slate-600 mb-4 whitespace-pre-wrap">{post.content}</p>

                    {/* Post Image */}
                    {post.image_url && (
                      <div className="mb-4 rounded-xl overflow-hidden">
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {post.destination_name && (
                      <div className="mb-4">
                        <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          📍 {post.destination_name}
                        </span>
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleVote(post.id, 'UP')}
                          disabled={!isAuthenticated}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isAuthenticated 
                              ? 'hover:bg-green-50 hover:text-green-600' 
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <ThumbsUp className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-slate-700 min-w-[20px] text-center">
                          {post.upvotes - post.downvotes}
                        </span>
                        <button
                          onClick={() => handleVote(post.id, 'DOWN')}
                          disabled={!isAuthenticated}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isAuthenticated 
                              ? 'hover:bg-red-50 hover:text-red-600' 
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <ThumbsDown className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={() => toggleExpandPost(post.id)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm">{post.reply_count} replies</span>
                        {expandedPostId === post.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Replies Section */}
                    <AnimatePresence>
                      {expandedPostId === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-100"
                        >
                          {/* Replies */}
                          {replies[post.id]?.length > 0 ? (
                            <div className="space-y-3 mb-4">
                              {replies[post.id].map(reply => (
                                <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-slate-200">
                                  <img
                                    src={reply.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author_name)}&background=random`}
                                    alt={reply.author_name}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm text-slate-900">
                                        {reply.author_name}
                                      </span>
                                      <span className="text-xs text-slate-400">
                                        {format(new Date(reply.created_at), 'MMM d')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-600">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 mb-4">No replies yet. Be the first to respond!</p>
                          )}

                          {/* Reply Input */}
                          {isAuthenticated ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply(post.id)}
                              />
                              <Button
                                onClick={() => handleSubmitReply(post.id)}
                                disabled={submittingReply || !newReply.trim()}
                                size="sm"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">
                              <a href="/login" className="text-slate-900 font-medium hover:underline">
                                Sign in
                              </a>
                              {' '}to reply to this post.
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Create New Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your post a title"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newPost.tag}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tag: e.target.value as TagFilter }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="review">Review</option>
                    <option value="question">Question</option>
                    <option value="tip">Tip</option>
                    <option value="experience">Experience</option>
                    <option value="recommendation">Recommendation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts..."
                    rows={5}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Image URL (optional)
                    </div>
                  </label>
                  <input
                    type="url"
                    value={newPost.imageUrl}
                    onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  {newPost.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                      <img 
                        src={newPost.imageUrl} 
                        alt="Preview" 
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={creating || !newPost.title.trim() || !newPost.content.trim()}
                    className="flex-1"
                  >
                    {creating ? 'Creating...' : 'Create Post'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
