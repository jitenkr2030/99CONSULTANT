'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Star, 
  TrendingUp, 
  Eye, 
  Check, 
  X, 
  AlertCircle,
  BarChart3,
  Video,
  Clock,
  Shield
} from 'lucide-react'
import { CategoryEnum, BookingStatus, UserRole } from '@prisma/client'

interface DashboardStats {
  totalUsers: number
  totalConsultants: number
  totalClients: number
  totalRevenue: number
  totalSessions: number
  activeSessions: number
  pendingApprovals: number
  averageRating: number
}

interface Consultant {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  kycVerified: boolean
  consultantProfile: {
    category: CategoryEnum
    isApproved: boolean
    isOnline: boolean
    firstSessionPrice: number
    regularSessionPrice: number
    averageRating?: number
    totalReviews?: number
  }
}

interface Booking {
  id: string
  bookingNumber: string
  status: BookingStatus
  price: number
  isFirstSession: boolean
  createdAt: string
  client: {
    name: string
    email: string
  }
  consultant: {
    name: string
    email: string
  }
  consultantProfile: {
    category: CategoryEnum
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalConsultants: 0,
    totalClients: 0,
    totalRevenue: 0,
    totalSessions: 0,
    activeSessions: 0,
    pendingApprovals: 0,
    averageRating: 0
  })
  
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  const [approvalDialog, setApprovalDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    // Mock data - in real app, this would come from API calls
    const mockStats: DashboardStats = {
      totalUsers: 16,
      totalConsultants: 6,
      totalClients: 10,
      totalRevenue: 12450,
      totalSessions: 26,
      activeSessions: 3,
      pendingApprovals: 0,
      averageRating: 4.8
    }

    const mockConsultants: Consultant[] = [
      {
        id: '1',
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+919876543210',
        role: 'CONSULTANT',
        kycVerified: true,
        consultantProfile: {
          category: CategoryEnum.CAREER,
          isApproved: true,
          isOnline: true,
          firstSessionPrice: 99,
          regularSessionPrice: 299,
          averageRating: 4.9,
          totalReviews: 12
        }
      },
      {
        id: '2',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+919876543211',
        role: 'CONSULTANT',
        kycVerified: true,
        consultantProfile: {
          category: CategoryEnum.FINANCE,
          isApproved: true,
          isOnline: false,
          firstSessionPrice: 99,
          regularSessionPrice: 399,
          averageRating: 4.8,
          totalReviews: 8
        }
      },
      {
        id: '3',
        name: 'Dr. Anjali Patel',
        email: 'anjali.patel@example.com',
        phone: '+919876543212',
        role: 'CONSULTANT',
        kycVerified: true,
        consultantProfile: {
          category: CategoryEnum.WELLNESS,
          isApproved: true,
          isOnline: true,
          firstSessionPrice: 99,
          regularSessionPrice: 349,
          averageRating: 5.0,
          totalReviews: 6
        }
      }
    ]

    const mockBookings: Booking[] = [
      {
        id: '1',
        bookingNumber: 'BK123ABC',
        status: BookingStatus.COMPLETED,
        price: 99,
        isFirstSession: true,
        createdAt: '2024-01-15T10:30:00Z',
        client: {
          name: 'Client 1',
          email: 'client1@example.com'
        },
        consultant: {
          name: 'Dr. Priya Sharma',
          email: 'priya.sharma@example.com'
        },
        consultantProfile: {
          category: CategoryEnum.CAREER
        }
      },
      {
        id: '2',
        bookingNumber: 'BK124DEF',
        status: BookingStatus.CONFIRMED,
        price: 299,
        isFirstSession: false,
        createdAt: '2024-01-16T14:15:00Z',
        client: {
          name: 'Client 2',
          email: 'client2@example.com'
        },
        consultant: {
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@example.com'
        },
        consultantProfile: {
          category: CategoryEnum.FINANCE
        }
      }
    ]

    // Use setTimeout to avoid synchronous setState calls
    setTimeout(() => {
      setStats(mockStats)
      setConsultants(mockConsultants)
      setBookings(mockBookings)
      setLoading(false)
    }, 0)
  }, [])

  const handleApproveConsultant = async (consultant: Consultant) => {
    try {
      // Mock API call - in real app, this would approve the consultant
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setConsultants(prev => 
        prev.map(c => 
          c.id === consultant.id 
            ? { ...c, consultantProfile: { ...c.consultantProfile, isApproved: true } }
            : c
        )
      )
      
      setApprovalDialog(false)
      setSelectedConsultant(null)
    } catch (error) {
      console.error('Error approving consultant:', error)
    }
  }

  const handleRejectConsultant = async () => {
    if (!selectedConsultant) return
    
    try {
      // Mock API call - in real app, this would reject the consultant
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setConsultants(prev => 
        prev.filter(c => c.id !== selectedConsultant.id)
      )
      
      setApprovalDialog(false)
      setSelectedConsultant(null)
      setRejectionReason('')
    } catch (error) {
      console.error('Error rejecting consultant:', error)
    }
  }

  const getStatusBadge = (status: BookingStatus) => {
    const variants = {
      [BookingStatus.PENDING]: 'secondary',
      [BookingStatus.CONFIRMED]: 'default',
      [BookingStatus.COMPLETED]: 'default',
      [BookingStatus.CANCELLED]: 'destructive',
      [BookingStatus.NO_SHOW]: 'destructive'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your consultation platform</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalConsultants} consultants, {stats.totalClients} clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {stats.totalSessions} sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSessions}</div>
              <p className="text-xs text-muted-foreground">
                Live consultations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                Platform average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="consultants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="consultants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultant Management</CardTitle>
                <CardDescription>
                  Approve or reject consultant applications and manage existing consultants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Consultant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultants.map((consultant) => (
                      <TableRow key={consultant.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={consultant.avatar} alt={consultant.name} />
                              <AvatarFallback>{consultant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{consultant.name}</div>
                              <div className="text-sm text-gray-500">{consultant.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {consultant.consultantProfile.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant={consultant.consultantProfile.isApproved ? "default" : "secondary"}>
                              {consultant.consultantProfile.isApproved ? 'Approved' : 'Pending'}
                            </Badge>
                            {consultant.kycVerified && (
                              <Shield className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{consultant.consultantProfile.averageRating || 'N/A'}</span>
                            <span className="text-gray-500 text-sm">
                              ({consultant.consultantProfile.totalReviews || 0})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>First: ₹{consultant.consultantProfile.firstSessionPrice}</div>
                            <div>Regular: ₹{consultant.consultantProfile.regularSessionPrice}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!consultant.consultantProfile.isApproved && (
                              <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    onClick={() => setSelectedConsultant(consultant)}
                                  >
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Review Consultant Application</DialogTitle>
                                    <DialogDescription>
                                      Review and approve or reject {selectedConsultant?.name}'s application
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Applicant</Label>
                                      <div className="flex items-center space-x-3 mt-2">
                                        <Avatar className="w-10 h-10">
                                          <AvatarImage src={selectedConsultant?.avatar} />
                                          <AvatarFallback>
                                            {selectedConsultant?.name.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{selectedConsultant?.name}</div>
                                          <div className="text-sm text-gray-500">{selectedConsultant?.email}</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label>Category</Label>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {selectedConsultant?.consultantProfile.category}
                                      </p>
                                    </div>

                                    <div>
                                      <Label htmlFor="rejection">Rejection Reason (if rejecting)</Label>
                                      <Textarea
                                        id="rejection"
                                        placeholder="Provide reason for rejection..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" onClick={() => setApprovalDialog(false)}>
                                        Cancel
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        onClick={handleRejectConsultant}
                                        disabled={!rejectionReason.trim()}
                                      >
                                        Reject
                                      </Button>
                                      <Button onClick={() => selectedConsultant && handleApproveConsultant(selectedConsultant)}>
                                        Approve
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Monitor all booking activities on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Consultant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                        <TableCell>{booking.client.name}</TableCell>
                        <TableCell>{booking.consultant.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.consultantProfile.category}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>₹{booking.price}</TableCell>
                        <TableCell>
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Sessions</CardTitle>
                <CardDescription>Monitor active consultation sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Live session monitoring will be displayed here</p>
                  <p className="text-sm">This would show active video sessions with real-time status</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Platform revenue trends and breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Revenue charts will be displayed here</p>
                    <p className="text-sm">Monthly revenue, growth trends, category breakdown</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                  <CardDescription>User growth and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>User analytics will be displayed here</p>
                    <p className="text-sm">User growth, retention, session frequency</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}