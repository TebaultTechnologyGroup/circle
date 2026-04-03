import { useState } from "react";
import { mockHelpRequests, mockMembers } from "../data/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  HandHeart,
  Plus,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Coffee,
  DollarSign,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Help() {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<
    "meal" | "ride" | "errand" | "visit" | "other"
  >("meal");
  const [fundingGoal, setFundingGoal] = useState("");
  const [fundingPurpose, setFundingPurpose] = useState("");

  const openRequests = mockHelpRequests.filter((h) => h.status === "open");
  const claimedRequests = mockHelpRequests.filter(
    (h) => h.status === "claimed",
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "meal":
        return <UtensilsCrossed className="w-4 h-4" />;
      case "ride":
        return <Car className="w-4 h-4" />;
      case "errand":
        return <ShoppingBag className="w-4 h-4" />;
      case "visit":
        return <Coffee className="w-4 h-4" />;
      default:
        return <HandHeart className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "meal":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "ride":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "errand":
        return "bg-green-100 text-green-700 border-green-300";
      case "visit":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleCreateRequest = () => {
    if (!newTitle || !newDescription) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Help request created!");
    setNewTitle("");
    setNewDescription("");
    setNewCategory("meal");
  };

  const handleVolunteer = (requestId: string, title: string) => {
    console.log(`Volunteered to help with request ${requestId}`);
    toast.success(`You've volunteered to help with: ${title}`);
  };

  const handleStartFundraiser = () => {
    if (!fundingGoal || !fundingPurpose) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Fundraising campaign created!");
    setFundingGoal("");
    setFundingPurpose("");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Help & Support</h1>
          <p className="text-gray-600">
            Ways to provide practical support to the family
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="mr-2 h-5 w-5" />
              Request Help
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Help</DialogTitle>
              <DialogDescription>
                Let your circle know how they can provide practical support.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="help" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="help">Practical Help</TabsTrigger>
                <TabsTrigger value="funding">Financial Support</TabsTrigger>
              </TabsList>

              <TabsContent value="help" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">What do you need help with?</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Dinner for Thursday evening"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Details</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide more details about the help needed..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newCategory}
                    onValueChange={(v) => setNewCategory(v as any)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meal">Meal</SelectItem>
                      <SelectItem value="ride">Transportation/Ride</SelectItem>
                      <SelectItem value="errand">Errand/Shopping</SelectItem>
                      <SelectItem value="visit">Visit/Company</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateRequest} className="w-full">
                  Create Request
                </Button>
              </TabsContent>

              <TabsContent value="funding" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Fundraising Goal</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="goal"
                      type="number"
                      placeholder="5000"
                      value={fundingGoal}
                      onChange={(e) => setFundingGoal(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Explain what the funds will be used for..."
                    value={fundingPurpose}
                    onChange={(e) => setFundingPurpose(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> This will create a fundraising
                    campaign that circle members and their networks can
                    contribute to. Funds will be managed through a secure
                    payment processor.
                  </p>
                </div>
                <Button onClick={handleStartFundraiser} className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Start Fundraiser
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRequests.length}</div>
            <p className="text-xs text-muted-foreground">Need volunteers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimedRequests.length}</div>
            <p className="text-xs text-muted-foreground">Being handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Help</CardTitle>
            <HandHeart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHelpRequests.length}</div>
            <p className="text-xs text-muted-foreground">All requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Open Requests */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Open Requests</h2>
        {openRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HandHeart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                No open help requests at the moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {request.date
                          ? `Needed by ${request.date.toLocaleDateString()}`
                          : "Flexible timing"}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`capitalize ${getCategoryColor(request.category)}`}
                    >
                      {getCategoryIcon(request.category)}
                      <span className="ml-1">{request.category}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{request.description}</p>
                  <Button
                    onClick={() => handleVolunteer(request.id, request.title)}
                    className="w-full"
                    variant="default"
                  >
                    <HandHeart className="mr-2 h-4 w-4" />I Can Help
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Claimed Requests */}
      {claimedRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">In Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claimedRequests.map((request) => {
              const volunteer = mockMembers.find(
                (m) => m.id === request.volunteerId,
              );
              return (
                <Card key={request.id} className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {request.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {request.date
                            ? request.date.toLocaleDateString()
                            : "Flexible timing"}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`capitalize ${getCategoryColor(request.category)}`}
                      >
                        {getCategoryIcon(request.category)}
                        <span className="ml-1">{request.category}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700">
                      {request.description}
                    </p>
                    {volunteer && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-green-600 text-white">
                            {volunteer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {volunteer.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Volunteered to help
                          </p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Funding Widget */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Support
          </CardTitle>
          <CardDescription>
            Help with medical expenses and other costs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Raised</span>
              <span className="font-semibold">$3,250 of $10,000 goal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                style={{ width: "32.5%" }}
              ></div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <DollarSign className="mr-2 h-4 w-4" />
              Contribute
            </Button>
            <Button variant="outline">View Details</Button>
          </div>
          <p className="text-xs text-gray-600">
            Funds will be used for medical expenses, home care, and daily living
            support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
