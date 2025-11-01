import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Share2, TrendingUp, Plus, Trophy, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Post {
  id: string;
  user_id: string;
  content: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
  };
  user_liked?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export default function Community() {
  const { t } = useLanguage();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  useEffect(() => {
    initializeUser();
    fetchPosts();
  }, []);

  const initializeUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles!community_posts_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      if (data && currentUserId) {
        const { data: userLikes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', currentUserId);

        const likedPostIds = new Set(userLikes?.map(like => like.post_id) || []);

        const postsWithLikes = data.map(post => ({
          ...post,
          user_liked: likedPostIds.has(post.id),
        }));

        setPosts(postsWithLikes);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast.error('Please write something to post');
      return;
    }

    if (!userId) {
      toast.error('Please log in to create a post');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: userId,
          content: newPost,
          tags: [],
        });

      if (error) throw error;

      toast.success('Post created successfully!');
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleLike = async (postId: string) => {
    if (!userId) {
      toast.error('Please log in to like posts');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.user_liked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        setPosts(posts.map(p =>
          p.id === postId
            ? { ...p, user_liked: false, likes_count: p.likes_count - 1 }
            : p
        ));
      } else {
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: userId });

        setPosts(posts.map(p =>
          p.id === postId
            ? { ...p, user_liked: true, likes_count: p.likes_count + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles!post_comments_user_id_fkey(full_name)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!userId || !newComment[postId]?.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content: newComment[postId],
        });

      if (error) throw error;

      setNewComment(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
      fetchPosts();
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const toggleComments = (postId: string) => {
    if (selectedPost === postId) {
      setSelectedPost(null);
    } else {
      setSelectedPost(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('community')}</h1>
        <Badge variant="secondary">{posts.length} posts</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="farming-card">
            <CardHeader>
              <CardTitle>Share with Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your farming experience, tips, or ask questions..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Share Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts.length === 0 ? (
            <Card className="farming-card">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Community Feed</h2>
              {posts.map((post) => (
                <Card key={post.id} className="farming-card">
                  <CardContent className="p-6">
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{post.profiles?.full_name || 'Anonymous'}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

                        <div className="flex items-center space-x-4 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-1 ${
                              post.user_liked ? 'text-red-600' : 'text-muted-foreground'
                            }`}
                          >
                            <ThumbsUp className={`h-4 w-4 ${post.user_liked ? 'fill-current' : ''}`} />
                            <span>{post.likes_count}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1"
                            onClick={() => toggleComments(post.id)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments_count}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </Button>
                        </div>

                        {selectedPost === post.id && (
                          <div className="mt-4 space-y-3 pl-4 border-l-2 border-primary/20">
                            <div className="space-y-2">
                              {comments[post.id]?.length > 0 ? (
                                comments[post.id].map((comment) => (
                                  <div key={comment.id} className="bg-secondary/50 p-3 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-semibold text-sm">
                                        {comment.profiles?.full_name || 'Anonymous'}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No comments yet</p>
                              )}
                            </div>

                            <div className="flex space-x-2">
                              <Input
                                placeholder="Write a comment..."
                                value={newComment[post.id] || ''}
                                onChange={(e) => setNewComment(prev => ({
                                  ...prev,
                                  [post.id]: e.target.value
                                }))}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleComment(post.id);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleComment(post.id)}
                                disabled={!newComment[post.id]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Leaderboard coming soon...</p>
            </CardContent>
          </Card>

          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">#organic-farming</span>
                  <Badge variant="secondary" className="text-xs">24</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">#pest-control</span>
                  <Badge variant="secondary" className="text-xs">18</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">#irrigation</span>
                  <Badge variant="secondary" className="text-xs">15</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
