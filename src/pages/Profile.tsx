
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    schoolName: currentUser?.schoolName || '',
    email: currentUser?.email || '',
  });

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
    try {
      await updateProfile({
        fullName: formData.fullName,
        schoolName: formData.schoolName,
      });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated.",
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

  if (!currentUser) return null;

  return (
    <div className="container px-4 py-6 mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-solvyn-500 to-accent2-500 flex items-center justify-center text-white text-3xl font-medium mb-2">
                {getInitials(currentUser.fullName)}
              </div>
              <CardTitle>{currentUser.fullName}</CardTitle>
              <CardDescription>{currentUser.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Institution</span>
                  <span className="font-medium">{currentUser.schoolName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Focus Time</span>
                  <span className="font-medium">{formatFocusTime(currentUser.focusTime)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={formData.email}
                      disabled
                      name="email"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={formData.fullName}
                      onChange={handleChange}
                      name="fullName"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School/Institution</label>
                    <Input
                      value={formData.schoolName}
                      onChange={handleChange}
                      name="schoolName"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="flex space-x-2 justify-end pt-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            fullName: currentUser.fullName,
                            schoolName: currentUser.schoolName,
                            email: currentUser.email,
                          });
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
