import React from 'react'
import { Container, Typography, Grid, Paper, Box } from '@mui/material'

function Blog() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Blog
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              [Blog Post Title]
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              [Date]
            </Typography>
            <Typography paragraph>
              [Blog post preview content will go here]
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Blog
