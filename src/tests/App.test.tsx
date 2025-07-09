import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders welcome message', () => {
    render(<App />)
    
    // Use a more flexible text matcher that handles text split across elements
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Welcome to My Portfolio'
    })).toBeInTheDocument()
  })

  it('renders navigation structure', () => {
    render(<App />)
    
    // Test that the header exists
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    
    // Test that navigation links exist (at least some)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(5)
  })

  it('renders theme toggle button', () => {
    render(<App />)
    
    expect(screen.getByLabelText(/switch to.*theme/i)).toBeInTheDocument()
  })

  it('renders main content sections', () => {
    render(<App />)
    
    // Check for main call-to-action buttons
    expect(screen.getByRole('link', { name: 'Learn About Me' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View My Art' })).toBeInTheDocument()
  })
}) 