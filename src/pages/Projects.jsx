import React from 'react'
import { Container, Typography, Grid, Paper, Box } from '@mui/material'

function Projects() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              [Project Name]
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Python | [Other Technologies]
            </Typography>
            <Typography paragraph>
              [Project description and features will go here]
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Projects
