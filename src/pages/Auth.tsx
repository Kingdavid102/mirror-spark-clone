import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Globe, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Validation schemas
const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

const regions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'eu', label: 'European Union' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
];

const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
];

type AuthMode = 'signin' | 'signup-step1' | 'signup-step2' | 'signup-step3';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [getUpdates, setGetUpdates] = useState(true);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateEmail = () => {
    try {
      emailSchema.parse(email);
      return true;
    } catch {
      return false;
    }
  };

  const validatePassword = () => {
    try {
      passwordSchema.parse(password);
      return true;
    } catch {
      return false;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    } else {
      navigate('/');
    }
  };

  const handleSignUpStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!region) {
      toast({ title: 'Region required', description: 'Please select your region', variant: 'destructive' });
      return;
    }
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({ title: 'Name required', description: 'Please enter your first and last name', variant: 'destructive' });
      return;
    }
    
    setMode('signup-step2');
  };

  const handleSignUpStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }
    
    if (!validatePassword()) {
      toast({ title: 'Invalid password', description: 'Password must be at least 8 characters', variant: 'destructive' });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please make sure your passwords match', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    const { error } = await signUp(email, password, firstName, lastName, region, language, getUpdates);
    setLoading(false);
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast({ title: 'Account exists', description: 'This email is already registered. Please sign in instead.', variant: 'destructive' });
        setMode('signin');
      } else {
        toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Account created!', description: 'Welcome to Tesla Investment Platform!' });
      navigate('/');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between border-b border-border">
        <span className="text-xl font-bold tracking-[0.3em] text-foreground">T Ξ S L Λ</span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>en-US</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-tesla-blue flex items-center gap-1">
                  Email <Info className="w-3 h-3" />
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-muted border-none"
                  placeholder=""
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading || !email}
                className="w-full h-12 bg-tesla-blue hover:bg-tesla-blue/90 text-white font-medium"
              >
                {loading ? 'Signing in...' : 'Next'}
              </Button>
              
              <div className="text-center">
                <a href="#" className="text-tesla-blue hover:underline text-sm">
                  Trouble Signing In?
                </a>
              </div>
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode('signup-step1')}
                className="w-full h-12 border-border font-medium"
              >
                Create Account
              </Button>
            </form>
          )}

          {/* Sign Up Step 1 - Region & Name */}
          {mode === 'signup-step1' && (
            <form onSubmit={handleSignUpStep1} className="space-y-6">
              <p className="text-muted-foreground text-sm">Step 1 of 3</p>
              <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
              
              <div className="space-y-2">
                <Label htmlFor="region" className="text-foreground">Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="h-12 bg-muted border-none">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="text-muted-foreground">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-12 bg-muted border-none">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-tesla-blue">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 bg-muted border-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-tesla-blue">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 bg-muted border-none"
                />
              </div>
              
              <div className="border border-border rounded-lg p-4 flex items-center gap-3">
                <Checkbox id="human" className="w-5 h-5" />
                <label htmlFor="human" className="text-sm">I am human</label>
                <div className="ml-auto text-xs text-muted-foreground">hCaptcha</div>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                By clicking 'Next', I understand and agree to Tesla's{' '}
                <a href="#" className="text-tesla-blue hover:underline">Privacy Notice</a> and{' '}
                <a href="#" className="text-tesla-blue hover:underline">Terms of Use</a> for creating a Tesla Account and I
                authorize Tesla to contact me for account management purposes via the contact information I provide.
              </p>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-tesla-blue hover:bg-tesla-blue/90 text-white font-medium"
              >
                Next
              </Button>
              
              <Button
                type="button"
                variant="link"
                onClick={() => setMode('signin')}
                className="w-full text-tesla-blue"
              >
                Already have an account? Sign In
              </Button>
            </form>
          )}

          {/* Sign Up Step 2 - Email & Password */}
          {mode === 'signup-step2' && (
            <form onSubmit={handleSignUpStep2} className="space-y-6">
              <p className="text-muted-foreground text-sm">Step 2 of 3</p>
              <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
              
              <div className="space-y-2">
                <Label htmlFor="signupEmail" className="text-tesla-blue">Email</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-muted border-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signupPassword" className="text-tesla-blue flex items-center gap-1">
                  Password <Info className="w-3 h-3" />
                </Label>
                <div className="relative">
                  <Input
                    id="signupPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-muted border-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-tesla-blue">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-muted border-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="updates" 
                  checked={getUpdates}
                  onCheckedChange={(checked) => setGetUpdates(checked as boolean)}
                />
                <label htmlFor="updates" className="text-sm font-medium">
                  Get Tesla Updates [Optional]
                </label>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                <a href="#" className="text-tesla-blue hover:underline">Learn about Tesla Updates</a>
              </p>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                By clicking 'Create Account', I authorize Tesla to contact me with more information about Tesla products, services and
                regional events via the contact information I provide. I understand calls or texts may use automatic or computer-
                assisted dialing or pre-recorded messages. Normal message and data rates apply. I can opt out at any time in
                the Tesla app or by <a href="#" className="text-tesla-blue hover:underline">unsubscribing</a>.
              </p>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-tesla-blue hover:bg-tesla-blue/90 text-white font-medium"
              >
                {loading ? 'Creating Account...' : 'Next'}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode('signup-step1')}
                className="w-full"
              >
                Back
              </Button>
            </form>
          )}

          {/* Sign Up Step 3 - Verification (for email confirmation flow) */}
          {mode === 'signup-step3' && (
            <div className="space-y-6">
              <p className="text-muted-foreground text-sm">Step 3 of 3</p>
              <h1 className="text-3xl font-bold text-foreground">Verify Your Email</h1>
              
              <p className="text-tesla-blue">
                Enter the code sent to {email}
              </p>
              
              <div className="flex gap-2 justify-center">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg bg-muted border-none"
                  />
                ))}
              </div>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full h-12 border-border font-medium"
              >
                Resend Code
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-border text-center text-sm text-muted-foreground">
        Tesla © 2026 &nbsp; 
        <a href="#" className="hover:underline">Privacy & Legal</a> &nbsp; 
        <a href="#" className="hover:underline">Contact</a>
      </footer>
    </div>
  );
};

export default Auth;
