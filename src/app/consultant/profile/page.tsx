'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Calendar, Clock, DollarSign, Star, Users, Video, Shield, Upload, Save, Eye, EyeOff } from 'lucide-react'
import { CategoryEnum } from '@prisma/client'

interface ConsultantProfile {
  id: string
  userId: string
  bio?: string
  experience?: string
  qualifications?: string
  skills?: string
  category: CategoryEnum
  subcategory?: string
  firstSessionPrice: number
  regularSessionPrice: number
  availability?: string
  isOnline: boolean
  isApproved: boolean
  profileCompleted: boolean
}

interface User {
  id: string
  email: string
  name?: string
  phone?: string
  avatar?: string
  role: string
  kycVerified: boolean
}

export default function ConsultantProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ConsultantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    experience: '',
    qualifications: '',
    skills: '',
    category: CategoryEnum.CAREER,
    subcategory: '',
    firstSessionPrice: 99,
    regularSessionPrice: 299,
    availability: ''
  })

  useEffect(() => {
    // Mock user data - in real app, this would come from auth context
    const mockUser: User = {
      id: '1',
      email: 'priya.sharma@example.com',
      name: 'Dr. Priya Sharma',
      phone: '+919876543210',
      avatar: '',
      role: 'CONSULTANT',
      kycVerified: true
    }

    const mockProfile: ConsultantProfile = {
      id: '1',
      userId: '1',
      bio: '15+ years in career counseling and talent development. Specialized in helping professionals find their true calling and navigate career transitions.',
      experience: '15',
      qualifications: '["PhD in Organizational Psychology", "Certified Career Coach", "MBA from IIM Ahmedabad"]',
      skills: '["Career Planning", "Resume Building", "Interview Preparation", "Leadership Development", "Work-Life Balance"]',
      category: CategoryEnum.CAREER,
      subcategory: 'Career Counseling',
      firstSessionPrice: 99,
      regularSessionPrice: 299,
      availability: '{"monday": {"available": true, "slots": ["09:00-12:00", "14:00-18:00"]}, "tuesday": {"available": true, "slots": ["09:00-12:00", "14:00-18:00"]}}',
      isOnline: true,
      isApproved: true,
      profileCompleted: true
    }

    setUser(mockUser)
    setProfile(mockProfile)
    
    // Initialize form data
    setFormData({
      name: mockUser.name || '',
      phone: mockUser.phone || '',
      bio: mockProfile.bio || '',
      experience: mockProfile.experience || '',
      qualifications: mockProfile.qualifications || '',
      skills: mockProfile.skills || '',
      category: mockProfile.category,
      subcategory: mockProfile.subcategory || '',
      firstSessionPrice: mockProfile.firstSessionPrice,
      regularSessionPrice: mockProfile.regularSessionPrice,
      availability: mockProfile.availability || ''
    })
    
    setLoading(false)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Mock API call - in real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfile(prev => prev ? {
        ...prev,
        bio: formData.bio,
        experience: formData.experience,
        qualifications: formData.qualifications,
        skills: formData.skills,
        category: formData.category,
        subcategory: formData.subcategory,
        firstSessionPrice: formData.firstSessionPrice,
        regularSessionPrice: formData.regularSessionPrice,
        availability: formData.availability
      } : null)
      
      setUser(prev => prev ? {
        ...prev,
        name: formData.name,
        phone: formData.phone
      } : null)
      
      setEditMode(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const parseJSONArray = (jsonString: string) => {
    try {
      return JSON.parse(jsonString || '[]')
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={profile.isApproved ? "default" : "secondary"}>
                    {profile.isApproved ? 'Approved' : 'Pending Approval'}
                  </Badge>
                  {user.kycVerified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Shield className="w-3 h-3 mr-1" />
                      KYC Verified
                    </Badge>
                  )}
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-600">
                      {profile.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    {editMode ? 'Update your personal information' : 'Your personal information'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editMode ? formData.name : user.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={editMode ? formData.phone : user.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell clients about your expertise and experience..."
                      value={editMode ? formData.bio : profile.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!editMode}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={editMode ? formData.experience : profile.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      disabled={!editMode}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>Your expertise and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editMode ? formData.category : profile.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as CategoryEnum }))}
                      disabled={!editMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CategoryEnum).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0) + category.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={editMode ? formData.subcategory : profile.subcategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstPrice">First Session (₹)</Label>
                      <Input
                        id="firstPrice"
                        type="number"
                        value={editMode ? formData.firstSessionPrice : profile.firstSessionPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstSessionPrice: parseInt(e.target.value) }))}
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="regularPrice">Regular Session (₹)</Label>
                      <Input
                        id="regularPrice"
                        type="number"
                        value={editMode ? formData.regularSessionPrice : profile.regularSessionPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, regularSessionPrice: parseInt(e.target.value) }))}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={profile.isOnline}
                      onCheckedChange={(checked) => {
                        if (editMode) {
                          // In real app, this would update the backend
                          console.log('Online status changed:', checked)
                        }
                      }}
                      disabled={!editMode}
                    />
                    <Label>Available for instant sessions</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills and Qualifications */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Qualifications</CardTitle>
                <CardDescription>
                  {editMode ? 'Add your skills and qualifications (comma-separated)' : 'Your expertise areas'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Textarea
                    id="qualifications"
                    placeholder="e.g., PhD in Psychology, MBA, Certified Coach"
                    value={editMode ? formData.qualifications : profile.qualifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                    disabled={!editMode}
                    rows={3}
                  />
                  {!editMode && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {parseJSONArray(profile.qualifications).map((qual: string, index: number) => (
                        <Badge key={index} variant="secondary">{qual}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., Career Planning, Resume Building, Interview Prep"
                    value={editMode ? formData.skills : profile.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    disabled={!editMode}
                    rows={3}
                  />
                  {!editMode && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {parseJSONArray(profile.skills).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Availability Settings</CardTitle>
                <CardDescription>Set your available time slots for consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Availability calendar will be implemented here</p>
                  <p className="text-sm">This would include a weekly schedule with time slots</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹12,450</div>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <p className="text-xs text-gray-500">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">4.8</div>
                  <p className="text-xs text-gray-500">From 18 reviews</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
                <CardDescription>Your recent earnings and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Earnings history will be displayed here</p>
                  <p className="text-sm">This would include detailed transaction history</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Your consultation history and upcoming sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Session history will be displayed here</p>
                  <p className="text-sm">This would include past and upcoming consultations</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}