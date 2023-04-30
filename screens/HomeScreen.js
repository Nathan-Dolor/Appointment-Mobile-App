import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";

const HomeScreen = () => {
  const [user, setUser] = useState("");
  const navigation = useNavigation();
  const [hasloaded, setHasLoaded] = useState(false);

  const goToBookingScreen = () => {
    navigation.navigate("BookAppointment");
  };

  const goToViewAppointmentsScreen = () => {
    navigation.navigate("ViewAppointments");
  };

  const goToViewAllAppointmentsScreen = () => {
    navigation.navigate("ViewAllAppointments");
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "users", auth.currentUser?.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
    
      setHasLoaded(true);
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
    {!hasloaded ? <ActivityIndicator size="large" color="#2a3374" /> : [
      <Image key={1} style={styles.logo} source={require("../assets/user-icon.png")} />,
      <Text key={2} style={styles.headerMessage}>
        {user.first_name} {user.last_name}
      </Text>,
      <TouchableOpacity
      key={3}
        onPress={goToViewAppointmentsScreen}
        style={styles.button}
      >
        <Text style={styles.buttonText}>My Appointments</Text>
      </TouchableOpacity>,
      user.type == "staff" ? (
        <TouchableOpacity
          onPress={goToViewAllAppointmentsScreen}
          style={styles.button}
        >
          <Text style={styles.buttonText}>All Appointments</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity key={4} onPress={goToBookingScreen} style={styles.button}>
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>
      ),

      <TouchableOpacity key={5} onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    ]}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
  },
  logo: {
    width: 70,
    height: 70,
  },
  button: {
    backgroundColor: "#2a3374",
    width: "60%",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  signOutButton: {
    backgroundColor: "#f11737",
    width: "30%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 55,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  headerMessage: {
    marginTop: 5,
    marginBottom: 40,
    fontSize: 18,
  },
});
