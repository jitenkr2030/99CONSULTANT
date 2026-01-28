'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Search, Video, Calendar, Shield, TrendingUp, Users, Clock, CheckCircle, ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'

interface Consultant {
  id: string
  name: string
  email: string
  avatar?: string
  consultantProfile: {
    category: string
    bio?: string
    firstSessionPrice: number
    regularSessionPrice: number
    isOnline: boolean
  }
  averageRating: number
  totalReviews: number
}

interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredConsultants, setFeaturedConsultants] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for initial display
  const mockCategories: Category[] = [
    { id: 'career', name: 'Career', icon: '💼', count: 156 },
    { id: 'education', name: 'Education', icon: '📚', count: 89 },
    { id: 'finance', name: 'Finance', icon: '💰', count: 124 },
    { id: 'business', name: 'Business', icon: '🏢', count: 203 },
    { id: 'wellness', name: 'Wellness', icon: '🧘', count: 67 },
    { id: 'technology', name: 'Technology', icon: '💻', count: 145 },
  ]

  const mockConsultants: Consultant[] = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      email: 'priya@example.com',
      consultantProfile: {
        category: 'CAREER',
        bio: '15+ years in career counseling and talent development',
        firstSessionPrice: 99,
        regularSessionPrice: 299,
        isOnline: true
      },
      averageRating: 4.9,
      totalReviews: 234
    },
    {
      id: '2', 
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      consultantProfile: {
        category: 'FINANCE',
        bio: 'Expert in investment planning and wealth management',
        firstSessionPrice: 99,
        regularSessionPrice: 399,
        isOnline: false
      },
      averageRating: 4.8,
      totalReviews: 189
    },
    {
      id: '3',
      name: 'Dr. Anjali Patel',
      email: 'anjali@example.com',
      consultantProfile: {
        category: 'WELLNESS', 
        bio: 'Holistic wellness coach and mental health expert',
        firstSessionPrice: 99,
        regularSessionPrice: 349,
        isOnline: true
      },
      averageRating: 5.0,
      totalReviews: 312
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Find Your Consultant',
      description: 'Browse through our verified consultants across various categories',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Book a Session',
      description: 'Schedule an instant session or book for your preferred time',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Start Consultation',
      description: 'Join the live video session and get expert guidance',
      icon: <Video className="w-6 h-6" />
    }
  ]

  // Fetch categories and consultants on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || mockCategories)
        } else {
          setCategories(mockCategories)
        }

        // Fetch featured consultants
        const consultantsResponse = await fetch('/api/consultants?limit=3&online=true')
        if (consultantsResponse.ok) {
          const consultantsData = await consultantsResponse.json()
          setFeaturedConsultants(consultantsData.consultants || mockConsultants)
        } else {
          setFeaturedConsultants(mockConsultants)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Use mock data if API fails
        setCategories(mockCategories)
        setFeaturedConsultants(mockConsultants)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '10'
      })
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)

      const response = await fetch(`/api/consultants?${params}`)
      if (response.ok) {
        const data = await response.json()
        // Navigate to consultants page or update current page
        console.log('Search results:', data.consultants)
      }
    } catch (error) {
      console.error('Error searching consultants:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">99</span>
              </div>
              <span className="font-bold text-xl">Consultant.com</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#browse" className="text-gray-600 hover:text-gray-900">Browse Consultants</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
              <Link href="#become-consultant" className="text-gray-600 hover:text-gray-900">Become a Consultant</Link>
              <Button variant="outline">Sign In</Button>
              <Button>Get Started</Button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Link href="#browse" className="block py-2 text-gray-600">Browse Consultants</Link>
              <Link href="#how-it-works" className="block py-2 text-gray-600">How It Works</Link>
              <Link href="#become-consultant" className="block py-2 text-gray-600">Become a Consultant</Link>
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            First Session Only ₹99
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get Expert Guidance
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Instantly
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with verified consultants across Career, Finance, Business, Wellness & more. 
            Start your first consultation for just ₹99.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8">
              Browse Consultants
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Become a Consultant
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>1000+ Consultants</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.8+ Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Verified Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>24/7 Availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search consultants by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="h-12 px-8" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/consultants?category=${category.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} consultants</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Consultants */}
      <section id="browse" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Consultants</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Top-rated consultants ready to help you achieve your goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredConsultants.map((consultant) => (
              <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={consultant.avatar} alt={consultant.name} />
                          <AvatarFallback>{consultant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {consultant.consultantProfile.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{consultant.name}</CardTitle>
                        <CardDescription>{consultant.consultantProfile.category}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ₹{consultant.consultantProfile.firstSessionPrice}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{consultant.consultantProfile.bio}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{consultant.averageRating}</span>
                      <span className="text-gray-500 text-sm">({consultant.totalReviews} reviews)</span>
                    </div>
                    {consultant.consultantProfile.isOnline && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Online Now
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      Book Session
                    </Button>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Consultants
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How 99Consultant Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get expert guidance in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Expert Guidance?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands who've transformed their lives with expert consultations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your First Session - ₹99
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">99</span>
                </div>
                <span className="font-bold text-xl">Consultant.com</span>
              </div>
              <p className="text-gray-400">
                Your trusted platform for expert consultations across all life domains.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Browse Consultants</Link></li>
                <li><Link href="#" className="hover:text-white">How It Works</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Consultants</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Become a Consultant</Link></li>
                <li><Link href="#" className="hover:text-white">Consultant Resources</Link></li>
                <li><Link href="#" className="hover:text-white">Earnings</Link></li>
                <li><Link href="#" className="hover:text-white">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 99Consultant.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}