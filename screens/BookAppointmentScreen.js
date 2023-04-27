import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import DatePicker from "react-date-picker";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const BookAppointmentScreen = () => {
  const [staff_id, setStaffID] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [staffMembers, setStaffMembers] = useState([]);

  const [staff_ids, setStaffIDS] = useState([]);

  const navigation = useNavigation();
  const time_slots = [
    "8am - 9am",
    "9am - 10am",
    "10am - 11am",
    "11am - 12pm",
    "12pm - 1pm",
    "1pm - 2pm",
  ];

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "users"), where("type", "==", "staff"));
      const querySnapshot = await getDocs(q);
      setStaffMembers([]);
      setStaffIDS([]);
      await querySnapshot.forEach((doc) => {
        setStaffMembers((current) => [
          ...current,
          doc.data().first_name + " " + doc.data().last_name,
        ]);
        setStaffIDS((current) => [...current, doc.id]);
      });
    }
    fetchData();
  }, []);

  const handleBooking = async () => {
    const newAppointmentRef = doc(collection(db, "appointments"));
    await setDoc(newAppointmentRef, {
      user_id: auth.currentUser.uid,
      staff_id: staff_id,
      date: date,
      time: time,
      purpose: purpose,
    });
  };

  return (
    <View style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <SelectDropdown
          data={staffMembers}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setStaffID(staff_ids[index]);
          }}
          defaultButtonText={"Select Staff"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"#444"}
                size={18}
              />
            );
          }}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
        <TextInput
          placeholder="Date"
          value={date}
          onChangeText={(text) => setDate(text)}
          style={styles.input}
        />
        {/* <DatePicker onChange={(text) => onChange(text)} value={value} /> */}
        <SelectDropdown
          data={time_slots}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setTime(selectedItem);
          }}
          defaultButtonText={"Select Time Slot"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"#444"}
                size={18}
              />
            );
          }}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
        <TextInput
          placeholder="Purpose of appointment"
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          value={purpose}
          onChangeText={(text) => setPurpose(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleBooking} style={styles.button}>
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookAppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
});
