import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import FFText from "@/src/components/FFText";
import FFAvatar from "@/src/components/FFAvatar";
import FFSafeAreaView from "../FFSafeAreaView";
import axiosInstance from "../../utils/axiosConfig";
import Spinner from "../FFSpinner";

export interface Contact {
  name: string;
  walletDetails: string;
  avatar: {
    url: string;
    key: string;
  };
  id?: string;
  fwalletId?: string;
}

interface ContactListProps {
  onSelectContact: (contact: Contact) => void;
}

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const ContactList: React.FC<ContactListProps> = ({ onSelectContact }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [contacts, setListContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const result = await axiosInstance.get("/fwallets");
      const resultData = result.data.data;

      const contacts = resultData.map((contact: any) => ({
        id: contact.user.id,
        fwalletId: contact.id,
        name: contact.user.first_name + " " + contact.user.last_name,
        walletDetails: contact.user.email,
        avatar: {
          url: contact.user.avatar?.url ?? "",
          key: contact.user.avatar?.key ?? "",
        },
      }));
      setListContacts(contacts);
      setFilteredContacts(contacts);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        try {
          const result = await axiosInstance.get(`/fwallets/search/${query}`);
          const resultData = result.data.data;

          const results = resultData.map((contact: any) => ({
            id: contact.user.id,
            fwalletId: contact.id,
            name: contact.user.first_name + " " + contact.user.last_name,
            walletDetails: contact.user.email,
            avatar: {
              url: contact.user.avatar?.url ?? "",
              key: contact.user.avatar?.key ?? "",
            },
          }));
          setFilteredContacts(results);
        } catch (error) {
          console.error("Error searching contacts:", error);
        }
      } else {
        fetchContacts();
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  return (
    <FFSafeAreaView>
      <View style={{ padding: 16, flex: 1 }}>
        <View style={{ marginBottom: 16 }}>
          <TextInput
            placeholder="Search contact"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              backgroundColor: "#fefefe",
              padding: 12,
              borderWidth: 1,
              borderColor: "#cccc",
              borderRadius: 8,
            }}
          />
        </View>
        {isLoading ? (
          <Spinner isVisible />
        ) : (
          <ScrollView>
            <FFText
              style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}
            >
              Recent Contact
            </FFText>
            {filteredContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onSelectContact(contact)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <FFAvatar size={40} avatar={contact?.avatar?.url} />
                <View style={{ marginLeft: 12 }}>
                  <FFText style={{ fontSize: 16, fontWeight: "bold" }}>
                    {contact.name}
                  </FFText>
                  <FFText style={{ fontSize: 14, color: "#888" }}>
                    {contact.walletDetails}
                  </FFText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </FFSafeAreaView>
  );
};

export default ContactList;
