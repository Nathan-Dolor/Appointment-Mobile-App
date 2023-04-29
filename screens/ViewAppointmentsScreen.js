import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ViewAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState();
  const [hasloaded, setHasLoaded] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        setAppointments([]);
        const id = auth.currentUser?.uid;
        let currentAppointment = 1;
        await querySnapshot.forEach((doc) => {
          if (doc.data().member_id == id) {
            setAppointments((current) => [
              ...current,
              {
                id: doc.id,
                name: "Appointment " + currentAppointment,
                staff_id: "",
                date: doc.data().date,
                time: doc.data().time,
                purpose: doc.data().purpose,
              },
            ]);
            currentAppointment += 1;
          } else if (doc.data().staff_id == id) {
            setAppointments((current) => [
              ...current,
              {
                id: doc.id,
                name: "Appointment " + currentAppointment,
                staff_id: id,
                member_name: doc.data().member_name,
                date: doc.data().date,
                time: doc.data().time,
                purpose: doc.data().purpose,
              },
            ]);
            currentAppointment += 1;
          }
        });
        setHasLoaded(true);
        setTotalAppointments(currentAppointment - 1);
        
      }
    fetchData();
  }, []);

  const goToHome = () => {
    navigation.replace("Home");
  };

  const ListItem = ({ item }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
      <View>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={[styles.textStyle, styles.openTextStyle]}>
            View {item.name} Details
          </Text>
        </Pressable>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            {item.staff_id != ""  ? 
                  <Text style={styles.modalText}>
                  Member: {item.member_name}
              </Text>
                  : null}
              
              <Text style={styles.modalText}>Date: {item.date}</Text>
              <Text style={styles.modalText}>Time: {item.time}</Text>
              <Text style={styles.modalText}>Purpose: {item.purpose}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.textStyle}>Close {item.name} Details</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container} behavior="padding">
      <View style={styles.appointmentsContainer}>
        <Text style={styles.headerMessage}>
          My Appointments ({totalAppointments})
        </Text>
        
        <ScrollView style={styles.scrollView}>
        {!hasloaded ? <ActivityIndicator size="large" color="#2a3374" /> : null}
          {appointments.map((item) => (
            <ListItem key={item.id} item={item} />
          ))}
        </ScrollView>
        <TouchableOpacity onPress={goToHome} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewAppointmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd",
  },
  appointmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20%",
    marginBottom: "20%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  headerMessage: {
    marginTop: 5,
    marginBottom: 20,
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#2a3374",
    marginVertical: 5,
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  buttonClose: {
    backgroundColor: "#f11737",
    paddingHorizontal: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  openTextStyle: {
    fontSize: 16,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "red",
    width: "30%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
