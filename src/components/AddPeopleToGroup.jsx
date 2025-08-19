import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AddPeopleToGroup = ({ contacts: providedContacts = [], onCreateGroup }) => {
  const { showToast } = useToast();
  const countries = [
    { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
    { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
    { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
    { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
    { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
    { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
    { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
    { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
    { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' },
    { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
    { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
    { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
    { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
    { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
    { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
    { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
    { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
    { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
    { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
    { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' }
  ];

  const [groupName, setGroupName] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([
    { country: 'PK', number: '+92 331 123 4567' },
    { country: 'DE', number: '+49 30 1234 5678' },
    { country: 'PK', number: '+92 330 123 4658' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownStates, setDropdownStates] = useState({});

  // Build selectable contacts from provided list
  const [contacts, setContacts] = useState(() =>
    (providedContacts || []).map(c => ({ id: c.id, name: c.name, selected: false }))
  );
  useEffect(() => {
    setContacts(prev => {
      const selectionById = new Map(prev.map(c => [c.id, c.selected]));
      return (providedContacts || []).map(c => ({ id: c.id, name: c.name, selected: selectionById.get(c.id) || false }));
    });
  }, [providedContacts]);

  const handleContactToggle = (contactId) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, selected: !contact.selected }
        : contact
    ));
  };

  const handleSelectAll = () => {
    const filteredContacts = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const allSelected = filteredContacts.every(contact => contact.selected);
    
    setContacts(prev => prev.map(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        ? { ...contact, selected: !allSelected }
        : contact
    ));
  };

  const handleClearSelection = () => {
    setContacts(prev => prev.map(contact => ({ ...contact, selected: false })));
  };

  const addPhoneNumber = (index) => {
    const newNumbers = [...phoneNumbers];
    newNumbers.splice(index + 1, 0, { country: 'PK', number: '' });
    setPhoneNumbers(newNumbers);
  };

  const updatePhoneNumber = (index, field, value) => {
    const newNumbers = [...phoneNumbers];
    newNumbers[index] = { ...newNumbers[index], [field]: value };
    setPhoneNumbers(newNumbers);
  };

  const toggleDropdown = (index) => {
    setDropdownStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const selectCountry = (index, country) => {
    updatePhoneNumber(index, 'country', country.code);
    setDropdownStates(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const getCurrentCountry = (index) => {
    const phone = phoneNumbers[index];
    return countries.find(c => c.code === phone.country) || countries.find(c => c.code === 'PK');
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContactIds = useMemo(() => contacts.filter(c => c.selected).map(c => c.id), [contacts]);

  const createGroup = () => {
    if (!groupName.trim()) {
      showToast('Please enter a group name', 'warning');
      return;
    }
    if (selectedContactIds.length === 0 && phoneNumbers.every(p => !p.number.trim())) {
      showToast('Select at least one saved contact or enter a phone number', 'warning');
      return;
    }
    if (typeof onCreateGroup === 'function') {
      onCreateGroup({
        groupName: groupName.trim(),
        phoneNumbers,
        selectedContactIds,
      });
      setGroupName('');
      setPhoneNumbers([{ country: 'PK', number: '' }]);
      setContacts(contacts.map(c => ({ ...c, selected: false })));
      setSearchTerm('');
    }
  };

  const CountryDropdown = ({ index }) => {
    const currentCountry = getCurrentCountry(index);
    const isOpen = dropdownStates[index];

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown(index)}
          className="flex items-center justify-center px-3 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 w-16 h-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg leading-4">{currentCountry.flag}</span>
            <ChevronDown className={`w-3 h-3 text-gray-400 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-60 max-h-60 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => selectCountry(index, country)}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 text-left transition-colors"
              >
                <span className="text-lg">{country.flag}</span>
                <span className="text-sm font-medium text-gray-700">{country.code}</span>
                <span className="text-sm text-gray-500">{country.dialCode}</span>
                <span className="text-sm text-gray-600 truncate">{country.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add People to Group</h1>
        <p className="text-gray-600">Quickly add members using saved contacts or by entering numbers manually.</p>
      </div>

      <div className="mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          <button onClick={createGroup} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Create Group
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add via Number</h2>
          <div className="space-y-4">
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CountryDropdown index={index} />
                <input
                  type="text"
                  value={phone.number}
                  onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                  placeholder="Enter phone number"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none h-12"
                />
                <button
                  onClick={() => addPhoneNumber(index)}
                  className="w-12 h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button onClick={createGroup} className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors">
            Add to group
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add via Saved Contacts</h2>
          
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search contacts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-0 mb-6 border border-gray-300 rounded-lg overflow-hidden">
            {filteredContacts.map((contact, index) => (
              <label key={contact.id} className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${index !== filteredContacts.length - 1 ? 'border-b border-gray-300' : ''}`}>
                <input
                  type="checkbox"
                  checked={contact.selected}
                  onChange={() => handleContactToggle(contact.id)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-gray-900 font-medium">{contact.name}</span>
              </label>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSelectAll}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleClearSelection}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPeopleToGroup;
