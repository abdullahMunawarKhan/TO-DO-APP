import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { ArrowLeft, User, Mail, Calendar, Clock, Trophy, Target } from "lucide-react";

const Profile = ({ onBack, completedTasks, totalTasks }) => {

  // ✅ Get current user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    email: "email@example.com"
  };

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: "Tasks Completed", value: completedTasks, icon: Trophy, color: "text-green-500" },
    { label: "Total Tasks", value: totalTasks, icon: Target, color: "text-blue-500" },
    { label: "Completion Rate", value: `${completionRate}%`, icon: Calendar, color: "text-purple-500" },
    { label: "Streak Days", value: "7", icon: Clock, color: "text-orange-500" },
  ];
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:4000/api/auth/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.reload(); // refresh profile to show new avatar
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="glass-card mb-6">
          <CardHeader className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 group">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar ? `http://localhost:4000/uploads/${user.avatar}` : "./src/assets/Untitled design.png"} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>

              {/* Upload icon on hover */}
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer opacity-0 group-hover:opacity-100 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <User className="w-4 h-4 text-primary" />
              </label>
            </div>


            {/* ⭐ Dynamic name & email */}
            <CardTitle className="text-2xl gradient-text">{user.name}</CardTitle>

            <CardDescription className="flex items-center justify-center gap-2 mt-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </CardDescription>

            <Badge variant="secondary" className="w-fit mx-auto mt-3">
              Pro Organizer
            </Badge>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Section */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Task Master</p>
                <p className="text-sm text-muted-foreground">Completed 10 tasks in a row</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Early Bird</p>
                <p className="text-sm text-muted-foreground">Completed morning tasks 5 days straight</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Weekly Warrior</p>
                <p className="text-sm text-muted-foreground">Completed all weekly goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
