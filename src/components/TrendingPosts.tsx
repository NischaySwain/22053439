import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ApiService, Post } from '../services/api.service';

interface PostWithComments extends Post {
  commentCount: number;
}

const TrendingPosts: React.FC = () => {
  const [trendingPosts, setTrendingPosts] = useState<PostWithComments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const posts = await ApiService.getPosts();
        const postsWithComments: PostWithComments[] = [];

        for (const post of posts) {
          const comments = await ApiService.getComments(post.id);
          postsWithComments.push({
            ...post,
            commentCount: comments.length
          });
        }

        const sortedPosts = postsWithComments
          .sort((a, b) => b.commentCount - a.commentCount)
          .slice(0, 10);

        setTrendingPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Trending Posts
        </Typography>
        <List>
          {trendingPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <ListItem>
                <ListItemText
                  primary={post.content}
                  secondary={`${post.commentCount} comments`}
                />
              </ListItem>
              {index < trendingPosts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TrendingPosts; 