import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'

function Research() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Research
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Current Research
        </Typography>
        <Typography paragraph>
          [Your current research projects and interests will go here]
        </Typography>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Publications
        </Typography>
        <Typography paragraph>
          [Your publications and research papers will be listed here]
        </Typography>
      </Paper>
    </Container>
  )
}

export default Research
