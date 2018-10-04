import React, {Component} from 'react'
import {Image, ImageBackground, TouchableOpacity, StyleSheet, Text, ScrollView, View, ActivityIndicator, TouchableHighlight} from 'react-native'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import ls from 'react-native-local-storage'
import axios from 'react-native-axios'
const hexRgb = require('hex-rgb')
const AllImg = {
  tropical: require('../../Resources/ImageAmbiance/tropical.png'),
  work: require('../../Resources/ImageAmbiance/work.png'),
  party: require('../../Resources/ImageAmbiance/party.png'),
  chill: require('../../Resources/ImageAmbiance/chill.png'),
  theme1: require('../../Resources/ImageAmbiance/theme1.jpeg'),
  theme2: require('../../Resources/ImageAmbiance/theme2.jpeg'),
  theme3: require('../../Resources/ImageAmbiance/theme3.jpeg'),
  theme4: require('../../Resources/ImageAmbiance/theme4.jpeg'),
  theme5: require('../../Resources/ImageAmbiance/theme5.jpeg'),
  theme6: require('../../Resources/ImageAmbiance/theme6.jpeg'),
  theme7: require('../../Resources/ImageAmbiance/theme7.jpeg'),
  theme8: require('../../Resources/ImageAmbiance/theme8.jpeg'),
  theme9: require('../../Resources/ImageAmbiance/theme9.jpeg'),
  theme10: require('../../Resources/ImageAmbiance/theme10.jpeg'),
  theme11: require('../../Resources/ImageAmbiance/theme11.jpeg'),
  theme12: require('../../Resources/ImageAmbiance/theme12.jpeg'),
  theme13: require('../../Resources/ImageAmbiance/theme13.jpeg'),
  boum: require('../../Resources/multicircle.png')
}

export default class AmbianceList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      all: [],
      loading: true,
      selected: null
    }
    this.axios = null
    this._SelectAmbiance = this._SelectAmbiance.bind(this)
    // this.socket = this.props.navigation.state.params.socket
  }
  componentWillMount = () => {
    ls.get('baseUrl').then((data) => {
      var instance = axios.create({
        baseURL: data,
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
      })
      this.axios = instance
      ls.get('CurrentAmbianceName').then((selected) => {
        ls.get('id').then((data) => {
          this.axios.post('/GetAll/Ambiance', {id: data})
            .then((res) => {
              this.setState({
                all: res.data,
                loading: false,
                selected
              })
            })
        })
      })
    })
  }

  _SelectAmbiance = (e, item) => {
    // e.preventDefault()
    let {selected} = this.state
    let rgb = item.color !== 'BOUM' ? hexRgb(item.color) : item.color
    let soundLevel = item.soundLevel || item.soundLevel === 0 ? item.soundLevel : 50
    let bright = item.light || item.light === 0 ? item.light : 0.5
    ls.save('CurrentRadioName', selected === item.name ? null : item.soundName).then(() => {
      ls.save('CurrentRadioId', selected === item.name ? null : item.soundId).then(() => {
        ls.save('CurrentRadioState', selected === item.name ? null : false).then(() => {
          ls.save('CurrentOutput', selected === item.name ? null : item.sound === 'Radio' ? 'radio' : 'sound').then(() => {
            ls.save('CurrentColorVal', selected === item.name ? null : item.color).then(() => {})
            ls.save('CurrentLightState', selected === item.name ? null : true).then(() => {
              ls.save('CurrentAmbianceName', selected === item.name ? null : item.name).then(() => {
                ls.save('CurrentVolume', selected === item.name ? 50 : soundLevel).then(() => {
                  ls.save('CurrentLightLevel', bright).then(() => {
                    ls.save('CurrentImage', selected === item.name ? null : item.image).then(() => {
                      this.axios.post('/SendUpdate', {data: true})
                      this.setState({selected: selected === item.name ? null : item.name})
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
  render() {
    const PaletteDeleteStyles = {
      colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
      },
      colorOption: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        // alignItems: 'center',
        justifyContent: 'flex-start',
        width: 30,
        height: 30,
        marginHorizontal: 10,
        // marginVertical: 10,
        borderRadius: 15
      }
    }
    return (
      <ScrollView style={{flex: 1, width: '100%', height: '100%'}}>
        {!this.state.loading ?
        this.state.all.map((item) => (
          <TouchableHighlight key={item.id}>
          <Card
            
            title={item.name}
            imageStyle={{height: 100}}
            image={AllImg[item.image]}
          >
          {item.color ?
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginBottom: 10, fontSize: 18}}>
                Ligth Color:  
              </Text>
              <View
                style={{...PaletteDeleteStyles.colorOption, backgroundColor: item.color}}
              >
              {item.color === 'BOUM' &&
                <Image source={AllImg['boum']} style={{resizeMode: 'stretch', width: 30, height: 30}} />
              }
              </View>
            </View>
            :
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginBottom: 10, fontSize: 18}}>
                No light
              </Text>
            </View>
            }
            <Text style={{marginBottom: 10, fontSize: 18}}>
              {`${item.sound}:  ${item.soundName}`}
            </Text>
            <TouchableHighlight style={[styles.buttonContainer2, {backgroundColor: this.state.selected === item.name ? 'lightgrey' : '#0082c8'}]} onPress={e => this._SelectAmbiance(e, item)}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                <Text style={[styles.loginText, {fontSize: 32}]}>{this.state.selected === item.name ? 'Selected' : 'Select'}</Text>
                {/* <FAIcon name="location-arrow" size={30} color="white" /> */}
              </View>
            </TouchableHighlight>
            {/* <Button
              icon={<Icon name='code' color='#ffffff' />}
              backgroundColor='#03A9F4'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='USE THIS AMBIANCE'
              onPress={e => this._SelectAmbiance(e, item)}
            /> */}
          </Card>
          </TouchableHighlight>
        )) : 
        <ActivityIndicator size={50} />
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer2: {
    height:45,
    position: 'absolute',
    bottom: 10,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom:60,
    width: 200,
    height: 40,
    borderRadius:20,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    fontSize: 40,
    color: 'white',
  }
})
