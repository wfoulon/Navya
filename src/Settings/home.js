import React, {Component} from 'react';
import { List, ListItem } from 'react-native-elements'
import {ImageBackground, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity} from 'react-native'
import { Container, Content, Footer, FooterTab, Icon, Header } from 'native-base'
import { Button, Divider } from 'react-native-elements'
import Main from '../Main'
import SocketIOClient from 'socket.io-client'
let ls = require('react-native-local-storage')
const hexRgb = require('hex-rgb')
import axios from 'react-native-axios'

export default class SetPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount = () => {
    ls.get('baseUrl').then((data) => {
      this.socket = SocketIOClient(data)
      var instance = axios.create({
        baseURL: data,
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
      })
      this.axios = instance
    })
  }
  

  _GoColor = (e) => {
    e.preventDefault()
    this.props.navigation.navigate(
      'ColorPicker')
  }
  
  static navigationOptions = {
    title: 'Settings'
  }

  _HandleDisconnect = (e) => {
    e.preventDefault()
    // ls.remove('baseUrl')
    ls.remove('login')
    ls.remove('id')
    this.socket.emit('Diconnect')
  }

  _handleChangeIp = (e) => {
    e.preventDefault()
    ls.remove('baseUrl')
    this.socket.emit('UpdateIp')
  }

  _ResetAll = (e) => {
    e.preventDefault()
    let rgb = hexRgb('#ffffff')
    this.axios.post('/ChangeColor', {rgb, bright: 0.5, on: false})
      this.axios.post('/ChangeAmbiance', {sound: 'Sounds', id: 1, on: false})
      .then((res) => {
        ls.save('CurrentRadioName', null).then(() => {
          ls.save('CurrentRadioId', null).then(() => {
            ls.save('CurrentRadioState', null).then(() => {
              ls.save('CurrentOutput', null).then(() => {
                ls.save('CurrentColorVal', '#ffffff').then(() => {
                  ls.save('CurrentLightState', null).then(() => {
                    ls.save('CurrentAmbianceName', null).then(() => {
                      ls.save('OnTheRoad', null).then(() => {
                        ls.save('latitude', null).then(() => {
                          ls.save('longitude', null).then(() => {})
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
  }

  _RestartPi = (e) => {
    e.preventDefault()
    this.axios.post('/Restart/Pi', {data: true})
  }

  _ShutPi = (e) => {
    e.preventDefault()
    this.axios.post('/Shutdown/Pi', {data: true})
  }
  render () {
    const { navigate } = this.props.navigation
    return (
      <ImageBackground style={{flex: 1, resizeMode: 'center', backgroundColor: 'white'}} source={require('../../Resources/background.png')}>
        <List>
          <ListItem
            title={'Comments'}
            leftIcon={{name: 'star'}}
            rightTitle={'See all comments'}
            onPress={e => {e.preventDefault(); navigate('Comments', {socket: this.socket})}}
          />
        </List>
        <View style={{flex:1, justifyContent: 'flex-end', alignItems: 'center',}} >
          <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: '#d33434'}]}  onPress={e => this._HandleDisconnect(e)}>
            <Text style={{fontSize: 40, color: 'white'}}>Disconnect</Text>
          </TouchableOpacity>
          <View style={{width: '100%', flexDirection: 'row', height: 35, justifyContent: 'space-between'}}>
            <TouchableOpacity style={[styles.buttonContainer, {alignSelf: 'flex-end', backgroundColor: '#7889a3', width: '15%', height: 30}]} onPress={e => this._RestartPi(e)}>
              <Text style={{fontSize: 15, color: 'white'}}>Restart pi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonContainer, {alignSelf: 'flex-end', backgroundColor: '#7889a3', width: '15%', height: 30}]} onPress={e => this._handleChangeIp(e)}>
              <Text style={{fontSize: 15, color: 'white'}}>Change Ip</Text>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%', flexDirection: 'row', height: 35, justifyContent: 'space-between'}}>
            <TouchableOpacity style={[styles.buttonContainer, {alignSelf: 'flex-end', backgroundColor: '#7889a3', width: '15%', height: 30}]} onPress={e => this._ShutPi(e)}>
              <Text style={{fontSize: 15, color: 'white'}}>Shutdown pi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonContainer, {alignSelf: 'flex-end', backgroundColor: '#7889a3', width: '15%', height: 30}]} onPress={e => this._ResetAll(e)}>
              <Text style={{fontSize: 15, color: 'white'}}>Reset all</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  buttonContainer: {
    height:50,
    // position: 'absolute',
    // bottom: 10,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom:60,
    width: '90%',
    marginBottom: 20,
    // borderRadius:20,
  }
})
