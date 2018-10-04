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
  Form,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
let act = false

export default class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      mess: null
    }
    // this.socket = this.props.socket
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  componentDidMount = () => {
    this.socket.on('ConResp', (data) => {
      if (data.res !== true && this.state.mess === null && act === false && this.socket !== null) {
        this.setState({
            mess: data.res
        })
        act = true
      } else if (data.res === true) act = false
    })
  }

  componentWillMount = () => {
    this.socket = this.props.socket
  }

  // componentWillUnmount = () => {
  //   this.socket = null
  // }

  _handlePress = (e) => {
    e.preventDefault()
    this.props.connect(this.state.email, this.state.password)
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name='user' size={30} />
          <TextInput style={styles.inputs}
              value={this.state.email}
              placeholder="Username"
              keyboardType="default"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name='lock' size={30} />
          <TextInput style={styles.inputs}
              value={this.state.password}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>
        {this.state.mess !== null ?
          <Text style={{color: 'red', fontSize: 15}}>{this.state.mess}</Text> : null
        }
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={(e) => {this._handlePress(e)}} >
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        {/* <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
            <Text>Forgot your password?</Text>
        </TouchableHighlight> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 400,
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
    color: 'white',
  }
})
