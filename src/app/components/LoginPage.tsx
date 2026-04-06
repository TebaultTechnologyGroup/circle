import { useState } from "react";
import {
  signIn,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
} from "aws-amplify/auth";
import { Heart, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/Errors";

type Screen =
  | "signIn"
  | "signUp"
  | "confirmSignUp"
  | "forgotPassword"
  | "confirmReset";

export function LoginPage() {
  const [screen, setScreen] = useState<Screen>("signIn");
  const [loading, setLoading] = useState(false);

  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign-up extra fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Confirmation
  const [confirmCode, setConfirmCode] = useState("");

  // Reset
  const [newPassword, setNewPassword] = useState("");

  // ── Sign In ────────────────────────────────────────────────────────────────

  async function handleSignIn() {
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn({ username: email, password });
      // Hub listener in AuthContext will pick up 'signedIn' and load the user
    } catch (err) {
      toast.error(getErrorMessage(err, "Sign in failed."));
    } finally {
      setLoading(false);
    }
  }

  // ── Sign Up ────────────────────────────────────────────────────────────────

  async function handleSignUp() {
    if (!firstName || !lastName) {
      toast.error("Please enter your name.");
      return;
    }
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
          },
        },
      });
      setScreen("confirmSignUp");
      toast.success("Check your email for a confirmation code.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Sign up failed."));
    } finally {
      setLoading(false);
    }
  }

  // ── Confirm Sign Up ────────────────────────────────────────────────────────

  async function handleConfirmSignUp() {
    if (!confirmCode) {
      toast.error("Please enter the confirmation code.");
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: confirmCode });
      // Auto sign-in after confirmation
      await signIn({ username: email, password });
    } catch (err) {
      toast.error(getErrorMessage(err, "Confirmation failed."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    try {
      await resendSignUpCode({ username: email });
      toast.success("A new code has been sent to your email.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not resend code."));
    }
  }

  // ── Forgot Password ────────────────────────────────────────────────────────

  async function handleForgotPassword() {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setScreen("confirmReset");
      toast.success("Check your email for a reset code.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send reset code."));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmReset() {
    if (!confirmCode || !newPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: confirmCode,
        newPassword,
      });
      toast.success("Password reset! Please sign in.");
      setScreen("signIn");
      setPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Reset failed."));
    } finally {
      setLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mb-3">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Circle of Care
          </h1>
          <p className="text-sm text-gray-500 mt-1">Support those you love</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* ── Sign In ── */}
          {screen === "signIn" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome back
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sign in to your circle
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setScreen("forgotPassword")}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Sign In
              </Button>
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setScreen("signUp")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* ── Sign Up ── */}
          {screen === "signUp" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScreen("signIn")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Create account
                  </h2>
                  <p className="text-sm text-gray-500">
                    Join or start a Circle of Care
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signUpEmail">Email</Label>
                  <Input
                    id="signUpEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signUpPassword">Password</Label>
                  <Input
                    id="signUpPassword"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Create Account
              </Button>
            </div>
          )}

          {/* ── Confirm Sign Up ── */}
          {screen === "confirmSignUp" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Check your email
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmCode">Confirmation code</Label>
                <Input
                  id="confirmCode"
                  placeholder="123456"
                  value={confirmCode}
                  onChange={(e) => setConfirmCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirmSignUp()}
                  maxLength={6}
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={handleConfirmSignUp}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Confirm
              </Button>
              <p className="text-center text-sm text-gray-500">
                Didn't receive it?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend code
                </button>
              </p>
            </div>
          )}

          {/* ── Forgot Password ── */}
          {screen === "forgotPassword" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScreen("signIn")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Reset password
                  </h2>
                  <p className="text-sm text-gray-500">
                    We'll send a reset code to your email
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="resetEmail">Email</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Send Reset Code
              </Button>
            </div>
          )}

          {/* ── Confirm Reset ── */}
          {screen === "confirmReset" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Set new password
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the code sent to{" "}
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="resetCode">Reset code</Label>
                  <Input
                    id="resetCode"
                    placeholder="123456"
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={handleConfirmReset}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Reset Password
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
