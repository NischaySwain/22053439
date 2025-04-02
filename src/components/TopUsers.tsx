import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Avatar, ListItemAvatar } from '@mui/material';
import { ApiService, User } from '../services/api.service';
import PersonIcon from '@mui/icons-material/Person';

interface UserWithPosts extends User {
  postCount: number;
}

const TopUsers: React.FC = () => {
  const [topUsers, setTopUsers] = useState<UserWithPosts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const users = await ApiService.getUsers();
        const userPostCounts: UserWithPosts[] = [];

        for (const user of users) {
          const posts = await ApiService.getPosts(user.id);
          userPostCounts.push({
            ...user,
            postCount: posts.length
          });
        }

        const sortedUsers = userPostCounts
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 5);

        setTopUsers(sortedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top users:', error);
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Top 5 Most Active Users
        </Typography>
        <List>
          {topUsers.map((user, index) => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={`${user.postCount} posts`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TopUsers; 