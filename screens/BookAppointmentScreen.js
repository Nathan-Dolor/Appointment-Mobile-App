import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
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
  where, getDoc
} from "firebase/firestore";

import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const BookAppointmentScreen = () => {
  const [staff_id, setStaffID] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [staffMembers, setStaffMembers] = useState([]);
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState('');

  const [staff_ids, setStaffIDS] = useState([]);

  const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
  );

  const navigation = useNavigation();

  const time_slots = [
    "8am - 9am",
    "9am - 10am",
    "10am - 11am",
    "11am - 12pm",
    "12pm - 1pm",
    "1pm - 2pm",
  ];

  function handleOnPress() {
    setOpen(!open);
  }

  useEffect(() => {
    async function getUser(){
        const docRef = doc(db, "users", auth.currentUser?.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setUser(docSnap.data())
        }
      }
      getUser();
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
      member_id: auth.currentUser.uid,
      staff_id: staff_id,
      member_name: user.first_name + " " + user.last_name,
      date: date,
      time: time,
      purpose: purpose,
    });
  };

  const goToHome = () => {
    navigation.replace("Home");
  };

  return (
    <View style={styles.container} behavior="padding">
      <Text style={styles.title}>Book Appointment</Text>
      <View style={styles.inputContainer}>
        <SelectDropdown
          data={staffMembers}
          onSelect={(selectedItem, index) => {
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
        <TouchableOpacity onPress={handleOnPress} style={styles.input}>
          <View pointerEvents="none">
            <TextInput disabled style={styles.input} placeholder="Select Date">
              {date}
            </TextInput>
          </View>
        </TouchableOpacity>
        <Modal animationType="slide" transparent={true} visible={open}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DatePicker
                mode="calendar"
                minimumDate={startDate}
                selected={date}
                onDateChange={(text) => setDate(text)}
              />

              <TouchableOpacity onPress={handleOnPress}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <SelectDropdown
          data={time_slots}
          onSelect={(selectedItem, index) => {
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
                size={16}
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
          numberOfLines={3}
          maxLength={40}
          value={purpose}
          onChangeText={(text) => setPurpose(text)}
          style={styles.multiLineInput}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleBooking} style={styles.button}>
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToHome} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
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
    backgroundColor: "#e3f2fd",
  },
  title: {
    marginTop: 5,
    marginBottom: 40,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  multiLineInput: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8,
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
    backgroundColor: "#2a3374",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: "#f11737",
    width: "50%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  dropdown1BtnTxtStyle: { color: "#444", textAlign: "left", fontSize: 16, },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
