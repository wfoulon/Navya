import React, { Component } from 'react'
import {Platform, StyleSheet, Text, View, ActivityIndicator} from 'react-native'
import HomePAge from './Home/home'
import Perso from './Perso/Perso'
import Settings from './Settings/settings'
// import Music from './Musique/Music'
// import Home from './Perso/Home'
import axios from 'react-native-axios'
var ls = require('react-native-local-storage')

export default class MainRooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '1'
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      current: nextProps.active
    })
  }
  
  render() {
    const {current} = this.state
    return (
      <View style={{flex: 1}}>
        <View style={current === '1' ? {flex: 1} : {display: 'none'}}>
          <HomePAge />
        </View>
        <View style={current === '2' ? {flex: 2} : {display: 'none'}}>  
          <Perso />
        </View>
        {/* <View style={current === '3' ? {flex: 1} : {display: 'none'}}>  
          <Music />
        </View> */}
        <View style={current === '5' ? {flex: 1} : {display: 'none'}}>  
          <Settings disco={this.props.disco}/>
        </View>
      </View>
    )
    // if (current === '1') {
    //   return (
    //     <App />
    //   )
    // } else if (current === '5') {
    //   return (
    //     <Perso />
    //   )
    // } else {
    //   return (
    //     <App />
    //   )
    // }
  }
}
