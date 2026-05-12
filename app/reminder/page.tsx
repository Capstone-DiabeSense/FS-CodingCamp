'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useScreening, Reminder } from '@/lib/screening-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { 
  Bell, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar,
  Clock,
  Save,
  X,
  BellRing
} from 'lucide-react'

function ReminderContent() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { reminders, addReminder, updateReminder, deleteReminder } = useScreening()
  
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [errors, setErrors] = useState<{ date?: string; time?: string }>({})

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  const validateForm = () => {
    const newErrors: { date?: string; time?: string } = {}
    
    if (!formDate) {
      newErrors.date = 'Tanggal wajib diisi'
    } else {
      const selectedDate = new Date(formDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.date = 'Tanggal tidak boleh di masa lalu'
      }
    }
    
    if (!formTime) {
      newErrors.time = 'Waktu wajib diisi'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    if (!validateForm()) return
    
    addReminder(formDate, formTime)
    setIsAdding(false)
    setFormDate('')
    setFormTime('')
    setErrors({})
  }

  const handleEdit = (reminder: Reminder) => {
    setEditingId(reminder.id)
    setFormDate(reminder.date)
    setFormTime(reminder.time)
    setErrors({})
  }

  const handleUpdate = () => {
    if (!editingId || !validateForm()) return
    
    updateReminder(editingId, formDate, formTime)
    setEditingId(null)
    setFormDate('')
    setFormTime('')
    setErrors({})
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus reminder ini?')) {
      deleteReminder(id)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormDate('')
    setFormTime('')
    setErrors({})
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const isUpcoming = (date: string, time: string) => {
    const reminderDateTime = new Date(`${date}T${time}`)
    return reminderDateTime > new Date()
  }

  // Sort reminders by date and time
  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Reminder Skrining
            </h1>
            <p className="mt-2 text-muted-foreground">
              Atur pengingat untuk skrining diabetes secara berkala
            </p>
          </div>

          {/* Add Form */}
          {isAdding && (
            <Card className="mb-8 border-primary/50">
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Tambah Reminder Baru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-date">Tanggal</Label>
                    <Input
                      id="new-date"
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={errors.date ? 'border-destructive' : ''}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive">{errors.date}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-time">Waktu</Label>
                    <Input
                      id="new-time"
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className={errors.time ? 'border-destructive' : ''}
                    />
                    {errors.time && (
                      <p className="text-sm text-destructive">{errors.time}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAdd} className="font-mono">
                    <Save className="mr-2 h-4 w-4" />
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="font-mono">
                    <X className="mr-2 h-4 w-4" />
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reminders List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-xl flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Daftar Reminder
                  </CardTitle>
                  <CardDescription>
                    {reminders.length} reminder tersimpan
                  </CardDescription>
                </div>
                {!isAdding && !editingId && (
                  <Button onClick={() => setIsAdding(true)} className="font-mono">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <BellRing className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Belum Ada Reminder</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Buat reminder untuk mengingatkan Anda melakukan skrining berkala
                  </p>
                  {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="font-mono">
                      <Plus className="mr-2 h-4 w-4" />
                      Buat Reminder Pertama
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedReminders.map((reminder) => (
                    <div key={reminder.id}>
                      {editingId === reminder.id ? (
                        <div className="p-4 rounded-lg border border-primary/50 bg-primary/5">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-date-${reminder.id}`}>Tanggal</Label>
                              <Input
                                id={`edit-date-${reminder.id}`}
                                type="date"
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={errors.date ? 'border-destructive' : ''}
                              />
                              {errors.date && (
                                <p className="text-sm text-destructive">{errors.date}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-time-${reminder.id}`}>Waktu</Label>
                              <Input
                                id={`edit-time-${reminder.id}`}
                                type="time"
                                value={formTime}
                                onChange={(e) => setFormTime(e.target.value)}
                                className={errors.time ? 'border-destructive' : ''}
                              />
                              {errors.time && (
                                <p className="text-sm text-destructive">{errors.time}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button onClick={handleUpdate} className="font-mono">
                              <Save className="mr-2 h-4 w-4" />
                              Update
                            </Button>
                            <Button variant="outline" onClick={handleCancel} className="font-mono">
                              <X className="mr-2 h-4 w-4" />
                              Batal
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border ${
                            isUpcoming(reminder.date, reminder.time)
                              ? 'border-border bg-card'
                              : 'border-muted bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              isUpcoming(reminder.date, reminder.time)
                                ? 'bg-primary/10'
                                : 'bg-muted'
                            }`}>
                              <Bell className={`h-5 w-5 ${
                                isUpcoming(reminder.date, reminder.time)
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className={`font-medium ${
                                  isUpcoming(reminder.date, reminder.time)
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                }`}>
                                  {formatDate(reminder.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {formatTime(reminder.time)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!isUpcoming(reminder.date, reminder.time) && (
                              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                Lewat
                              </span>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(reminder)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(reminder.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <BellRing className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">Tips Skrining Berkala</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Disarankan untuk melakukan skrining diabetes setiap 3-6 bulan sekali, terutama jika 
                    Anda memiliki faktor risiko seperti riwayat keluarga diabetes, obesitas, atau usia 
                    di atas 45 tahun.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ReminderPage() {
  return (
    <Providers>
      <ReminderContent />
    </Providers>
  )
}
