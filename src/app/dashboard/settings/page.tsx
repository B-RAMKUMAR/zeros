"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Bell, Palette } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="space-y-6">
        <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Settings className="h-6 w-6" />
                    Settings
                </CardTitle>
                <CardDescription>
                    Manage your account and notification settings.
                </CardDescription>
            </CardHeader>
        </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="theme-select">Theme</Label>
              <p className="text-xs text-muted-foreground">
                Select your preferred color scheme.
              </p>
            </div>
            <Select onValueChange={setTheme} defaultValue={theme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
           <CardDescription>
                Choose how you want to be notified.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive updates about new tasks and announcements.
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Get notified directly on your device. (Coming soon!)
              </p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>

       <div className="flex justify-end">
            <Button disabled>Save Preferences</Button>
       </div>
    </div>
  );
}
