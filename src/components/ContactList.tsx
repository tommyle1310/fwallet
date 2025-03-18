import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import FFText from "@/src/components/FFText";
import FFAvatar from "@/src/components/FFAvatar";
import FFSafeAreaView from "./FFSafeAreaView";
import { IMAGE_URL } from "../utils/constants";
import axiosInstance from "../utils/axiosConfig";

export interface Contact {
  name: string;
  walletDetails: string;
  avatar: {
    url: string;
    key: string;
  };
  id?: string;
}

interface ContactListProps {
  onSelectContact: (contact: Contact) => void;
}

// const contacts: Contact[] = [
//   {
//     name: "Clarissa Bates",
//     walletDetails: "FWallet - a@gmail.com",
//     avatar: { url: IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR, key: "key1" },
//   },
//   {
//     name: "Thomas Diwantara",
//     walletDetails: "FWallet - b@gmail.com",
//     avatar: { url: IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR, key: "key2" },
//   },
//   {
//     name: "Mark Johnson",
//     walletDetails: "FWallet - c@gmail.com",
//     avatar: { url: IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR, key: "key3" },
//   },
//   {
//     name: "Anisa Bella",
//     walletDetails: "FWallet - d@gmail.com",
//     avatar: { url: IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR, key: "key4" },
//   },
//   {
//     name: "Angelina Johnson",
//     walletDetails: "FWallet - e@gmail.com",
//     avatar: { url: IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR, key: "key5" },
//   },
//   {
//     name: "Johan Crafton",
//     walletDetails: "FWallet - f@gmail.com",
//     avatar: { url: IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR, key: "key6" },
//   },
//   {
//     name: "Ariana Marnisa",
//     walletDetails: "FWallet - g@gmail.com",
//     avatar: { url: IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR, key: "key7" },
//   },
// ];

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

  useEffect(() => {
    const resultSearch = axiosInstance.get("/fwallets").then((result) => {
      const resultData = result.data.data;
      console.log(
        "check result data",
        resultData[0].user.id,
        resultData[0].user.first_name,
        resultData[0].user.email,
        resultData[0].user.avatar.url
      );

      const contacts = resultData.map((contact: any) => ({
        id: contact.user.id,
        name: contact.user.first_name + " " + contact.user.last_name,
        walletDetails: contact.user.email,
        avatar: { url: contact.user.avatar.url, key: contact.user.avatar.key },
      }));
      console.log("cehck contatcats", contacts);
    });
  }, []);

  const handleSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        const results = contacts.filter((contact) =>
          contact.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredContacts(results);
      } else {
        setFilteredContacts(contacts);
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
        <ScrollView>
          <FFText style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
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
              <FFAvatar size={40} avatar={contact.avatar.url} />
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
      </View>
    </FFSafeAreaView>
  );
};

export default ContactList;
