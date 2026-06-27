import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";

const meta: Meta = {
  title: "Patterns/Auth Pages",
  parameters: {
    docs: {
      description: {
        component:
          "Login, signup, and forgot-password — self-contained, no AppShell (there's no workspace to navigate yet). Shares one AuthLayout: ambient-backdrop background, a centered Card, and a logo placeholder per brand/guidelines.md (no real logo asset exists yet — \"Wordmark: Autumn or AX monogram\", so this uses the same icon-chip treatment as every page header, just larger).",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ambient-backdrop flex items-center justify-center" style={{ width: 480, height: 600, borderRadius: 16 }}>
      <Card className="w-full max-w-sm p-8 space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        {children}
      </Card>
    </div>
  );
}

function LoginDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <AuthLayout>
      <div className="text-center space-y-1">
        <h1 className="text-lg font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Log in to Evergreen Ventures</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <button className="text-xs text-primary hover:underline">Forgot password?</button>
          </div>
          <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="w-full" disabled={!email || !password}>Log in</Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account? <button className="text-primary hover:underline font-medium">Sign up</button>
      </p>
    </AuthLayout>
  );
}

function SignupDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <AuthLayout>
      <div className="text-center space-y-1">
        <h1 className="text-lg font-semibold">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start your free trial — no card required.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="signup-name">Name</Label>
          <Input id="signup-name" placeholder="Autumn Alexander" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input id="signup-password" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="w-full" disabled={!email || !password}>Create account</Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <button className="text-primary hover:underline font-medium">Log in</button>
      </p>
    </AuthLayout>
  );
}

function ForgotPasswordDemo() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthLayout>
      {sent ? (
        <div className="text-center space-y-2">
          <h1 className="text-lg font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">We sent a reset link to {email}.</p>
        </div>
      ) : (
        <>
          <div className="text-center space-y-1">
            <h1 className="text-lg font-semibold">Reset your password</h1>
            <p className="text-sm text-muted-foreground">We'll email you a link to get back in.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">Email</Label>
              <Input id="forgot-email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="w-full" disabled={!email} onClick={() => setSent(true)}>Send reset link</Button>
          </div>
        </>
      )}
      <button className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mx-auto transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to log in
      </button>
    </AuthLayout>
  );
}

export const Login: Story = { render: () => <LoginDemo /> };
export const Signup: Story = { render: () => <SignupDemo /> };
export const ForgotPassword: Story = { render: () => <ForgotPasswordDemo /> };
