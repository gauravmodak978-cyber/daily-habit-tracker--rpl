import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DEFAULT_USERS, storageHelpers } from "@/lib/storage";
import type { User } from "@shared/schema";

export default function Login() {
  const [, setLocation] = useLocation();
  const [rememberMe, setRememberMe] = useState(true);

  const handleUserSelect = (user: User) => {
    storageHelpers.initializeUsers();
    storageHelpers.setCurrentUser(user, rememberMe);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Habit Tracker</CardTitle>
          <CardDescription>Select your profile to continue</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DEFAULT_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="flex flex-col items-center gap-3 p-4 rounded-md border border-border bg-card hover-elevate active-elevate-2 transition-all"
                data-testid={`button-user-${user.username}`}
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback 
                    style={{ backgroundColor: user.avatarColor }}
                    className="text-primary-foreground"
                  >
                    {user.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 mt-6">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              data-testid="checkbox-remember-me"
            />
            <Label htmlFor="remember" className="text-sm cursor-pointer">
              Remember me
            </Label>
          </div>
        </CardContent>
        
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">v1.0.0</p>
        </CardFooter>
      </Card>
    </div>
  );
}
