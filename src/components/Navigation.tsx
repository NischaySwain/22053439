import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <AnalyticsIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Social Media Analytics
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Feed
        </Button>
        <Button color="inherit" component={Link} to="/top-users">
          Top Users
        </Button>
        <Button color="inherit" component={Link} to="/trending">
          Trending
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 