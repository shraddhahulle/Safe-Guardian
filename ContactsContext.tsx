
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship?: string;
  isPrimary?: boolean;
  isFamily?: boolean;
}

interface ContactsContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;
  updateContact: (id: string, contact: Partial<Omit<Contact, 'id'>>) => void;
  setPrimaryContact: (id: string) => void;
  getFamilyMembers: () => Contact[];
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    // Load contacts from localStorage if available
    const savedContacts = localStorage.getItem('safeguardian-contacts');
    return savedContacts ? JSON.parse(savedContacts) : [
      {
        id: '1',
        name: 'Emergency Services',
        phone: '999',
        relationship: 'Emergency',
        isPrimary: true,
        isFamily: false
      },
      {
        id: '2',
        name: 'Alex Smith',
        phone: '555-123-4567',
        email: 'alex@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '3',
        name: 'Jordan Lee',
        phone: '555-987-6543',
        email: 'jordan@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '4',
        name: 'Taylor Wong',
        phone: '555-456-7890',
        email: 'taylor@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '5',
        name: 'Emma Johnson',
        phone: '555-789-1234',
        email: 'emma@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '6',
        name: 'Michael Chen',
        phone: '555-321-9876',
        email: 'michael@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '7',
        name: 'Sophia Rodriguez',
        phone: '555-654-7890',
        email: 'sophia@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      // Adding more family contacts that will receive automatic messages
      {
        id: '8',
        name: 'Sarah Williams',
        phone: '555-222-3333',
        email: 'sarah@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '9',
        name: 'David Johnson',
        phone: '555-444-5555',
        email: 'david@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '10',
        name: 'Lisa Garcia',
        phone: '555-666-7777',
        email: 'lisa@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '11',
        name: 'Robert Kim',
        phone: '555-888-9999',
        email: 'robert@example.com',
        relationship: 'Family',
        isPrimary: false,
        isFamily: true
      },
      {
        id: '12',
        name: 'Emily Wilson',
        phone: '555-111-2222',
        email: 'emily@example.com',
        relationship: 'Friend',
        isPrimary: false,
        isFamily: false
      },
      {
        id: '13',
        name: 'Personal Doctor',
        phone: '555-333-4444',
        email: 'doctor@example.com',
        relationship: 'Medical',
        isPrimary: false,
        isFamily: false
      }
    ];
  });

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('safeguardian-contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
      isPrimary: contacts.length === 0 ? true : false,
      isFamily: contact.relationship === 'Family' ? true : false
    };
    setContacts([...contacts, newContact]);
  };

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    
    // If the deleted contact was primary, set the first contact as primary if available
    if (contacts.find(c => c.id === id)?.isPrimary && updatedContacts.length > 0) {
      updatedContacts[0].isPrimary = true;
    }
    
    setContacts(updatedContacts);
  };

  const updateContact = (id: string, updatedData: Partial<Omit<Contact, 'id'>>) => {
    setContacts(
      contacts.map(contact => 
        contact.id === id 
          ? { 
              ...contact, 
              ...updatedData,
              isFamily: updatedData.relationship === 'Family' ? true : contact.isFamily 
            } 
          : contact
      )
    );
  };

  const setPrimaryContact = (id: string) => {
    setContacts(
      contacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === id
      }))
    );
  };

  const getFamilyMembers = () => {
    return contacts.filter(contact => contact.isFamily);
  };

  return (
    <ContactsContext.Provider 
      value={{ 
        contacts, 
        addContact, 
        deleteContact, 
        updateContact,
        setPrimaryContact,
        getFamilyMembers
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};
