import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from "../components/DashboardLayout";
import { Eye, EyeOff, ChevronDown, Camera, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SettingsDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  // Profile Information
  const [firstName, setFirstName] = useState(user.name.split(' ')[0]);
  const [lastName, setLastName] = useState(user.name.split(' ')[1] || '');
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('+1 (55 ) 123-4567');
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Display Preferences
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('Eastern Time (US & Canada)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wb_dark_mode') || 'false'); } catch (_) { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('wb_dark_mode', JSON.stringify(darkMode)); } catch (_) {}
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark'); else root.classList.remove('dark');
  }, [darkMode]);

  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [mobileNotifications, setMobileNotifications] = useState(false);
  
  // Notification checkboxes
  const [messageDelivery, setMessageDelivery] = useState(true);
  const [repliesAlert, setRepliesAlert] = useState(true);
  const [quotaAlerts, setQuotaAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  // API Access
  const [apiAccess, setApiAccess] = useState(true);
  const [apiKey, setApiKey] = useState('sk_test_1234567890abcdef');
  const [showApiKey, setShowApiKey] = useState(false);

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState('https://your-server.com/webhook');
  const [webhookEvents, setWebhookEvents] = useState({
    messageSent: true,
    messageDelivered: true,
    messageRead: true,
    messageFailed: false,
    replyReceived: false
  });

  // Integrations
  const [integrations] = useState([
    {
      name: 'Zapier',
      description: 'Connect with 3,000+ apps',
      icon: '⚡',
      color: 'bg-orange-100 text-orange-600',
      connected: false
    },
    {
      name: 'Slack',
      description: 'Receive notifications in your channels',
      icon: '💬',
      color: 'bg-purple-100 text-purple-600',
      connected: false
    },
    {
      name: 'Google Sheets',
      description: 'Sync contacts and logs',
      icon: '📊',
      color: 'bg-green-100 text-green-600',
      connected: false
    },
    {
      name: 'Hub Spot',
      description: 'Sync contacts and conversations',
      icon: '🎯',
      color: 'bg-blue-100 text-blue-600',
      connected: false
    }
  ]);

  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
        updateProfile({ photoUrl: e.target.result });
        try { localStorage.setItem('wb_profile_photo', e.target.result); } catch (_) {}
        showToast('Profile photo updated', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    try { localStorage.removeItem('wb_profile_photo'); } catch (_) {}
    showToast('Profile photo removed', 'success');
  };

  const handleConnectIntegration = (integrationName) => {
    if (connectedIntegrations.includes(integrationName)) {
      setConnectedIntegrations(connectedIntegrations.filter(name => name !== integrationName));
      showToast(`Disconnected from ${integrationName}`, 'success');
    } else {
      setConnectedIntegrations([...connectedIntegrations, integrationName]);
      showToast(`Connected to ${integrationName}`, 'success');
    }
  };

  const regenerateApiKey = () => {
    const newKey = 'sk_' + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 10);
    setApiKey(newKey);
    showToast('API key regenerated (demo)', 'success');
  };

  const saveWebhookSettings = () => {
    showToast('Webhook settings saved', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: `${firstName} ${lastName}`,
        email,
        // Add other fields as necessary
      });
      showToast('Profile updated', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ checked, onChange, disabled = false }) => (
    <div 
      onClick={disabled ? undefined : () => onChange(!checked)}
      className={`w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
        checked ? 'bg-green-500' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
          checked ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'
        }`}
      />
    </div>
  );

  const Dropdown = ({ value, onChange, options, className = "" }) => (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );

  return (
    <DashboardLayout>
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <label className="px-4 py-2 bg-gray-100 text-black rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {profilePhoto && (
                  <button
                    onClick={() => { handleRemovePhoto(); updateProfile({ photoUrl: null }); }}
                    className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive notifications via email</div>
                </div>
                <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Desktop Notifications</div>
                  <div className="text-sm text-gray-600">Show notifications in your browser</div>
                </div>
                <Toggle checked={desktopNotifications} onChange={setDesktopNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Mobile Notifications</div>
                  <div className="text-sm text-gray-600">Send notifications to your phone</div>
                </div>
                <Toggle checked={mobileNotifications} onChange={setMobileNotifications} />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="font-medium text-gray-900 mb-4">Notify me about</div>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={messageDelivery}
                    onChange={(e) => setMessageDelivery(e.target.checked)}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span className="text-gray-700">Message delivery status</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={repliesAlert}
                    onChange={(e) => setRepliesAlert(e.target.checked)}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span className="text-gray-700">Replies to your messages</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={quotaAlerts}
                    onChange={(e) => setQuotaAlerts(e.target.checked)}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span className="text-gray-700">Quota usage alerts</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={productUpdates}
                    onChange={(e) => setProductUpdates(e.target.checked)}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span className="text-gray-700">Product updates and announcements</span>
                </label>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Integrations</h2>
            
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${integration.color}`}>
                      {integration.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{integration.name}</div>
                      <div className="text-sm text-gray-600">{integration.description}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnectIntegration(integration.name)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      connectedIntegrations.includes(integration.name)
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    {connectedIntegrations.includes(integration.name) ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Display Preferences */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Display Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <Dropdown
                  value={language}
                  onChange={setLanguage}
                  options={['English (US)', 'English (UK)', 'Spanish', 'French', 'German']}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <Dropdown
                  value={timezone}
                  onChange={setTimezone}
                  options={[
                    'Eastern Time (US & Canada)',
                    'Central Time (US & Canada)',
                    'Mountain Time (US & Canada)',
                    'Pacific Time (US & Canada)',
                    'UTC'
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <Dropdown
                  value={dateFormat}
                  onChange={setDateFormat}
                  options={['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="font-medium text-gray-900">Dark Mode</div>
                  <div className="text-sm text-gray-600">Switch between light and dark theme</div>
                </div>
                <Toggle checked={darkMode} onChange={setDarkMode} />
              </div>
            </div>
          </div>

          {/* API Access */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">API Access</h2>
              <Toggle checked={apiAccess} onChange={setApiAccess} />
            </div>
            
            {apiAccess && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Access your data programmatically using our RESTful API.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={regenerateApiKey}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Regenerate
                  </button>
                  <button className="px-4 py-2 text-gray-600 border border-gray-600 rounded-lg hover:bg-blue-50 transition-colors">
                    API Documentation
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Webhooks */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h2>
            <p className="text-sm text-gray-600 mb-4">
              Receive real-time notifications when events occur.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="https://your-server.com/webhook"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Events to Notify</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={webhookEvents.messageSent}
                    onChange={(e) => setWebhookEvents({...webhookEvents, messageSent: e.target.checked})}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span className="text-gray-700">Message Sent</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={webhookEvents.messageDelivered}
                    onChange={(e) => setWebhookEvents({...webhookEvents, messageDelivered: e.target.checked})}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span className="text-gray-700">Message Delivered</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={webhookEvents.messageRead}
                    onChange={(e) => setWebhookEvents({...webhookEvents, messageRead: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Message Read</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={webhookEvents.messageFailed}
                    onChange={(e) => setWebhookEvents({...webhookEvents, messageFailed: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Message Failed</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={webhookEvents.replyReceived}
                    onChange={(e) => setWebhookEvents({...webhookEvents, replyReceived: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Reply Received</span>
                </label>
              </div>
            </div>

            <button
              onClick={saveWebhookSettings}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Webhook Settings
            </button>
          </div>
        </div>
      </form>
    </div>
    </DashboardLayout>
  );
};

export default SettingsDashboard;