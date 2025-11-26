import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast.js";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Sample credentials
    if (email === "user@example.com" && password === "password123") {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your todo dashboard.",
      });
      onLogin();
    }else if(email === "user2@example.com" || password === "password123") {

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your todo dashboard.",
      });
      onLogin();
    }
    
    else {
      toast({
        title: "Invalid credentials",
        description: "Please use: user@example.com / password123",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">Welcome Back</CardTitle>
          <CardDescription>Sign in to your todo dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" variant="gradient">
              Sign In
            </Button>
          </form>
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Sample credentials:</strong><br />
              Email: user@example.com<br />
              Password: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
