import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
    const navigation = useNavigation();
  const goToLoginScreen = () => {
    navigation.navigate("Login");
  };

  const goToRegisterScreen = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container} behavior="padding">
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Text style={styles.header}>Booker</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
          onPress={goToLoginScreen}
          style={[styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToRegisterScreen} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#A4D6F0'
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
  },
  logo: {
    width: 90,
    height: 70,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#f11737",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "#A4D6F0",
    width: "100%",
    padding: 12,
    marginBottom: 5,
    borderColor: "#2a3374",
    borderWidth: 3,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#2a3374",
    fontWeight: "700",
    fontSize: 16,
  },
});
