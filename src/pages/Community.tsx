import React, { useState } from 'react';
import { Users, MessageCircle, ThumbsUp, Share2, TrendingUp, Plus, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timeAgo: string;
  liked: boolean;
}

interface TopContributor {
  name: string;
  points: number;
  status: 'online' | 'offline';
}

const communityPosts: CommunityPost[] = [
  {
    id: '1',
    author: 'Rajesh Kumar',
    authorAvatar: 'RK',
    content: 'Finally optimized our tomato plant irrigation system. Seeing great results for pest control. I have been using this method for 3 years with 95% success rate!',
    tags: ['irrigation', 'pest-control'],
    likes: 42,
    comments: 15,
    timeAgo: '2 hours ago',
    liked: false,
  },
  {
    id: '2',
    author: 'Priya Sharma',
    authorAvatar: 'PS',
    content: 'Completed 50 planting tasks with 100% success rate! Thanks to this amazing community for all the support and guidance.',
    tags: ['milestone', 'success'],
    likes: 38,
    comments: 12,
    timeAgo: '4 hours ago',
    liked: true,
  },
  {
    id: '3',
    author: 'Amit Singh',
    authorAvatar: 'AS',
    content: 'Best wheat yield I got in 5 years! Thanks to the app. Using organic soil and verified seeds. Harvested 45 quintals per acre this season.',
    tags: ['wheat', 'organic', 'harvest'],
    likes: 56,
    comments: 23,
    timeAgo: '6 hours ago',
    liked: false,
  },
];

const topContributors: TopContributor[] = [
  { name: 'Rajesh Kumar', points: 2780, status: 'online' },
  { name: 'Priya Sharma', points: 2456, status: 'online' },
  { name: 'Amit Singh', points: 2234, status: 'offline' },
  { name: 'Sunita Devi', points: 1998, status: 'online' },
  { name: 'Ravi Patel', points: 1876, status: 'offline' },
];

const trendingTopics = [
  { topic: 'Wheat control', posts: 45 },
  { topic: 'Pest detection', posts: 38 },
  { topic: 'Soil testing', posts: 32 },
  { topic: 'Irrigation tips', posts: 28 },
  { topic: 'Weather alert', posts: 24 },
];

export default function Community() {
  const { t } = useLanguage();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(communityPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: CommunityPost = {
        id: Date.now().toString(),
        author: 'You',
        authorAvatar: 'Y',
        content: newPost,
        tags: [],
        likes: 0,
        comments: 0,
        timeAgo: 'Just now',
        liked: false,
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('community')}</h1>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Community Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
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
                  Share Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Community Feed</h2>
            {posts.map((post) => (
              <Card key={post.id} className="farming-card">
                <CardContent className="p-6">
                  <div className="flex space-x-3">
                    <Avatar>
                      <AvatarFallback>{post.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{post.author}</h3>
                          <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
                        </div>
                      </div>
                      
                      <p className="text-foreground">{post.content}</p>
                      
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-1 ${
                            post.liked ? 'text-red-600' : 'text-muted-foreground'
                          }`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={contributor.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{contributor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {contributor.points} points
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={contributor.status === 'online' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {contributor.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={topic.topic} className="flex items-center justify-between">
                  <div className="text-sm font-medium">#{topic.topic}</div>
                  <div className="text-xs text-muted-foreground">
                    {topic.posts} posts
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="farming-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm">
                <Users className="h-4 w-4 mr-2" />
                Find Farmers
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Groups
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}