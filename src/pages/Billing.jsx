import React, { useState } from 'react';
import DashboardLayout from "../components/DashboardLayout";
import { Check, X, Crown, MessageSquare, Mail, BookOpen, CreditCard, Plus } from 'lucide-react';

const BillingDashboard = () => {
  const [currentPlan, setCurrentPlan] = useState('Pro');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');

  // Current plan usage data
  const [usageData] = useState({
    messages: { used: 812, total: 1250, percentage: 65 },
    contacts: { used: 357, total: 5000, percentage: 7 },
    whatsappAccounts: { used: 1, total: 2, percentage: 50 }
  });

  // Billing history data
  const [billingHistory] = useState([
    { date: 'July 1, 2025', plan: 'Pro Plan - Monthly', amount: '$49.00' },
    { date: 'June 1, 2025', plan: 'Pro Plan - Monthly', amount: '$49.00' },
    { date: 'May 1, 2025', plan: 'Pro Plan - Monthly', amount: '$49.00' },
    { date: 'April 1, 2025', plan: 'Pro Plan - Monthly', amount: '$49.00' }
  ]);

  // Payment methods data
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'visa', number: '4242', expiry: '12/26', default: true }
  ]);

  // Plans data
  const plans = {
    Free: {
      price: 0,
      description: 'Perfect for trying out the platform',
      features: {
        messages: '100 messages/month',
        contacts: 'Up to 100 contacts',
        whatsapp: '1 WhatsApp account',
        automations: false
      }
    },
    Pro: {
      price: 49,
      description: 'For growing businesses',
      features: {
        messages: '1,250 messages/month',
        contacts: 'Up to 5,000 contacts',
        whatsapp: '2 WhatsApp accounts',
        automations: 'Basic Automations'
      }
    },
    Business: {
      price: 99,
      description: 'For larger organizations',
      features: {
        messages: '5,000 messages/month',
        contacts: 'Up to 25,000 contacts',
        whatsapp: '5 WhatsApp accounts',
        automations: 'Advanced Automations'
      }
    }
  };

  const handlePlanChange = (planName) => {
    setCurrentPlan(planName);
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      alert('Subscription cancelled. You will continue to have access until the end of your billing period.');
    }
  };

  const handleUpgradePlan = () => {
    alert('Redirecting to payment processor...');
  };

  const handleDowngrade = () => {
    if (window.confirm('Are you sure you want to downgrade to the Free plan?')) {
      setCurrentPlan('Free');
      alert('Plan downgraded successfully!');
    }
  };

  const addPaymentMethod = () => {
    if (newCardNumber.length >= 4) {
      const newMethod = {
        id: paymentMethods.length + 1,
        type: 'visa',
        number: newCardNumber.slice(-4),
        expiry: '12/28',
        default: false
      };
      setPaymentMethods([...paymentMethods, newMethod]);
      setNewCardNumber('');
      setShowAddPayment(false);
      alert('Payment method added successfully!');
    }
  };

  const setDefaultPayment = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      default: method.id === id
    })));
  };

  const ProgressBar = ({ used, total, percentage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-green-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  const PlanCard = ({ planName, planData, isCurrent }) => (
    <div className={`bg-white rounded-lg p-6 border-2 transition-all duration-200 ${
      isCurrent ? 'border-green-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{planName}</h3>
        {isCurrent && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Current
          </span>
        )}
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">
          ${planData.price}
          <span className="text-lg font-normal text-gray-600">/month</span>
        </div>
        <p className="text-gray-600 text-sm mt-1">{planData.description}</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-700">{planData.features.messages}</span>
        </div>
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-700">{planData.features.contacts}</span>
        </div>
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-700">{planData.features.whatsapp}</span>
        </div>
        <div className="flex items-center gap-3">
          {planData.features.automations ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">{planData.features.automations}</span>
            </>
          ) : (
            <>
              <X className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Automations</span>
            </>
          )}
        </div>
      </div>

      {isCurrent ? (
        <button
          onClick={() => handlePlanChange(planName)}
          className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium cursor-default"
          disabled
        >
          Current Plan
        </button>
      ) : planName === 'Free' && currentPlan === 'Pro' ? (
        <button
          onClick={handleDowngrade}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Downgrade
        </button>
      ) : (
        <button
          onClick={handleUpgradePlan}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Upgrade
        </button>
      )}
    </div>
  );

  return (
    <DashboardLayout>
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your plan and payment methods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Pro Plan</h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">$49.00, billed monthly</p>

            {/* Usage Statistics */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Messages</span>
                  <span className="text-sm text-gray-600">
                    {usageData.messages.used}/{usageData.messages.total} ({usageData.messages.percentage}%)
                  </span>
                </div>
                <ProgressBar {...usageData.messages} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Contacts</span>
                  <span className="text-sm text-gray-600">
                    {usageData.contacts.used}/{usageData.contacts.total} ({usageData.contacts.percentage}%)
                  </span>
                </div>
                <ProgressBar {...usageData.contacts} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">WhatsApp Accounts</span>
                  <span className="text-sm text-gray-600">
                    {usageData.whatsappAccounts.used}/{usageData.whatsappAccounts.total} ({usageData.whatsappAccounts.percentage}%)
                  </span>
                </div>
                <ProgressBar {...usageData.whatsappAccounts} />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpgradePlan}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Upgrade Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Available Plans */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(plans).map(([planName, planData]) => (
                <PlanCard
                  key={planName}
                  planName={planName}
                  planData={planData}
                  isCurrent={planName === currentPlan}
                />
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
              <button
                onClick={() => setShowAddPayment(!showAddPayment)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Method
              </button>
            </div>

            {/* Add Payment Form */}
            {showAddPayment && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <h3 className="font-medium text-gray-900 mb-3">Add New Card</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addPaymentMethod}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddPayment(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Visa ending in {method.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        Expires {method.expiry}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {method.default ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultPayment(method.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Billing History */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h2>
            
            <div className="space-y-4">
              {billingHistory.map((invoice, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{invoice.plan}</div>
                    <div className="text-sm text-gray-600">{invoice.date}</div>
                  </div>
                  <div className="font-semibold text-gray-900">{invoice.amount}</div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-green-600 hover:text-green-800 font-medium text-sm transition-colors">
              View All Invoices
            </button>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 text-sm mb-6">
              Have questions about your billing or subscription? Our support team is here to help.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">Chat with Support</div>
                  <div className="text-sm text-green-700">Available 24/7</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Email Support</div>
                  <div className="text-sm text-blue-700">Response within 24 hrs</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">Knowledge Base</div>
                  <div className="text-sm text-purple-700">Find answers quickly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default BillingDashboard;