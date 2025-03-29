
import React from 'react';
import { Phone, User, Star, Trash2, StarOff, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useContacts, Contact } from '@/context/ContactsContext';
import { useToast } from '@/components/ui/use-toast';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const { deleteContact, setPrimaryContact, updateContact } = useContacts();
  const { toast } = useToast();

  const handleDelete = () => {
    if (contact.isPrimary) {
      toast({
        title: "Cannot delete primary contact",
        description: "Please set another contact as primary first.",
        variant: "destructive",
      });
      return;
    }
    
    deleteContact(contact.id);
    toast({
      title: "Contact deleted",
      description: `${contact.name} has been removed from your emergency contacts.`,
    });
  };

  const handleSetPrimary = () => {
    setPrimaryContact(contact.id);
    toast({
      title: "Primary contact updated",
      description: `${contact.name} is now your primary emergency contact.`,
    });
  };

  const callContact = () => {
    // In a real app, this would initiate a call
    console.log(`Calling ${contact.name}: ${contact.phone}`);
    toast({
      title: "Call initiated",
      description: `Calling ${contact.name} at ${contact.phone}`,
    });
  };

  const toggleFamilyStatus = () => {
    const newRelationship = contact.relationship === 'Family' ? 'Friend' : 'Family';
    updateContact(contact.id, { relationship: newRelationship });
    
    toast({
      title: `Contact ${newRelationship === 'Family' ? 'added to' : 'removed from'} family`,
      description: `${contact.name} is ${newRelationship === 'Family' ? 'now' : 'no longer'} a family member.`,
    });
  };

  // Determine border color based on contact type
  const getBorderColor = () => {
    if (contact.isPrimary) return '#689F38'; // Green for primary
    if (contact.isFamily) return '#E53935'; // Red for family
    return '#E0E0E0'; // Default gray
  };

  return (
    <Card className="w-full border-l-4 mb-3" style={{ borderLeftColor: getBorderColor() }}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-full ${contact.isFamily ? 'bg-red-100' : 'bg-neutral-light'} flex items-center justify-center`}>
              {contact.isFamily ? (
                <Users className="h-5 w-5 text-red-600" />
              ) : (
                <User className="h-5 w-5 text-neutral-DEFAULT" />
              )}
            </div>
            <div>
              <h3 className="font-medium flex items-center">
                {contact.name}
                {contact.isPrimary && (
                  <Star className="h-4 w-4 ml-1 text-safety-DEFAULT" fill="#689F38" />
                )}
              </h3>
              <p className="text-sm text-muted-foreground">{contact.phone}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {contact.relationship && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    contact.relationship === 'Family' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {contact.relationship}
                  </span>
                )}
                {contact.email && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                    Email
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button size="icon" variant="ghost" onClick={callContact} title="Call contact">
              <Phone className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={toggleFamilyStatus} 
              title={contact.isFamily ? "Remove from family" : "Add to family"}
            >
              <Users className={`h-4 w-4 ${contact.isFamily ? 'text-red-500' : ''}`} />
            </Button>
            
            {!contact.isPrimary && (
              <Button size="icon" variant="ghost" onClick={handleSetPrimary} title="Set as primary">
                <Star className="h-4 w-4" />
              </Button>
            )}
            
            {contact.isPrimary && (
              <Button size="icon" variant="ghost" disabled title="Primary contact">
                <StarOff className="h-4 w-4" />
              </Button>
            )}
            
            <Button size="icon" variant="ghost" onClick={handleDelete} title="Delete contact">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
