import React from 'react'
import { Box, Container, Typography, Link } from '@mui/material'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Jonathan Liu. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
