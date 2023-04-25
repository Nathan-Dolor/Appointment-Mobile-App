import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { db } from '../firebase';
import { collection, query, where, getDocs, doc } from "firebase/firestore";

const ViewAppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);
    
    const handleViewing = async () => {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        setAppointments([]);
        await querySnapshot.forEach((doc) => {
          setAppointments(current => [...current, doc.data()]);
        });
        console.log(appointments)
    }

  return (
    <View>
      <Button title='Get data' onPress={handleViewing}/>
      {appointments.map(d => {
        return (<Text>{d.date}, {d.time}</Text>);
        })}
    </View>
  )
}

export default ViewAppointmentsScreen

const styles = StyleSheet.create({})