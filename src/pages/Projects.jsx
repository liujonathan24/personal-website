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

            <a href="https://ai-tutor-app-zeta.vercel.app/login">Project CodeHT:</a>
              <br></br>
              <ul>
                  <li>This project seeks to facilitate learning competitive programming by offering 
                  an interactive environment and a finetuned "AI-tutor" llm to help. I work on the 
                  software side and as a tester. Human data is augmented by using LLMs that imitate 
                  a human trajectory and interact with the coding interface. Paper to be finalized March-April 2025.</li>
              </ul>
          
           
                    
                    
                    [More research projects and interests to come!]
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
