import React from 'react'
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Home() {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Hi, I'm Jonathan Liu
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Student at Princeton University | Researcher | Developer
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/projects"
            size="large"
            sx={{ mr: 2 }}
          >
            View My Projects
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/research"
            size="large"
          >
            Research Work
          </Button>
        </Box>
      </Box>

      {/* Featured Sections */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Research
            </Typography>
            <Typography color="text.secondary">
              Exploring cutting-edge topics in computer science and beyond.
            </Typography>
            <Button
              component={RouterLink}
              to="/research"
              sx={{ mt: 2 }}
            >
              Learn More
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Blog
            </Typography>
            <Typography color="text.secondary">
              Sharing insights and experiences from my academic journey.
            </Typography>
            <Button
              component={RouterLink}
              to="/blog"
              sx={{ mt: 2 }}
            >
              Read Posts
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Projects
            </Typography>
            <Typography color="text.secondary">
              Interactive demos and applications built with Python.
            </Typography>
            <Button
              component={RouterLink}
              to="/projects"
              sx={{ mt: 2 }}
            >
              View Projects
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home
