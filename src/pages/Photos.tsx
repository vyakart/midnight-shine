import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Photo {
  id: string
  src: string
  alt: string
  title?: string
  location?: string
  date: string
  tags: string[]
  featured?: boolean
}

interface PhotoCollection {
  id: string
  title: string
  description: string
  date: string
  photos: Photo[]
}

export const Photos: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Mock photo collections - will be replaced with real data
  const collections: PhotoCollection[] = [
    {
      id: 'astrophotography',
      title: 'Astrophotography',
      description: 'Capturing the beauty of the night sky',
      date: 'December 2024',
      photos: [
        {
          id: '1',
          src: '/api/placeholder/400/600',
          alt: 'Milky Way over the hills',
          title: 'Milky Way Rising',
          location: 'Nandi Hills, Karnataka',
          date: 'Dec 10, 2024',
          tags: ['astrophotography', 'milky way', 'landscape'],
          featured: true
        },
        {
          id: '2',
          src: '/api/placeholder/600/400',
          alt: 'Moon surface details',
          title: 'Lunar Surface',
          location: 'Bangalore, Karnataka',
          date: 'Dec 5, 2024',
          tags: ['astrophotography', 'moon', 'telescope']
        }
      ]
    },
    {
      id: 'events',
      title: 'Event Photography',
      description: 'Capturing moments from conferences and gatherings',
      date: 'November 2024',
      photos: [
        {
          id: '3',
          src: '/api/placeholder/400/600',
          alt: 'Conference speaker on stage',
          title: 'EAGxIndia 2024',
          location: 'Bangalore, India',
          date: 'Nov 15, 2024',
          tags: ['events', 'conference', 'speaking']
        },
        {
          id: '4',
          src: '/api/placeholder/600/400',
          alt: 'Networking session',
          title: 'Impact Academy Summit',
          location: 'Delhi, India',
          date: 'Nov 8, 2024',
          tags: ['events', 'networking', 'summit']
        }
      ]
    },
    {
      id: 'daily',
      title: 'Daily Moments',
      description: 'Everyday life through my lens',
      date: 'Ongoing',
      photos: [
        {
          id: '5',
          src: '/api/placeholder/400/400',
          alt: 'Coffee and code setup',
          title: 'Morning Ritual',
          location: 'Home Studio, Bangalore',
          date: 'Dec 20, 2024',
          tags: ['daily', 'workspace', 'coffee']
        },
        {
          id: '6',
          src: '/api/placeholder/600/400',
          alt: 'Sunset cityscape',
          title: 'City Lights',
          location: 'Bangalore, Karnataka',
          date: 'Dec 18, 2024',
          tags: ['daily', 'cityscape', 'sunset']
        }
      ]
    }
  ]

  const allPhotos = collections.flatMap(collection => collection.photos)
  const filteredPhotos = selectedCollection === 'all' 
    ? allPhotos 
    : collections.find(c => c.id === selectedCollection)?.photos || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const openLightbox = (photo: Photo) => {
    setLightboxPhoto(photo)
    const index = filteredPhotos.findIndex(p => p.id === photo.id)
    setCurrentPhotoIndex(index)
  }

  const closeLightbox = () => {
    setLightboxPhoto(null)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentPhotoIndex + 1) % filteredPhotos.length
      : (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    
    setCurrentPhotoIndex(newIndex)
    setLightboxPhoto(filteredPhotos[newIndex])
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return
      
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') navigateLightbox('prev')
      if (e.key === 'ArrowRight') navigateLightbox('next')
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [lightboxPhoto, currentPhotoIndex])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Photos
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            Visual stories from my journey through astrophotography, events, and daily moments. Each frame captures a piece of curiosity and wonder.
          </p>
        </motion.div>

        {/* Collection Filter */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCollection('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCollection === 'all'
                  ? 'bg-blue-600 dark:bg-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              All Photos ({allPhotos.length})
            </motion.button>
            {collections.map(collection => (
              <motion.button
                key={collection.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCollection(collection.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCollection === collection.id
                    ? 'bg-blue-600 dark:bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {collection.title} ({collection.photos.length})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Photo Grid */}
        <motion.div variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCollection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => openLightbox(photo)}
                  className="relative aspect-square group cursor-pointer overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-700"
                >
                  {/* Photo placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 flex items-center justify-center">
                    <span className="text-4xl">📸</span>
                  </div>

                  {photo.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                    <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold mb-1">{photo.title}</h3>
                      <p className="text-sm opacity-90">{photo.location}</p>
                      <p className="text-xs opacity-75">{photo.date}</p>
                    </div>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🔍</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredPhotos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No photos in this collection yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Check back soon for more visual stories!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Camera Info */}
        <motion.div variants={itemVariants} className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
              Captured With
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">📷</div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Camera</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Sony A7 III</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🔭</div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Telescope</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Celestron NexStar 8SE</p>
              </div>
              <div>
                <div className="text-3xl mb-2">💻</div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Processing</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Lightroom + Photoshop</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo */}
              <div className="bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 rounded-lg aspect-video flex items-center justify-center">
                <span className="text-6xl">📸</span>
              </div>

              {/* Photo Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6 rounded-b-lg">
                <h3 className="text-xl font-semibold mb-2">{lightboxPhoto.title}</h3>
                <p className="text-sm opacity-90 mb-2">{lightboxPhoto.location} • {lightboxPhoto.date}</p>
                <div className="flex gap-2">
                  {lightboxPhoto.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
              >
                ←
              </button>
              <button
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
              >
                →
              </button>

              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}