import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ActivityIndicator} from 'react-native'
import axios from 'react-native-axios'
import { createStackNavigator } from 'react-navigation'
import Home from './home'
import ColPicker from './Light/ColorPicker'
import HomeMusic from './Musique/Home'
import Radio from './Musique/Radio'
import Sounds from './Musique/Sounds'
import AmbianceList from './Ambiances/ambiance'
import AmbianceAdd from './Ambiances/addAmbiance'

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// })

// var instance = axios.create({
//   baseURL: 'http://192.168.1.103:5000/',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
// })

const Perso = createStackNavigator({
  Home: { screen: Home },
  ColorPicker: {screen: ColPicker},
  Sound: { screen: HomeMusic },
  RadioSelector: { screen: Radio },
  AmbianceSelector: { screen: AmbianceList },
  addAmbiance: { screen : AmbianceAdd },
  SoundSelector: {screen: Sounds}
  },
  {navigationOptions: {
    headerStyle: {
      backgroundColor: 'lightgrey',
      textAlign: 'center'
    },
    headerTitleStyle: {
      flex: 1,
      fontWeight: 'bold',
      padding: 'auto',
      textAlign: 'center',
    }
  }}
)
export default Perso
