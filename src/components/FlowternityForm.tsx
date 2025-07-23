import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import turfBackground from '@/assets/turf-background.jpg';

interface FormData {
  name: string;
  age: string;
  city: string;
  phone: string;
  email: string;
}

const FlowternityForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    city: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const { name, age, city, phone, email } = formData;
    
    if (!name.trim() || !age.trim() || !city.trim() || !phone.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // ===== WEBHOOK URL CONFIGURATION =====
      // Replace this URL with your n8n webhook endpoint
      const WEBHOOK_URL = 'https://loopzenn.app.n8n.cloud/webhook-test/flowternity-forn';
      // =====================================

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your information has been submitted successfully.",
        });
        
        // Reset form
        setFormData({
          name: '',
          age: '',
          city: '',
          phone: '',
          email: ''
        });
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Submission failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${turfBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Stadium lighting effects */}
      <div className="absolute inset-0 stadium-glow"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary-glow rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
      
      <Card className="form-stadium w-full max-w-md relative z-10">
        <CardHeader className="text-center space-y-4 pb-6">
          <CardTitle className="text-3xl font-bold text-foreground tracking-wide">
            Welcome to Flowternity Turf
          </CardTitle>
          <p className="text-lg text-muted-foreground font-medium">
            Enter your details:
          </p>
          <div className="w-16 h-1 bg-turf-gradient mx-auto rounded-full"></div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-turf h-12 text-base"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-semibold text-foreground">
                Age *
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="1"
                max="150"
                className="input-turf h-12 text-base"
                placeholder="Enter your age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold text-foreground">
                City *
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="input-turf h-12 text-base"
                placeholder="Enter your city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                Phone No. *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="input-turf h-12 text-base"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input-turf h-12 text-base"
                placeholder="Enter your email address"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-stadium w-full h-12 text-base mt-8"
            >
              {isSubmitting ? 'Submitting...' : 'Join Flowternity Turf'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowternityForm;