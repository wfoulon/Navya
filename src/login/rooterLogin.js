import React, {Component} from 'react';
import {ImageBackground, TouchableHighlight, Platform, StyleSheet, Text, View, ActivityIndicator, Image} from 'react-native'
import axios from 'react-native-axios'
import LoginPage from './login'
import RegisterPage from './register'

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'
let ls = require('react-native-local-storage')

class mainPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      backLog: '#00b5ec',
      backReg: 'black',
      cur: 'log'
    }
    this.socket = this.props.socket
  }

  _handleButton = (e, name) => {
    e.preventDefault()
    if (name === 'log') {
      this.setState({
        cur: name,
        backLog: '#00b5ec',
        backReg: 'black'
      })
    } else {
      this.setState({
        cur: name,
        backReg: '#00b5ec',
        backLog: 'black'
      })
    }
  }

  _handleChangeIp = (e) => {
    e.preventDefault()
    ls.remove('baseUrl')
    this.socket.emit('UpdateIp')
  }
  render () {
    return (
      // <View style={{flex: 1, backgroundColor: '#DCDCDC'}} >
      <ImageBackground style={{flex: 1, resizeMode: 'center', backgroundColor: 'black'}} source={require('../../Resources/background.png')}>
      <View style={{position: 'absolute', bottom: 0, right: 0, width: 'auto'}} >
        <Button onPress={e => this._handleChangeIp(e)} title='Change Ip' />
      </View>
      {/* <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '70%',
            backgroundColor: 'transparent'
          }}
        >
        <Image source={require('../../Resources/NavyaCab.jpg')} style={styles.image}/>
        </View> */}
        <View style={{marginTop: 200, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', width: '70%', justifyContent: 'space-between'}}>
            <TouchableHighlight style={[styles.buttonContainer, styles.loginButton, {backgroundColor: this.state.backLog}]} onPress={e => this._handleButton(e, 'log')}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingRight: 30,}}>
                <Icon name="user" size={30} color="white" />
                <Text style={styles.loginText}>Login</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.buttonContainer, styles.loginButton, {backgroundColor: this.state.backReg}]} onPress={e => this._handleButton(e, 'reg')}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingRight: 30,}}>
                <Icon name="plus-circle" size={30} color="white" />
                <Text style={styles.loginText}>Register</Text>
              </View>
            </TouchableHighlight>
            {/* <Icon.Button onPress={e => this._handleButton(e, 'log')} name='user' backgroundColor={this.state.backLog} style={{width: 200, marginLeft: 20}}>
              <Text style={{fontFamily: 'Arial', fontSize: 40}}>Login</Text>
            </Icon.Button>
            <Icon.Button onPress={e => this._handleButton(e, 'reg')} name='plus-circle' backgroundColor={this.state.backReg} style={{width: 200, marginLeft: 20}} >
              <Text style={{fontFamily: 'Arial', fontSize: 40}}>Register</Text>
            </Icon.Button> */}
          </View>
        </View>
            <View style={this.state.cur === 'log' ? {flex: 1} : {display: 'none'}}>
              <LoginPage connect={this.props.connect} socket={this.props.socket} />
            </View>
            <View style={this.state.cur === 'reg' ? {flex: 1} : {display: 'none'}}>
              <RegisterPage socket={this.props.socket}/>
            </View>
          </ImageBackground>
      // </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    // position: 'absolute',
    resizeMode: 'contain',
    flex: 1,
    // left: 0
    width: '100%',
    // top: 0,
    // height: 138,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    fontSize: 20,
    color: 'white',
  }
})

export default mainPage
