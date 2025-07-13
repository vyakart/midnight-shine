import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BentoGrid, BentoCard } from '../components/BentoGrid'
import { AboutMeCard } from '../components/cards/AboutMeCard'
import { FeedCard } from '../components/cards/FeedCard'
import { WritingCard } from '../components/cards/WritingCard'
import { ResourcesCard } from '../components/cards/ResourcesCard'
import { PhotosCard } from '../components/cards/PhotosCard'
import { DanaCard } from '../components/cards/DanaCard'
import { TerminalCard } from '../components/cards/TerminalCard'
import { ChatCard } from '../components/cards/ChatCard'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('BentoGrid', () => {
  it('renders without crashing', () => {
    renderWithRouter(
      <BentoGrid>
        <div>Test child</div>
      </BentoGrid>
    )
    expect(screen.getByText('Test child')).toBeInTheDocument()
  })

  it('applies correct grid classes', () => {
    const { container } = renderWithRouter(
      <BentoGrid>
        <div>Test child</div>
      </BentoGrid>
    )
    const gridElement = container.firstChild
    expect(gridElement).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-4', 'lg:grid-cols-6')
  })

  it('accepts custom className', () => {
    const { container } = renderWithRouter(
      <BentoGrid className="custom-class">
        <div>Test child</div>
      </BentoGrid>
    )
    const gridElement = container.firstChild
    expect(gridElement).toHaveClass('custom-class')
  })
})

