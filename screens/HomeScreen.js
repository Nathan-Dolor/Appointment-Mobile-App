import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";

const HomeScreen = () => {
  const [user, setUser] = useState('');
  const navigation = useNavigation();

  const goToBookingScreen = () => {
    navigation.navigate("BookAppointment");
  }

  const goToViewAppointmentsScreen = () => {
    navigation.navigate("ViewAppointments");
  }

  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
      navigation.replace("Login")
    })
    .catch(error => alert(error.message))
  }

  useEffect(() => {
    async function fetchData(){
      const docRef = doc(db, "users", auth.currentUser?.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUser(docSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        console.log("User does not exist!");
      }
    }
    fetchData();
    
  }, [])

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/favicon.png")} />
      <Text style={styles.headerMessage}>Welcome, {user.first_name}!</Text>
      {user.type == "member" ? 
      [<TouchableOpacity
      onPress={goToBookingScreen}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>,
      <TouchableOpacity
      onPress={goToViewAppointmentsScreen}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View Appointments</Text>
      </TouchableOpacity>] : 
      [
      <TouchableOpacity
      onPress={goToViewAppointmentsScreen}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View My Appointments</Text>
      </TouchableOpacity>,
      <TouchableOpacity
      onPress={() => {}}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View All Appointments</Text>
      </TouchableOpacity>
      ]}
      
      <TouchableOpacity
      onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  headerMessage: {
    marginTop: 10,
    marginBottom: 40,
    fontSize: 18,
  }
})