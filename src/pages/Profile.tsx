
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, School, Calendar, Clock, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  school_name: string;
  gender: string;
  focus_time: number;
  avatar_url?: string;
}

const Profile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    schoolName: '',
    email: '',
  });

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    if (!currentUser) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    setProfileData(data);
    setFormData({
      fullName: data.full_name || '',
      schoolName: data.school_name || '',
      email: data.email || '',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          school_name: formData.schoolName,
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      setIsEditing(false);
      fetchProfile();
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
      console.error('Update error:', error);
    }
  };

  if (!currentUser || !profileData) return null;

  return (
    <div className="container px-4 py-6 mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-solvyn-500 to-accent2-500 flex items-center justify-center text-white text-3xl font-medium mb-4">
                {getInitials(profileData.full_name || 'User')}
              </div>
              <CardTitle className="text-xl">{profileData.full_name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Mail size={16} />
                {profileData.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <School size={16} className="text-gray-500" />
                    <span className="text-sm font-medium">Institution</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{profileData.school_name || 'Not set'}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-sm font-medium">Focus Time</span>
                  </div>
                  <Badge variant="secondary">{formatFocusTime(profileData.focus_time || 0)}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-sm font-medium">Gender</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{profileData.gender || 'Not set'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details and account information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      value={formData.email}
                      disabled
                      name="email"
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500">
                      Email cannot be changed for security reasons
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={formData.fullName}
                      onChange={handleChange}
                      name="fullName"
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">School/Institution</label>
                    <Input
                      value={formData.schoolName}
                      onChange={handleChange}
                      name="schoolName"
                      disabled={!isEditing}
                      placeholder="Enter your school or institution name"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2 justify-end pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          fullName: profileData.full_name || '',
                          schoolName: profileData.school_name || '',
                          email: profileData.email || '',
                        });
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy size={20} />
                Your Statistics
              </CardTitle>
              <CardDescription>
                Track your progress and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-solvyn-50 to-accent2-50 dark:from-solvyn-900/20 dark:to-accent2-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-solvyn-600 dark:text-solvyn-400">{formatFocusTime(profileData.focus_time || 0)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Focus</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-accent2-50 to-solvyn-50 dark:from-accent2-900/20 dark:to-solvyn-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-accent2-600 dark:text-accent2-400">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">5</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Papers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
