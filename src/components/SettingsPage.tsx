import { ArrowLeft, User, Bell, Lock, Settings as SettingsIcon, Sliders } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [teamWeight, setTeamWeight] = useState(25);
  const [marketWeight, setMarketWeight] = useState(30);
  const [productWeight, setProductWeight] = useState(25);
  const [riskWeight, setRiskWeight] = useState(20);

  const totalWeight = teamWeight + marketWeight + productWeight + riskWeight;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b18] via-[#111932] to-[#13182a] pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="ghost"
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your analysis preferences and account settings</p>
        </div>

        <Tabs defaultValue="scoring" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="scoring" className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Scoring
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Scoring Settings */}
          <TabsContent value="scoring" className="space-y-6">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">Custom Scoring Weights</h3>
              <p className="text-gray-400 mb-6">
                Adjust how different factors contribute to the overall startup score
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white">Team Quality</Label>
                    <span className="text-blue-400">{teamWeight}%</span>
                  </div>
                  <Slider
                    value={[teamWeight]}
                    onValueChange={(v) => setTeamWeight(v[0])}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white">Market Opportunity</Label>
                    <span className="text-purple-400">{marketWeight}%</span>
                  </div>
                  <Slider
                    value={[marketWeight]}
                    onValueChange={(v) => setMarketWeight(v[0])}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white">Product Strength</Label>
                    <span className="text-pink-400">{productWeight}%</span>
                  </div>
                  <Slider
                    value={[productWeight]}
                    onValueChange={(v) => setProductWeight(v[0])}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white">Risk Assessment</Label>
                    <span className="text-orange-400">{riskWeight}%</span>
                  </div>
                  <Slider
                    value={[riskWeight]}
                    onValueChange={(v) => setRiskWeight(v[0])}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Weight</span>
                    <span
                      className={`text-lg ${
                        totalWeight === 100 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {totalWeight}%
                    </span>
                  </div>
                  {totalWeight !== 100 && (
                    <p className="text-red-400 text-sm mt-2">
                      ⚠️ Total must equal 100%. Please adjust the weights.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                  onClick={() => {
                    setTeamWeight(25);
                    setMarketWeight(30);
                    setProductWeight(25);
                    setRiskWeight(20);
                  }}
                >
                  Reset to Default
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Full Name</Label>
                  <Input
                    defaultValue="John Investor"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Email</Label>
                  <Input
                    type="email"
                    defaultValue="john@example.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Role</Label>
                  <Input
                    defaultValue="Lead Investor"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Update Profile
                </Button>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Current Password</Label>
                  <Input
                    type="password"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">New Password</Label>
                  <Input
                    type="password"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Confirm New Password</Label>
                  <Input
                    type="password"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Update Password
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email notifications for new analysis results', default: true },
                  { label: 'News alerts for analyzed startups', default: true },
                  { label: 'Weekly summary reports', default: false },
                  { label: 'Red flag alerts', default: true },
                  { label: 'Team collaboration notifications', default: true },
                  { label: 'Product updates and announcements', default: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                  >
                    <Label className="text-gray-300">{item.label}</Label>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">API Integrations</h3>
              <p className="text-gray-400 mb-6">
                Connect external services to enhance your startup analysis
              </p>
              <div className="space-y-4">
                {[
                  {
                    name: 'LinkedIn',
                    description: 'Fetch founder and team profiles',
                    connected: false,
                  },
                  {
                    name: 'Crunchbase',
                    description: 'Access funding and company data',
                    connected: true,
                  },
                  { name: 'NewsAPI', description: 'Real-time news monitoring', connected: true },
                  {
                    name: 'Gmail',
                    description: 'Import email threads for analysis',
                    connected: false,
                  },
                ].map((integration, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                  >
                    <div>
                      <h4 className="text-white mb-1">{integration.name}</h4>
                      <p className="text-sm text-gray-400">{integration.description}</p>
                    </div>
                    <Button
                      variant={integration.connected ? 'outline' : 'default'}
                      className={
                        integration.connected
                          ? 'border-white/20 text-white hover:bg-white/5'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      }
                    >
                      {integration.connected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <h3 className="text-xl text-white mb-4">Data & Privacy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <Label className="text-white block mb-1">Data Retention</Label>
                    <p className="text-sm text-gray-400">
                      Automatically delete analysis after 90 days
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <Label className="text-white block mb-1">Anonymous Analytics</Label>
                    <p className="text-sm text-gray-400">
                      Help improve InvestAI with usage data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
