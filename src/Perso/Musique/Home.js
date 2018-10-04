import { List, ListItem } from 'react-native-elements'
import React, {Component} from 'react'
import {ImageBackground, Platform, StyleSheet, Text, ScrollView, View, ActivityIndicator, TouchableHighlight} from 'react-native'
var ls = require('react-native-local-storage')
import SocketIOClient from 'socket.io-client'
import axios from 'react-native-axios'
const appStyles = require('./styles')
import {MKButton, MKColor, MKSlider} from 'react-native-material-kit'
import FAIcon from 'react-native-vector-icons/FontAwesome'

export default class HomeMusic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentRadioName: null,
      CurrentRadioId: null,
      CurrentOutput: null,
      SoundState: true,
      volume: 50,
      waiting: false
    }
    this.timeoutCheck = setTimeout(() => {
      this.setState({waiting: false});
      }, 2000)
  }
  
  componentWillMount = () => {
    ls.get('baseUrl').then((data) => {
      var instance = axios.create({
        baseURL: data,
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
        })
      this.axios = instance
      this.socket = this.props.navigation.state.params.socket
      this.socket.on('RadioChanged', (data) => {
        let name = data.name
        let current = data.current
        ls.get('CurrentRadioId').then((data) => {
          ls.get('CurrentRadioState').then((state) => {
            this.setState({
              CurrentRadioName: name,
              CurrentRadioId: data,
              SoundState: state,
              CurrentOutput: current
            })
          })
        })
      })
      ls.get('CurrentRadioName').then((data) => {
        ls.get('CurrentRadioId').then((id) => {
          ls.get('CurrentRadioState').then((state) => {
            ls.get('CurrentOutput').then((output) => {
              ls.get('CurrentVolume').then((volume) => {
                volume = volume || volume === 0 ? volume : 50
                this.setState({
                  CurrentRadioName: data,
                  CurrentRadioId: id,
                  SoundState: state,
                  CurrentOutput: output,
                  volume
                })
              })
            })
          })
        })
      })
    }) 
  }
  
  componentDidMount = () => {
    const slider = this.refs.sliderWithValue
  }

  _ChangePlay = (e, change) => {
    e.preventDefault()
    this.setState({waiting: true})
    ls.get('OnTheRoad').then((road) => {
      ls.get('CurrentRadioId').then((data) => {
        let table = this.state.CurrentOutput === 'radio' ? 'Radio' : 'Sounds'
        this.axios.post('/PlayPause', {play: !this.state.SoundState, current: data, change, on: road, volume: this.state.volume, table})
        .then((res) => {
          setTimeout(() => {
            this.setState({waiting: false});
            }, 1000)
          if (change === 0) {
            ls.save('CurrentRadioState', !this.state.SoundState).then(() => {
              ls.save('CurrentAmbianceName', null).then(() => {
                this.setState({SoundState: !this.state.SoundState})
              })
            })
          }
          else {
            ls.save('CurrentRadioName', res.data.name).then(() => {
              ls.save('CurrentRadioId', res.data.id).then(() => {
                ls.save('CurrentAmbianceName', null).then(() => {
                  this.socket.emit('ChangeRadio', {current: this.state.CurrentOutput, name: res.data.name, id: res.data.id})
                })
              })
            })
          }
        })
      })
    })
  }

  _ChangeVolume = (curValue) => {
    this.setState({volume: curValue})
    ls.save('CurrentVolume', curValue).then(() => {
      ls.save('CurrentAmbianceName', null)
      this.axios.post('/ChangeVolume', {vol: curValue})
    })
  }

  static navigationOptions = {
    title: 'Sound Settings'
  }
  render () {
    const { navigate } = this.props.navigation
    const {CurrentOutput} = this.state
    const styles = Object.assign({}, appStyles, StyleSheet.create({
      buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
      },
      fab: {
        // width: 200,
        // height: 200,
        // borderRadius: 100,
      },
      activity: {
        position: 'absolute'
      }
    }))
    const list = [
      {
        title: 'Radio',
        name: 'radio',
        icon: 'radio',
        link: 'RadioSelector',
        rightTitle: this.state.CurrentRadioName,
        rightTitle2: 'Select a radio'
      },
      {
        title: 'Sounds',
        name: 'sound',
        icon: 'music-note',
        link: 'SoundSelector',
        rightTitle: this.state.CurrentRadioName,
        rightTitle2: 'Select an ambiant Sound'
      }
    ]
    const PlainFab = MKButton.plainFab()
      .withStyle(styles.fab)
      .build()
    const max = CurrentOutput === 'radio' ? 71 : 10
    return (
    <ImageBackground style={{flex: 1, resizeMode: 'center', backgroundColor: 'white'}} source={require('../../../Resources/background.png')}>
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 10,
                      marginTop: 20,
                      backgroundColor: 'white'}}>
        <View style={{flex:1, justifyContent: 'space-around', flexDirection: 'row', marginVertical: 30, }}>
          <PlainFab 
          disabled={!this.state.CurrentRadioId || this.state.waiting || this.state.CurrentRadioId <= 1 ? true : false}
          onPress={e => this._ChangePlay(e, -1)}
          >
            <FAIcon
              name={'chevron-left'}
              size={25}
              color={!this.state.CurrentRadioId || this.state.waiting || this.state.CurrentRadioId <= 1 ? 'grey' : 'blue'}
              />
          </PlainFab>
          <PlainFab onPress={e => this._ChangePlay(e, 0)} disabled={!this.state.CurrentRadioId || this.state.waiting? true : false} >
            <View style={styles.activity}>
              <ActivityIndicator animating={this.state.waiting} hidesWhenStopped size={60} color='blue'/>
            </View>
            <FAIcon
              name={this.state.SoundState || !this.state.CurrentRadioId || this.state.waiting ? 'play' : 'pause'}
              size={25}
              color={!this.state.CurrentRadioId || this.state.waiting? 'grey' : 'blue'}
              />
          </PlainFab>
          <PlainFab
          disabled={!this.state.CurrentRadioId || this.state.waiting || this.state.CurrentRadioId >= max ? true : false}
          onPress={e => this._ChangePlay(e, +1)}
          >
            <FAIcon
              name={'chevron-right'}
              size={25}
              color={!this.state.CurrentRadioId || this.state.waiting || this.state.CurrentRadioId >= max ? 'grey' : 'blue'}
              />
          </PlainFab>
        </View>
        <MKSlider ref="sliderWithValue"
          min={0}
          max={100}
          value={this.state.volume}
          onChange={(curValue) => this._ChangeVolume(curValue)}
          trackSize={10}
          thumbRadius={15}
          // style={{margin: 15}}
        />
      </View>
        <List>
          {
            list.map((item) => (
              <ListItem
                key={item.title}
                title={item.title}
                leftIcon={{name: item.icon}}
                rightTitle={item.rightTitle && CurrentOutput === item.name ? item.rightTitle : item.rightTitle2}
                onPress={e => navigate(item.link, {socket: this.socket})}
              />
            ))
          }
        </List>
      </ScrollView>
    </ImageBackground>
    )
  }
}
