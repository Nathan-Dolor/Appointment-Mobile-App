import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import SwitchSelector from "react-native-switch-selector";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTogglePasswordVisibility } from "../hooks/useTogglePasswordVisibility";

const RegisterScreen = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("member");
  const [lunch_hour, setLunchHour] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  const navigation = useNavigation();
  const lunch_hours = ["11am - 12pm", "12pm - 1pm"];

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const handleRegister = async () => {
    await createUserWithEmailAndPassword(
      auth,
      email,
      password,
      first_name,
      last_name,
      type,
      lunch_hour
    )
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user.email);
        const newUserRef = doc(db, "users", auth.currentUser?.uid);
        type == "member"
          ? setDoc(newUserRef, {
              first_name,
              last_name,
              email,
              type,
            })
          : setDoc(newUserRef, {
              first_name,
              last_name,
              email,
              type,
              lunch_hour,
            });
      })
      .catch((error) => alert(error.message));
  };

  function toggleSwitch(value) {
    value
      ? (setType("staff"), setIsEnabled(true))
      : (setType("member"), setIsEnabled(false));
  }

  const goToLogin = () => {
    navigation.replace("Login");
  };

  return (
    <View style={styles.container} behavior="padding">
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="First Name"
          value={first_name}
          onChangeText={(text) => setFirstName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={last_name}
          onChangeText={(text) => setLastName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>
      <View style={styles.passwordInputContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize="none"
          enablesReturnKeyAutomatically
          textContentType="newPassword"
          autoCorrect={false}
          style={styles.passwordInput}
          secureTextEntry={passwordVisibility}
        />
        <Pressable onPress={handlePasswordVisibility}>
          <MaterialCommunityIcons name={rightIcon} size={22} color="#232323" />
        </Pressable>
      </View>
      <View style={styles.selecterContainer}>
        <SwitchSelector
          style={styles.selector}
          initial={0}
          options={[
            { label: "Member", value: false },
            { label: "Staff", value: true },
          ]}
          onPress={(value) => toggleSwitch(value)}
          buttonColor={"#2a3374"}
        />
      </View>
      <View style={styles.dropdownContainer}>
        {isEnabled ? (
          <SelectDropdown
            data={lunch_hours}
            onSelect={(selectedItem, index) => {
              setLunchHour(selectedItem);
              console.log(selectedItem, index);
            }}
            defaultButtonText={"Select Lunch Hour"}
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
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.linkContainer}>
        Already have an account?
        <Text onPress={goToLogin}>
          <Text style={styles.linkText}> Login</Text>
        </Text>
      </Text>
    </View>
  );
};

export default RegisterScreen;

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
    fontWeight: "bold",
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
  passwordInputContainer: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  passwordInput: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "90%",
  },
  selecterContainer: {
    width: "50%",
    marginTop: 5,
  },
  selector: {
    marginTop: 15,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#2a3374",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  dropdownContainer: {
    marginTop: 20,
  },
  dropdown1BtnStyle: {
    width: "80%",
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
  linkContainer: {
    marginTop: 15,
  },
  linkText: {
    color: "#f11737",
  },
});
