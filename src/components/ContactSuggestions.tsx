// ContactSuggestions.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { IProfile } from "../utills/types";
import { Color } from "../utills/GlobalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ContactSuggestionsProps {
  contacts: IProfile[];
  onSelectContact: (contactName: string) => void;
}

const ContactSuggestions: React.FC<ContactSuggestionsProps> = ({
  contacts,
  onSelectContact,
}) => {
  const [inputText, setInputText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<IProfile[]>([]);

  const handleInputChange = (text: string) => {
    setInputText(text);
    onSelectContact(text);
    if (text.length > 0) {
      const filtered = contacts.filter((contact) =>
        contact.username.toLowerCase().includes(text.toLowerCase()),
      );

      setFilteredContacts(filtered);
    } else {
      setFilteredContacts([]);
    }
  };

  const handleInputFocus = () => {
    setFilteredContacts(contacts);
  };

  const handleInputBlur = () => {
    // Add a slight delay to allow click events to register before clearing suggestions
    setTimeout(() => {
      setFilteredContacts([]);
    }, 100);
  };

  const handleContactPress = (contactName: string) => {
    setInputText(contactName);
    setFilteredContacts([]);
    onSelectContact(contactName);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={handleInputChange}
        onFocus={handleInputFocus}
        // onBlur={handleInputBlur}
        placeholder="Enter customer name"
      />
      {filteredContacts.length > 0 && (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => String(item.userId)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleContactPress(item.username)}
            >
              <View style={styles.itemDetails}>
                <AntDesign
                  name={"user"}
                  size={18}
                  color={Color.colorDarkslateblue}
                />
                <Text style={styles.contactName}>{item.username}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.suggestionContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  suggestionContainer: {
    maxHeight: 150,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactName: {
    fontSize: 16,
  },
});

export default ContactSuggestions;
