import {
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc } from "firebase/firestore";

const ViewAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      setAppointments([]);
      const id = auth.currentUser?.uid;
      let currentAppointment = 1;
      await querySnapshot.forEach((doc) => {
        if (doc.data().user_id == id) {
            setAppointments((current) => [
                ...current,
                {
                  id: doc.id,
                  name: "Appointment " + currentAppointment,
                  staff_id: doc.data().staff_id,
                  date: doc.data().date,
                  time: doc.data().time,
                  purpose: doc.data().purpose,
                },
                
              ]) 
              currentAppointment += 1;
        } else if (doc.data().staff_id == id) {
            setAppointments((current) => [
                ...current,
                {
                  id: doc.id,
                  name: "Appointment " + currentAppointment,
                  user_id: doc.data().user_id,
                  date: doc.data().date,
                  time: doc.data().time,
                  purpose: doc.data().purpose,
                },
                
              ]) 
              currentAppointment += 1;
        }
        
        
      });
      console.log(appointments);
    }
    fetchData();
  }, []);

  //   return (
  //     <View>
  //       {appointments.map((data, key) => {
  //         if (data.user_id == auth.currentUser.uid) {
  //           return [
  //             <Text>
  //               {data.date}, {data.time}
  //             </Text>,
  //             <Modal
  //         animationType="slide"
  //         transparent={true}
  //         visible={modalVisible}
  //         onRequestClose={() => {
  //           Alert.alert('Modal has been closed.');
  //           setModalVisible(!modalVisible);
  //         }}>
  //         <View style={styles.centeredView}>
  //           <View style={styles.modalView}>
  //             <Text style={styles.modalText}>Hello World!</Text>
  //             <Pressable
  //               style={[styles.button, styles.buttonClose]}
  //               onPress={() => setModalVisible(!modalVisible)}>
  //               <Text style={styles.textStyle}>Hide Modal</Text>
  //             </Pressable>
  //           </View>
  //         </View>
  //       </Modal>,
  //             <Pressable
  //               style={[styles.button, styles.buttonOpen]}
  //               onPress={() => setModalVisible(true)}
  //             >
  //               <Text style={styles.textStyle}>Show Modal</Text>
  //             </Pressable>,
  //           ];
  //         }
  //       })}

  //     </View>
  //   );

  const ListItem = ({ item }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
      <View>
        {/* <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text>{item.name}</Text>
        </TouchableOpacity> */}
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.textStyle}>{item.name}</Text>
        </Pressable>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{item.staff_id ? "Staff: "+item.staff_id : "Member: "+item.user_id}</Text>
              <Text style={styles.modalText}>Date: {item.date}</Text>
              <Text style={styles.modalText}>Time: {item.time}</Text>
              <Text style={styles.modalText}>Purpose: {item.purpose}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View>
      {appointments.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </View>
  );
};

export default ViewAppointmentsScreen;

const styles = StyleSheet.create({
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