describe('BentoCard', () => {
  it('renders with correct size classes', () => {
    const { container } = renderWithRouter(
      <BentoCard size="small">
        <div>Small card content</div>
      </BentoCard>
    )
    const cardElement = container.firstChild
    expect(cardElement).toHaveClass('col-span-1', 'md:col-span-2', 'lg:col-span-2', 'aspect-square')
  })

  it('renders with medium size classes', () => {
    const { container } = renderWithRouter(
      <BentoCard size="medium">
        <div>Medium card content</div>
      </BentoCard>
    )
    const cardElement = container.firstChild
    expect(cardElement).toHaveClass('col-span-1', 'md:col-span-4', 'lg:col-span-4', 'aspect-[2/1]')
  })

  it('renders with large size classes', () => {
    const { container } = renderWithRouter(
      <BentoCard size="large">
        <div>Large card content</div>
      </BentoCard>
    )
    const cardElement = container.firstChild
    expect(cardElement).toHaveClass('col-span-1', 'md:col-span-4', 'lg:col-span-4')
  })

  it('renders title when provided', () => {
    renderWithRouter(
      <BentoCard size="small" title="Test Title">
        <div>Card content</div>
      </BentoCard>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn()
    renderWithRouter(
      <BentoCard size="small" onClick={mockOnClick}>
        <div>Clickable card</div>
      </BentoCard>
    )
    
    const card = screen.getByText('Clickable card').closest('div')
    fireEvent.click(card!)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})

describe('AboutMeCard', () => {
  it('renders profile information', () => {
    renderWithRouter(<AboutMeCard />)
    
    expect(screen.getByText('Building digital experiences with passion')).toBeInTheDocument()
    expect(screen.getByText('Click to explore →')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn()
    renderWithRouter(<AboutMeCard onClick={mockOnClick} />)
    
    const card = screen.getByText('Building digital experiences with passion').closest('div')
    fireEvent.click(card!)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('renders profile image with initials', () => {
    renderWithRouter(<AboutMeCard />)
    expect(screen.getByText('ZS')).toBeInTheDocument()
  })

  it('renders social links', () => {
    renderWithRouter(<AboutMeCard />)
    expect(screen.getByText('G')).toBeInTheDocument() // GitHub
    expect(screen.getByText('T')).toBeInTheDocument() // Twitter
    expect(screen.getByText('L')).toBeInTheDocument() // LinkedIn
  })
})

describe('FeedCard', () => {
  it('renders feed title and content', () => {
    renderWithRouter(<FeedCard />)
    
    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('Just shipped a new feature! Excited to share it with everyone 🚀')).toBeInTheDocument()
  })

  it('renders live indicator', () => {
    renderWithRouter(<FeedCard />)
    expect(screen.getByText('Live feed')).toBeInTheDocument()
  })

  it('displays tweet metadata', () => {
    renderWithRouter(<FeedCard />)
    expect(screen.getByText('2h ago')).toBeInTheDocument()
    expect(screen.getByText('♥ 12')).toBeInTheDocument()
    expect(screen.getByText('⟲ 3')).toBeInTheDocument()
  })
})

describe('WritingCard', () => {
  it('renders writing title and posts', () => {
    renderWithRouter(<WritingCard />)
    
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('Building Modern Web Applications')).toBeInTheDocument()
    expect(screen.getByText('The Future of AI Development')).toBeInTheDocument()
    expect(screen.getByText('Design Systems at Scale')).toBeInTheDocument()
  })

  it('displays post metadata', () => {
    renderWithRouter(<WritingCard />)
    expect(screen.getByText('Dec 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  it('shows posts count', () => {
    renderWithRouter(<WritingCard />)
    expect(screen.getByText('3 recent posts')).toBeInTheDocument()
  })
})

describe('ResourcesCard', () => {
  it('renders resources title and description', () => {
    renderWithRouter(<ResourcesCard />)
    
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Curated collection of tools and resources')).toBeInTheDocument()
  })

  it('shows browse categories button', () => {
    renderWithRouter(<ResourcesCard />)
    expect(screen.getByText('Browse Categories')).toBeInTheDocument()
  })

  it('displays total resources count', () => {
    renderWithRouter(<ResourcesCard />)
    expect(screen.getByText('41 resources')).toBeInTheDocument()
  })

  it('opens dropdown when button is clicked', () => {
    renderWithRouter(<ResourcesCard />)
    
    const button = screen.getByText('Browse Categories')
    fireEvent.click(button)
    
    expect(screen.getByText('Design Tools')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Learning')).toBeInTheDocument()
    expect(screen.getByText('Productivity')).toBeInTheDocument()
  })
})

describe('PhotosCard', () => {
  it('renders photos title', () => {
    renderWithRouter(<PhotosCard />)
    expect(screen.getByText('Photos')).toBeInTheDocument()
  })

  it('displays photo metadata', () => {
    renderWithRouter(<PhotosCard />)
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('San Francisco')).toBeInTheDocument()
  })

  it('shows view gallery indicator', () => {
    renderWithRouter(<PhotosCard />)
    expect(screen.getByText('View gallery →')).toBeInTheDocument()
  })
})

describe('DanaCard', () => {
  it('renders dana title and metrics', () => {
    renderWithRouter(<DanaCard />)
    
    expect(screen.getByText('Dāna')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument() // Supporters
    expect(screen.getByText('78')).toBeInTheDocument() // Impact Score
  })

  it('displays progress bar', () => {
    renderWithRouter(<DanaCard />)
    expect(screen.getByText('$680/$1000')).toBeInTheDocument()
    expect(screen.getByText('68% of monthly goal')).toBeInTheDocument()
  })

  it('shows recent supporter', () => {
    renderWithRouter(<DanaCard />)
    expect(screen.getByText('Anonymous • $25')).toBeInTheDocument()
  })
})

describe('TerminalCard', () => {
  it('renders terminal title and window', () => {
    renderWithRouter(<TerminalCard />)
    
    expect(screen.getByText('Terminal')).toBeInTheDocument()
    expect(screen.getByText('terminal')).toBeInTheDocument()
  })

  it('displays terminal status', () => {
    renderWithRouter(<TerminalCard />)
    expect(screen.getByText('~/portfolio')).toBeInTheDocument()
    expect(screen.getByText('online')).toBeInTheDocument()
  })

  it('shows interactive indicator', () => {
    renderWithRouter(<TerminalCard />)
    expect(screen.getByText('Interactive →')).toBeInTheDocument()
  })
})

describe('ChatCard', () => {
  it('renders chat title and messages', () => {
    renderWithRouter(<ChatCard />)
    
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('Hi there! How can I help you?')).toBeInTheDocument()
    expect(screen.getByText("Hello! I'd like to know more about your work.")).toBeInTheDocument()
  })

  it('displays chat input placeholder', () => {
    renderWithRouter(<ChatCard />)
    expect(screen.getByText('Type a message...')).toBeInTheDocument()
  })

  it('shows online status', () => {
    renderWithRouter(<ChatCard />)
    expect(screen.getByText('Online')).toBeInTheDocument()
  })
})

describe('Bento Grid Integration', () => {
  it('renders all cards in the grid layout', () => {
    renderWithRouter(
      <BentoGrid>
        <AboutMeCard />
        <FeedCard />
        <WritingCard />
        <ResourcesCard />
        <PhotosCard />
        <DanaCard />
        <TerminalCard />
        <ChatCard />
      </BentoGrid>
    )
    
    // Check that all cards are rendered
    expect(screen.getByText('Building digital experiences with passion')).toBeInTheDocument()
    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Photos')).toBeInTheDocument()
    expect(screen.getByText('Dāna')).toBeInTheDocument()
    expect(screen.getByText('Terminal')).toBeInTheDocument()
    expect(screen.getByText('Chat')).toBeInTheDocument()
  })
}) 