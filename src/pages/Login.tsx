import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appwrite } from '../lib/appwrite';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Store, TrendingUp, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { TarezaLogo } from '../components/ui/Logo';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [planChoice, setPlanChoice] = useState('TRIAL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // URL token detection for Magic Link session responses
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    if (userId && secret) {
      setLoading(true);
      const verifyMagicLink = async () => {
        try {
          const { error } = await appwrite.auth.completeMagicLinkSession(userId, secret);
          if (error) throw error;
          toast.success("Successfully authenticated with Magic Link!");
          navigate('/dashboard');
        } catch (error: any) {
          toast.error("Magic Link authentication failed: " + error.message);
        } finally {
          setLoading(false);
        }
      };
      verifyMagicLink();
    }
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    let authError = null;

    if (isSignUp) {
      if (!firstName || !lastName || !businessName) {
        toast.error("Please fill in your name and business details");
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await appwrite.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        const user = data.user;
        if (!user) throw new Error("User creation failed");

        // Setup Firebase Data
        await appwrite.from('profiles').insert([
          { id: user.id, first_name: firstName, last_name: lastName, email: user.email }
        ]);

        const endDate = new Date();
        if (planChoice === 'TRIAL') {
           endDate.setDate(endDate.getDate() + 14); // 14-day free trial
        } else {
           endDate.setDate(endDate.getDate() + 30); // 30-day Pro plan
        }

        const { data: bData } = await appwrite.from('businesses').insert([
          { 
            name: businessName, 
            tax_number: registrationNumber,
            created_at: new Date().toISOString() 
          }
        ]).select().single();

        const bRef = bData as any;

        if (bRef) {
          await appwrite.from('subscriptions').insert([{
             business_id: bRef.id,
             plan_name: planChoice === 'TRIAL' ? 'free_trial' : 'pro',
             status: 'active',
             start_date: new Date().toISOString(),
             end_date: endDate.toISOString()
          }]);

          const { data: rData } = await appwrite.from('roles').insert([
            { business_id: bRef.id, name: 'Admin', description: 'System Administrator' }
          ]).select().single();

          const rRef = rData as any;

          const { data: brData } = await appwrite.from('branches').insert([
            { business_id: bRef.id, name: 'Main Branch', type: 'retail' }
          ]).select().single();
          
          const brRef = brData as any;

          if (rRef && brRef) {
            await appwrite.from('business_users').insert([
              { business_id: bRef.id, user_id: user.id, branch_id: brRef.id, role_id: rRef.id }
            ]);
          }

          await appwrite.from('categories').insert([
            { business_id: bRef.id, name: 'General' }
          ]);
        }

        toast.success('Signup successful! Welcome to Tareza ERP. Please check your email to confirm if required.');
        navigate('/dashboard');
      } catch (error: any) {
        authError = error;
      }
    } else {
      try {
        const { error } = await appwrite.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success('Welcome back to Tareza ERP');
        navigate('/dashboard');
      } catch (error: any) {
        authError = error;
      }
    }

    if (authError) {
      toast.error(authError.message);
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: string) => {
    setLoading(true);
    try {
      const { error } = await appwrite.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to launch " + provider + " authentication");
      setLoading(false);
    }
  };

  const handleMagicLinkRequest = async () => {
    if (!email) {
      toast.error("Please enter email to receive your magic log in link");
      return;
    }
    setLoading(true);
    try {
      const { error } = await appwrite.auth.sendMagicLink(email);
      if (error) throw error;
      toast.success("Magic URL login link sent! Check your email inbox to sign in instantly.");
    } catch (error: any) {
      toast.error("Could not send magic link: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await appwrite.auth.signInAnonymously();
      if (error) throw error;
      localStorage.setItem('isGuest', 'true');
      toast.success("Signed in anonymously. Welcome!");
      navigate('/dashboard');
    } catch (error: any) {
      console.warn("Real Anonymous sign-in fallback triggered:", error);
      localStorage.setItem('isGuest', 'true');
      toast.info("Continuing with offline fallback guest mode");
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Pane - Branding */}
      <div className="hidden lg:flex flex-col flex-1 bg-secondary text-secondary-foreground p-12 justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop')] opacity-[0.03] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/95 to-secondary/80"></div>
        
        <div className="relative z-10 flex items-center">
          <TarezaLogo size="md" variant="dark" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-lg mb-12">
          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight">
            The intelligent cloud ERP for fast-growing businesses.
          </h1>
          <p className="text-zinc-400 text-lg">
            Manage your inventory, process sales, oversee procurement, and generate compliant financial reports effortlessly.
          </p>
          
          <div className="flex space-x-6 pt-8">
            <div className="flex items-center space-x-2 text-sm font-medium text-white">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Enterprise Grade</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium text-white">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>AI Forecast & Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-card relative">
        <div className="absolute top-8 right-8 flex items-center lg:hidden">
          <TarezaLogo size="sm" showSubtitle={false} />
        </div>
        <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-lg sm:rounded-2xl overflow-hidden">
          <CardHeader className="space-y-2 pb-8 pt-8 px-8 border-b border-border/40 bg-zinc-50/50">
            <CardTitle className="text-2xl font-bold tracking-tight">{isSignUp ? 'Create an account' : 'Welcome back'}</CardTitle>
            <CardDescription className="text-sm">
              {isSignUp ? 'Enter your details to get started' : 'Enter your email and password to access your account'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-5 p-8">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs uppercase tracking-wider font-semibold text-zinc-500">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={isSignUp}
                        className="h-11 bg-zinc-50 focus-visible:ring-primary focus-visible:bg-white border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={isSignUp}
                        className="h-11 bg-zinc-50 focus-visible:ring-primary focus-visible:bg-white border-zinc-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Business Name</Label>
                      <Input 
                        id="businessName" 
                        placeholder="Acme Trading Corp" 
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required={isSignUp}
                        className="h-11 bg-zinc-50 focus-visible:ring-primary focus-visible:bg-white border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber" className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Registration Number</Label>
                      <Input 
                        id="registrationNumber" 
                        placeholder="e.g. 12345/2026" 
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        className="h-11 bg-zinc-50 focus-visible:ring-primary focus-visible:bg-white border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2 pb-2">
                      <Label className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2 block">Choose Plan</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                           className={`border rounded-lg p-3 cursor-pointer transition-all ${planChoice === 'TRIAL' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-white hover:bg-zinc-50'}`}
                           onClick={() => setPlanChoice('TRIAL')}
                        >
                           <p className="font-bold text-zinc-900 text-sm">14-Day Free Trial</p>
                           <p className="text-xs text-zinc-500">Explore all features</p>
                        </div>
                        <div 
                           className={`border rounded-lg p-3 cursor-pointer transition-all ${planChoice === 'PRO' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-white hover:bg-zinc-50'}`}
                           onClick={() => setPlanChoice('PRO')}
                        >
                           <p className="font-bold text-zinc-900 text-sm">Pro ($40/mo)</p>
                           <p className="text-xs text-zinc-500">Start with real product</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@tareza.co.zw" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-zinc-50 focus-visible:ring-primary focus-visible:bg-white border-zinc-200"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-zinc-500">Password</Label>
                  {!isSignUp && (
                    <a href="#" className="text-xs text-primary hover:text-primary/80 font-medium">
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-zinc-50 focus-visible:ring-primary focus-visible:bg-white border-zinc-200"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
              <Button type="submit" className="w-full h-11 text-secondary font-bold text-base shadow-sm shadow-primary/20" disabled={loading}>
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>

              {!isSignUp && (
                <div className="text-center w-full">
                  <button
                    type="button"
                    onClick={handleMagicLinkRequest}
                    className="text-xs text-primary/90 hover:text-primary font-semibold hover:underline block mx-auto py-1"
                    disabled={loading}
                  >
                    🚀 Email passwordless Magic URL Login
                  </button>
                </div>
              )}
              
              <div className="relative w-full my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-zinc-950 text-zinc-400">Or SSO Identity Hub</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-10 font-medium text-xs flex items-center justify-center space-x-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 bg-white"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google</span>
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-10 font-medium text-xs flex items-center justify-center space-x-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 bg-white"
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-zinc-900 dark:fill-zinc-100">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span>GitHub</span>
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-10 font-medium text-xs flex items-center justify-center space-x-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 bg-white"
                  onClick={() => handleOAuthSignIn('microsoft')}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                    <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
                    <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
                    <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
                  </svg>
                  <span>Microsoft</span>
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-10 font-medium text-xs flex items-center justify-center space-x-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 bg-white"
                  onClick={() => handleOAuthSignIn('apple')}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-zinc-900 dark:fill-zinc-100">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.93 1.49-.62.72-1.16 1.86-1.01 2.97 1.11.09 2.27-.58 2.95-1.4" />
                  </svg>
                  <span>Apple</span>
                </Button>
              </div>

              <div className="relative w-full my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
              </div>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full h-11 font-semibold border border-dashed text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                onClick={handleAnonymousSignIn}
                disabled={loading}
              >
                👤 Open Anonymous Guest Session
              </Button>
              <div className="text-center text-sm text-zinc-500">
                {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
                <button 
                  type="button" 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline font-semibold"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
