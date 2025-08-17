"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCreateUserMutation } from "@/store/services/api";
import { useState } from "react";

export default function AuthPage() {
  const [createUser] = useCreateUserMutation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    role: "USER" as "USER" | "SELLER" | "ADMIN",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      if (!formData.email || !formData.password) {
        alert("Please fill in all required fields!");
        return;
      }

      setIsLoading(true);
      try {
        await createUser({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName || undefined,
          role: formData.role,
        }).unwrap();

        alert("Account created successfully! You can now sign in.");
        setIsSignUp(false);
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          displayName: "",
          role: "USER",
        });
      } catch (error) {
        alert("Failed to create account. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign in logic would go here
      // For now, just show a message
      alert(
        "Sign in functionality not implemented yet. This would typically authenticate with your backend."
      );
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      role: "USER",
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to BidNow</h1>
          <p className="text-gray-600 mt-2">
            {isSignUp
              ? "Create your account to start bidding"
              : "Sign in to your account"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
            <CardDescription>
              {isSignUp
                ? "Fill in your details to create a new account"
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                      placeholder="Enter your display name (optional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Account Type</Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          role: e.target.value as "USER" | "SELLER" | "ADMIN",
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5cfc] focus:border-[#1b5cfc]"
                    >
                      <option value="USER">Bidder</option>
                      <option value="SELLER">Seller</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose "Seller" if you plan to create auctions
                    </p>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 disabled:opacity-50"
              >
                {isLoading
                  ? isSignUp
                    ? "Creating Account..."
                    : "Signing In..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  resetForm();
                }}
                className="w-full border-[#1b5cfc] text-[#1b5cfc] hover:bg-[#1b5cfc] hover:text-white"
              >
                {isSignUp ? "Sign In Instead" : "Create Account"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="bg-gradient-to-r from-[#1b5cfc]/10 to-[#9518fa]/10 border-[#1b5cfc]/20">
          <CardContent className="pt-6">
            <h3 className="font-medium text-[#1b5cfc] mb-2">
              Demo Information
            </h3>
            <p className="text-sm text-gray-700">
              This is a demo application. The authentication system creates user
              records but doesn't implement full session management. In a
              production app, you would integrate with proper authentication
              services and session management.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
