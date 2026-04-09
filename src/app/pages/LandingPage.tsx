import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Heart,
  Users,
  Sparkles,
  HandHeart,
  Shield,
  Bell,
  TrendingUp,
  Circle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function LandingPage() {
  const features = [
    {
      icon: Circle,
      title: "Visual Circle of Care",
      description:
        "See your support network at a glance with our beautiful circle visualization showing caregivers, family, and friends.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Updates",
      description:
        "Transform quick notes or voice recordings into thoughtful, complete updates with our AI composer.",
    },
    {
      icon: Users,
      title: "Smart Onboarding",
      description:
        "Late joiners get AI-generated summaries to catch up quickly on the situation and how they can help.",
    },
    {
      icon: HandHeart,
      title: "Coordinate Help",
      description:
        "Easily organize meals, rides, errands, and visits. Circle members can volunteer with one click.",
    },
    {
      icon: Bell,
      title: "Stay Connected",
      description:
        "Everyone stays informed with real-time updates, reactions, and comments in a private, supportive space.",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description:
        "Your circle is completely private. Only invited members can see updates and participate.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Circle of Care made it so much easier to keep everyone informed during my mother's treatment. The AI updates saved me hours every week.",
      author: "Jennifer M.",
      role: "Caregiver",
    },
    {
      quote:
        "As someone who joined late, the AI summary helped me understand the situation immediately and know exactly how I could help.",
      author: "David L.",
      role: "Family Member",
    },
    {
      quote:
        "The help coordination feature is brilliant. No more juggling text messages and emails. Everything is organized in one place.",
      author: "Sarah K.",
      role: "Circle Organizer",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Circle",
      description:
        "Set up your circle in minutes. Identify the person at the center and choose your role.",
    },
    {
      number: "2",
      title: "Invite Your People",
      description:
        "Add caregivers, family, and friends. They receive a secure invitation to join your private circle.",
    },
    {
      number: "3",
      title: "Share & Support",
      description:
        "Post updates using text or voice. Coordinate help. Stay connected during challenging times.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Circle of Care
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Support Network
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-gray-900">
                Support those you love
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                with your Circle of Care
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              When illness or life events happen, keeping everyone informed and
              coordinating help shouldn't be another burden. Circle of Care
              brings together your support network in one beautiful, organized
              space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6 h-auto"
                >
                  Create Your Circle
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto"
              >
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Free to start • No credit card required • Cancel anytime
            </p>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <Card className="max-w-5xl mx-auto shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-12">
                  <div className="relative w-full aspect-video max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                    {/* Simple visual representation */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute w-48 h-48 rounded-full border-4 border-blue-200 opacity-30"></div>
                      <div className="absolute w-32 h-32 rounded-full border-4 border-purple-200 opacity-40"></div>
                      <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      {/* Orbiting circles */}
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <div
                          key={i}
                          className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"
                          style={{
                            transform: `rotate(${angle}deg) translateY(-80px)`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything you need to support your loved ones
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make caregiving and support
              coordination effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-2 hover:border-blue-200 hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How it works</h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">
                      {step.number}
                    </div>
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                AI-Powered Intelligence
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900">
                Save time with AI assistance
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our AI helps you communicate more effectively and spend less
                time on updates. Just speak or type quick notes, and let AI
                compose thoughtful, complete updates for your circle.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Voice to Text Updates
                    </h3>
                    <p className="text-gray-600">
                      Record quick voice notes and AI transcribes and composes
                      them into updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Smart Summaries
                    </h3>
                    <p className="text-gray-600">
                      Late joiners get personalized summaries to quickly
                      understand the situation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Natural Language
                    </h3>
                    <p className="text-gray-600">
                      AI composes updates in a warm, empathetic tone that feels
                      personal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Your quick notes:
                    </p>
                    <p className="text-sm italic text-gray-500">
                      "Good day. PT went well. Less pain. Spirits high."
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-300 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        AI-Composed
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      "Today brought positive progress! Sarah had an excellent
                      physical therapy session and showed great improvement.
                      Pain levels are notably reduced, and spirits remain high.
                      Thank you all for your continued support."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Trusted by families everywhere
            </h2>
            <p className="text-xl text-gray-600">
              See how Circle of Care has helped others
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <p className="text-gray-700 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Ready to create your Circle of Care?
          </h2>
          <p className="text-xl text-blue-100">
            Join thousands of families who are using Circle of Care to stay
            connected and organized during life's challenging moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 h-auto bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 h-auto text-white border-white hover:bg-white/10"
            >
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm text-blue-100">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white">Circle of Care</span>
              </div>
              <p className="text-sm">
                Supporting families through life's challenges with compassion
                and technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>
              &copy; 2026 Circle of Care. All rights reserved. Built with
              compassion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
