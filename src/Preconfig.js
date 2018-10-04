import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  Form
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Main from './Main'
let ls = require('react-native-local-storage')
import SocketIOClient from 'socket.io-client'
import SplashScreen from 'react-native-smart-splash-screen'

export default class PreConfig extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ip: null,
      ipIn: ''
    }
    // this.socket = null
  }

  _handlePress = (e) => {
    e.preventDefault()
    let ip = 'http://' + this.state.ipIn + ':5000'
    ls.save('baseUrl', ip).then(() => {
      if (!this.socket) {
        this.socket = SocketIOClient(ip)
      }
      this.setState({
        ip: ip
      })
    })
  }

  _handleChange = (e) => {
    this.socket = null
    this.setState({ip: null, ipIn: ''})
  }
  
  componentWillMount = () => {
    ls.get('baseUrl').then((data) => {
      if (data && !this.socket) {
        this.socket = SocketIOClient(data)
        this.setState({
          ip: data
        })
      }
    })
  }

  componentDidMount() {
    SplashScreen.close({
      animationType: SplashScreen.animationType.scale,
      duration: 850,
      delay: 500,
    })
  }

  render () {
    if (this.state.ip === null || !this.socket) {
      return (
        <View style={styles.container}>        
          <View style={styles.inputContainer}>
            <Icon style={styles.inputIcon} name='lock' size={30} />
            <TextInput style={styles.inputs}
                value={this.state.password}
                placeholder="IP"
                underlineColorAndroid='transparent'
                onChangeText={(ipIn) => this.setState({ipIn})}/>
          </View>
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={(e) => {this._handlePress(e)}} >
          <Text style={styles.loginText}>Send</Text>
        </TouchableHighlight>
      </View>
      )
    } else {
      this.socket.on('ChangeIp', (data) => {this._handleChange()})
      return (<Main socket={this.socket}/>)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
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
    color: 'white',
  }
})
