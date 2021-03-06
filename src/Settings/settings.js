import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ActivityIndicator} from 'react-native'
import axios from 'react-native-axios'
import { createStackNavigator } from 'react-navigation'
import SetPage from './home'
import AllComments from './Comments'

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

const Settings = createStackNavigator({
  Home: { screen: SetPage },
  Comments: { screen: AllComments}
})
export default Settings
