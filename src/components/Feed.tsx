import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Avatar, ListItemAvatar, Divider } from '@mui/material';
import { ApiService, Post } from '../services/api.service';
import PersonIcon from '@mui/icons-material/Person';

interface PostWithUser extends Post {
  userName: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const allPosts = await ApiService.getPosts();
        const users = await ApiService.getUsers();
        
        const userMap = new Map(users.map(user => [user.id, user.name]));
        
        const postsWithUsers = allPosts.map(post => ({
          ...post,
          userName: userMap.get(post.userId.toString()) || 'Unknown User'
        }));

        // Sort by ID in descending order (assuming newer posts have higher IDs)
        const sortedPosts = postsWithUsers.sort((a, b) => b.id - a.id);
        
        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feed:', error);
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Recent Posts
        </Typography>
        <List>
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={post.content}
                  secondary={`Posted by ${post.userName}`}
                />
              </ListItem>
              {index < posts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Feed; 