import React, { Component } from 'react';
import { Container, Content, Footer, FooterTab, Button, Icon, Header } from 'native-base';
import {Platform, Text, View, ActivityIndicator, Dimensions, StyleSheet} from 'react-native'
// import App from '../App'
import MainPage from './login/rooterLogin'
import MainRooter from './Rooter'
let ls = require('react-native-local-storage')
import SocketIOClient from 'socket.io-client'
import FAIcon from 'react-native-vector-icons/FontAwesome'

export default class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {
        active: '1',
        login: null,
        baseUrl: null
      }
      this.socket = null
  }

  _HandleBottom = (e, num) => {
    e.preventDefault()
    this.setState({
      active: num
    })
  }
  
  componentWillMount = () => {
    // ls.save('baseUrl', 'http://10.12.7.1:5000/').then(() => {
      ls.get('login').then((data) => {
        this.setState({
            login: data
        })
      })
      ls.get('baseUrl').then((data) => {
        this.setState({
          baseUrl: data
        })
      })
    // this.socket = this.props.socket
    // this.socket.on('Deconnexion', (data) => {
    //   this._HandleDisconnect()
    // })
    // this.socket.on('ConResp', (data) => {
    //   if (data.res === true) {
    //     ls.save('login', data.login)
    //     this.setState({
    //         login: data.ogin
    //     })
    //   }
    // })
  }

  // componentWillUnmount() {
  //   this.socket = null
  // }
  
  
  _HandleConnect = (login, pwd) => {
      this.socket.emit('Connexion', {login, pwd})
      // ls.save('login', login)
      // this.setState({
      //     login: login
      // })
  }

  _HandleDisconnect = () => {
      ls.remove('login')
      this.setState({
          login: null,
          active: '1'
      })
  }

  render() {
    if (this.state.baseUrl !== null) {
      if (this.socket === null) {
        this.socket = this.props.socket
        this.socket.on('Deconnexion', (data) => {
            this._HandleDisconnect()
        })
        this.socket.on('ConResp', (data) => {
          if (data.res === true && this.socket !== null) {
            ls.save('login', data.login).then(() => {
              ls.save('id', data.id).then(() => {
                this.setState({
                    login: data.login
                })
              })
            })
          }
        })
      }
      return (
        <View style={{flex: 1}}>
        {this.state.login !== null ?
        <Container>
        <View style={{flex: 1}}>
            <MainRooter active={this.state.active} disco={this._HandleDisconnect}/>
        </View>
        <Footer >
            <FooterTab style={{backgroundColor: '#0082c8'}} >
            <Button active={this.state.active === '1' ? true : false} onPress={e => this._HandleBottom(e, '1')} >
                <Icon name='map' />
            </Button>
            <Button active={this.state.active === '2' ? true : false} onPress={e => this._HandleBottom(e, '2')} >
              <View style={{flex: 1, flexDirection: 'row',}}>
                  <Icon name='ios-beaker-outline' /><Text style={{marginTop: 3, fontSize: 25, marginLeft: -10,}}>/</Text>
                  <Icon name='ios-bulb' style={{marginTop: 15, marginLeft: 5}} />
              </View>
            </Button>
            {/* <Button active={this.state.active === '3' ? true : false} onPress={e => this._HandleBottom(e, '3')} >
                <Icon name='ios-chatboxes' />
            </Button>
            <Button active={this.state.active === '4' ? true : false} onPress={e => this._HandleBottom(e, '4')} >
                <Icon name='ios-notifications' />
            </Button> */}
            <Button active={this.state.active === '5' ? true : false} onPress={e => this._HandleBottom(e, '5')} >
                <Icon name='ios-settings' />
            </Button>
            </FooterTab>
        </Footer>
        </Container>
        :
        <Container>
          <MainPage connect={this._HandleConnect} socket={this.socket} />
        </Container> }
        </View>
      )
    } else {
        return (<View />)
    }
  }
}
