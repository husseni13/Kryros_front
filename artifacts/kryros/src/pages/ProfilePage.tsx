import { useState } from "react";
import { Pencil, Check, Camera, Shield, Globe, Bell, AlertTriangle, Eye, EyeOff, Laptop, Smartphone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USER } from "@/lib/mockData";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [notifications, setNotifications] = useState({ orders: true, financing: true, promotions: false, system: true });

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="max-w-screen-lg mx-auto w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">My Profile</h1>

        {/* Avatar Section */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-6 shadow-card-float">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group flex-shrink-0">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full gradient-hero flex items-center justify-center text-white font-bold text-3xl md:text-4xl shadow-brand ring-4 ring-primary/20">
                {USER.avatar}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{USER.name}</h2>
              <p className="text-muted-foreground">{USER.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  🇿🇲 {USER.country}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-sm text-muted-foreground">Member since {USER.memberSince}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="flex items-center gap-1 text-sm text-brand-teal font-medium">
                  <Check className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
            </div>
            <Button
              variant={editing ? "default" : "outline"}
              className={editing ? "rounded-xl gradient-hero text-white gap-2" : "rounded-xl gap-2"}
              onClick={() => setEditing(!editing)}
              data-testid="button-edit-profile"
            >
              {editing ? <><Check className="h-4 w-4" /> Save Changes</> : <><Pencil className="h-4 w-4" /> Edit Profile</>}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="grid grid-cols-3 mb-6 rounded-2xl bg-muted p-1">
            <TabsTrigger value="personal" className="rounded-xl">Personal Info</TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl">Security</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-xl">Preferences</TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal">
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-card-float space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">First Name</Label>
                  <Input
                    defaultValue="Chanda"
                    disabled={!editing}
                    className="h-11 rounded-xl disabled:opacity-70 disabled:cursor-default"
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">Last Name</Label>
                  <Input
                    defaultValue="Mwila"
                    disabled={!editing}
                    className="h-11 rounded-xl disabled:opacity-70 disabled:cursor-default"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground font-medium">Email Address</Label>
                <Input
                  defaultValue={USER.email}
                  disabled={!editing}
                  className="h-11 rounded-xl disabled:opacity-70 disabled:cursor-default"
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground font-medium">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex h-11 items-center gap-1 rounded-xl border border-input px-3 text-sm font-medium min-w-[80px] opacity-70">
                    🌍 +
                  </div>
                  <Input
                    defaultValue="97 123 4567"
                    disabled={!editing}
                    className="h-11 rounded-xl flex-1 disabled:opacity-70 disabled:cursor-default"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">Country</Label>
                  <Input
                    defaultValue="Your Country"
                    disabled={!editing}
                    className="h-11 rounded-xl disabled:opacity-70 disabled:cursor-default"
                    data-testid="input-country"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground font-medium">Date of Birth</Label>
                  <Input
                    type="date"
                    defaultValue="1995-06-14"
                    disabled={!editing}
                    className="h-11 rounded-xl disabled:opacity-70 disabled:cursor-default"
                    data-testid="input-dob"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-card-float">
                <h3 className="font-semibold flex items-center gap-2 mb-5"><Shield className="h-4 w-4 text-primary" /> Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Current Password</Label>
                    <div className="relative">
                      <Input type={showCurrentPass ? "text" : "password"} placeholder="Enter current password" className="h-11 rounded-xl pr-10" data-testid="input-current-password" />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                        {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">New Password</Label>
                      <Input type="password" placeholder="New password" className="h-11 rounded-xl" data-testid="input-new-password" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Confirm New</Label>
                      <Input type="password" placeholder="Confirm password" className="h-11 rounded-xl" data-testid="input-confirm-password" />
                    </div>
                  </div>
                  <Button className="rounded-xl h-11 gradient-hero text-white font-semibold gap-2" data-testid="button-update-password">
                    <Shield className="h-4 w-4" /> Update Password
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-6 shadow-card-float">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <Switch checked={twoFA} onCheckedChange={setTwoFA} data-testid="switch-2fa" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-6 shadow-card-float">
                <h3 className="font-semibold mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: "MacBook Air — Chrome", location: "Your Location", icon: Laptop, active: true },
                    { device: "iPhone 15 Pro — Safari", location: "Your Location", icon: Smartphone, active: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        <session.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium flex items-center gap-2">
                          {session.device}
                          {session.active && <span className="text-[10px] bg-brand-teal/15 text-brand-teal px-2 py-0.5 rounded-full font-medium">Current</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{session.location}</div>
                      </div>
                      {!session.active && (
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs h-8">Revoke</Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-3xl p-6 shadow-card-float">
                <h3 className="font-semibold flex items-center gap-2 mb-5"><Globe className="h-4 w-4 text-primary" /> Language & Currency</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Language</Label>
                    <select className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-language">
                      <option>English</option>
                      <option>French</option>
                      <option>Portuguese</option>
                      <option>Swahili</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Display Currency</Label>
                    <select className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-currency">
                      <option>ZMW — Zambian Kwacha</option>
                      <option>USD — US Dollar</option>
                      <option>GBP — British Pound</option>
                      <option>ZAR — South African Rand</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-6 shadow-card-float">
                <h3 className="font-semibold flex items-center gap-2 mb-5"><Bell className="h-4 w-4 text-primary" /> Notification Settings</h3>
                <div className="space-y-4">
                  {[
                    { key: "orders", label: "Order Updates", desc: "Shipping, delivery & status changes" },
                    { key: "financing", label: "Financing Alerts", desc: "Payment due dates & plan updates" },
                    { key: "promotions", label: "Promotions", desc: "Flash sales, deals & offers" },
                    { key: "system", label: "System Updates", desc: "Account & security notifications" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
                        data-testid={`switch-notif-${item.key}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-destructive/30 rounded-3xl p-6 shadow-card-float">
                <h3 className="font-semibold flex items-center gap-2 mb-2 text-destructive"><AlertTriangle className="h-4 w-4" /> Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">Once you delete your account, all data will be permanently removed and cannot be recovered.</p>
                <Button variant="destructive" className="rounded-xl h-11 font-semibold" data-testid="button-delete-account">
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
