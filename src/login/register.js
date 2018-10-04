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

export default class RegisterPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email   : '',
      pwd: '',
      pwdconf: '',
      mess: null,
      color: null
    }
    this.socket = this.props.socket
    this._handleRegister = this._handleRegister.bind(this)
    this.socket.on('RegRes', (data) => {
      this.setState({
        color: data.color,
        mess: data.mess
      })
    })
  }

  _handleRegister = (e) => {
    e.preventDefault()
    const {email, pwd, pwdconf} = this.state
    if (pwd === pwdconf) {
      this.socket.emit('Register', {email, pwd})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name='envelope' size={30} />
          <TextInput style={styles.inputs}
              placeholder="Login"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name='lock' size={30} />
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(pwd) => this.setState({pwd})}/>
        </View>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name='lock' size={30} />
          <TextInput style={styles.inputs}
              placeholder="Confirm password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(pwdconf) => this.setState({pwdconf})}/>
        </View>
        {this.state.mess !== null ?
          <Text style={{color: `${this.state.color}`, fontSize: 15}}>{this.state.mess}</Text> : null
        }
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={(e) => this._handleRegister(e)}>
          <Text style={styles.loginText}>Register</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 465,
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
    color: 'white',
  }
})
