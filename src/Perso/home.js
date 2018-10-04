import { List, ListItem } from 'react-native-elements'
import React, {Component} from 'react'
import {Image, ImageBackground, TouchableOpacity, TextInput, Text, ScrollView, View, ActivityIndicator, TouchableHighlight} from 'react-native'
var ls = require('react-native-local-storage')
import SocketIOClient from 'socket.io-client'
import axios from 'react-native-axios'
import {MKButton, MKColor, MKSlider} from 'react-native-material-kit'
import Overlay from 'react-native-modal-overlay'
import FAIcon from 'react-native-vector-icons/FontAwesome'
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

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: true,
      image: null,
      isVisible: false,
      Ambiance: null,
      overCreate: false,
      newName: '',
      RadioName: null,
      RadioState: null,
      RadioId: null,
      output: null,
      color: null,
      light: 0.5,
      level: null,
      volume: 50
    }
    this.axios = null
  }

  componentWillMount = () => {
    ls.get('baseUrl').then((data) => {
      this.socket = SocketIOClient(data)
      this.socket.on('UpdateSet', (data) => {
        this._GetSettings()
      })
      var instance = axios.create({
        baseURL: data,
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
      })
      this.axios = instance
      this._GetSettings()
    })
  }

  _GetSettings = () => {
    ls.get('CurrentImage').then((image) => {
      ls.get('CurrentAmbianceName').then((Ambiance) => {
        ls.get('CurrentRadioState').then((RadioState) => {
          ls.get('CurrentRadioId').then((RadioId) => {
            ls.get('CurrentOutput').then((output) => {
              ls.get('CurrentColorVal').then((color) => {
                ls.get('CurrentLightState').then((light) => {
                  ls.get('CurrentLightLevel').then((level) => {
                    ls.get('CurrentVolume').then((volume) => {
                      ls.get('CurrentRadioName').then((RadioName) => {
                        if (!image)
                          image = 'tropical'
                        this.setState({image, Ambiance, RadioName, RadioState, RadioId, output, color, light, level, volume})
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

  static navigationOptions = {
    title: 'Customization'
  }
  _CloseModal = (e) => {
    // e.preventDefault()
    this.setState({isVisible: false, overCreate: false})
  }

  _ChangeImage = (e, image) => {
    e.preventDefault()
    this.setState({image, Ambiance: null})
    ls.save('CurrentImage', image).then(() => {
      ls.save('CurrentAmbianceName', null)
    })
  }

  _CreateAmb = (e) => {
    e.preventDefault()
    let name = this.state.newName
    if (name.length > 0) {
      let {RadioName, RadioState, RadioId, output, color, light, level, volume, image} = this.state
      ls.get('id').then((uid) => {
        this.axios.post('/Create/Ambiance', {uid, name, image, RadioName, RadioState, RadioId, output, color, light, level, volume})
          .then((res) => {
            this.setState({overCreate: false})
            ls.save('CurrentAmbianceName', name).then(() => {
              this.axios.post('/SendUpdate', {data: true})
            })
          })
      })
    }
  }
  render () {
    const list = [
      {
        title: 'Sounds',
        icon: 'music-note',
        link: 'Sounds',
        rightTitle: 'Select Playing sound',
        nav: 'Sound'
      },
      {
        title: 'Light',
        icon: 'highlight',
        link: 'ColorPicker',
        rightTitle: 'Customize ambiant light',
        nav: 'ColorPicker'
      }
    ]
    const list2 = {
      title: 'Atmosphere Selector',
      icon: 'highlight',
      link: 'AmbianceSelector',
      rightTitle: 'Select ambiance',
      nav: 'AmbianceSelector'
    }
    const list3 = {
      title: 'Get Ambiances from users',
      icon: 'add-box',
      link: 'addAmbiance',
      rightTitle: 'Add',
      nav: 'addAmbiance'
    }
    const { navigate } = this.props.navigation
    return (
      <ImageBackground style={{flex: 1, resizeMode: 'center', backgroundColor: 'white'}} source={require('../../Resources/background.png')}>
        <Image style={{resizeMode: 'stretch', width: '100%', height: 300, marginTop: 20}} source={AllImg[this.state.image]}/>
        <View style={{position: 'absolute', top: 20, right: 5}} >
          <TouchableOpacity
            style={{...styles.colorOption, backgroundColor: 'lightgrey'}}
            onPress={(e) => this.setState({isVisible: true})}
          >
            <FAIcon
              name={'pencil-square-o'}
              size={25}
              color='grey'
            />
          </TouchableOpacity>
        </View>
        <List>
          <ListItem
            key={list2.title}
            title={list2.title}
            leftIcon={{name: list2.icon}}
            rightTitle={list2.rightTitle}
            onPress={e => {e.preventDefault(); navigate(list2.nav, {socket: this.socket})}}
          />
        </List>
        <List>
          {
            list.map((item) => (
              <ListItem
                key={item.title}
                title={item.title}
                leftIcon={{name: item.icon}}
                rightTitle={item.rightTitle}
                onPress={e => {e.preventDefault(); navigate(item.nav, {socket: this.socket})}}
              />
            ))
          }
        </List>
        <List>
          <ListItem
            key={list3.title}
            title={list3.title}
            leftIcon={{name: list3.icon}}
            rightTitle={list3.rightTitle}
            onPress={e => {e.preventDefault(); navigate(list3.nav, {socket: this.socket})}}
          />
        </List>
        <Overlay visible={this.state.isVisible}
            animationType="zoomIn"
            containerStyle={{backgroundColor: 'rgba(60, 60, 60, 0.78)'}}
            closeOnTouchOutside
            onClose={e => this._CloseModal(e)}
            childrenWrapperStyle={{backgroundColor: '#eee', height: '60%', width: '100%'}}
            animationDuration={500}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>Choose a picture :</Text>
            {/* <AmbianceList /> */}
            <ScrollView style={{flex: 1, width: '100%'}} >
              <View style={{flex: 1, width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                {Object.keys(AllImg).map((item, index) => {
                  return (
                    <TouchableOpacity style={{width: '50%', height: 200, marginTop: 20, marginBottom: 20}} key={index}  onPress={e => this._ChangeImage(e, item)}>
                      <View style={{flex: 1}}>
                        <Image key={index} style={{resizeMode: 'stretch', width: '95%', height: 200}} source={AllImg[item]}/>
                        {this.state.image === item &&
                          <FAIcon name="check-circle-o" size={60} color="white" style={{position: 'absolute', top: '40%', left: '40%'}}/>
                        }
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </ScrollView>
          </Overlay>
          {!this.state.Ambiance &&
            <TouchableOpacity style={[styles.buttonContainer3, {backgroundColor: 'black'}]} onPress={e => this.setState({overCreate: true})}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <Text style={{fontSize: 25, color: 'white'}}>Create a new atmosphere with current settings </Text>
                <FAIcon name="plus-circle" size={30} color="white" />
              </View>
            </TouchableOpacity>
          }
          <Overlay visible={this.state.overCreate}
            animationType="fadeInUp"
            containerStyle={{backgroundColor: 'rgba(60, 60, 60, 0.78)'}}
            closeOnTouchOutside
            onClose={e => this._CloseModal(e)}
            childrenWrapperStyle={{backgroundColor: '#eee', height: 600, width: '100%'}}
            animationDuration={500}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>Create an atmosphere :</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                value={this.state.newName}
                placeholder="Name"
                keyboardType="default"
                underlineColorAndroid='transparent'
                onChangeText={(newName) => this.setState({newName})}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Image : </Text>
              <Image style={{resizeMode: 'stretch', width: '80%', height: 100}} source={AllImg[this.state.image]} />
            </View>
            <View style={{flexDirection: 'row', height: 40, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginBottom: 80}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Color : </Text>
              {this.state.color  && this.state.light?
              <View
                  style={{...styles.colorOption, backgroundColor: this.state.color}}
                  key={this.state.color}
                  >
                  {this.state.color === 'BOUM' &&
                    <Image source={AllImg['boum']} style={{resizeMode: 'stretch', width: 30, height: 30}} />
                  }
              </View>
              : <Text style={{fontSize: 20, fontWeight: 'bold'}}>None</Text>}
            </View>
            <View style={{flexDirection: 'row', height: 40, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginBottom: 100}}>
              {this.state.output ?
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.state.output === 'radio' ? 'Radio : ' : 'Music : '}{this.state.RadioName}</Text>
                : <Text style={{fontSize: 20, fontWeight: 'bold'}}>No Sound</Text>
              }
            </View>
            <View style={{flex:1, position: 'absolute', flexDirection: 'row', bottom: 40, justifyContent: 'space-around', width: '100%'}}>
              <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: '#d33434'}]} onPress={e => this.setState({overCreate: false, newName: ''})}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  {/* <FAIcon name="delete" size={30} color="white" /> */}
                  <Text style={{fontSize: 25, color: 'white'}}>CANCEL</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity disabled={this.state.newName.length === 0 ? true: false} style={[styles.buttonContainer, {backgroundColor: this.state.newName.length === 0 ? 'lightgrey' : '#337ed2'}]} onPress={e => this._CreateAmb(e)}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 25, color: 'white'}}>CREATE</Text>
                  {/* <FAIcon name="plus-circle" size={30} color="white" /> */}
                </View>
              </TouchableOpacity>
            </View>
          </Overlay>
      </ImageBackground>
    )
  }
}

const styles = {
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:450,
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
  colorOption: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginHorizontal: 10,
    // marginVertical: 10,
    borderRadius: 15,
    elevation: 1,
    // color: 'transparent'
    shadowOffset: {width: 2, height: 2,},
    shadowColor: 'black',
    shadowOpacity: .25,
  },
  buttonContainer: {
    height:45,
    // position: 'absolute',
    // bottom: 10,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom:60,
    width: '45%',
    marginLeft: 20,
    height: 40,
    borderRadius:20,
  },
  buttonContainer3: {
    height:45,
    position: 'absolute',
    bottom: 10,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:60,
    width: '95%',
    marginLeft: 20,
    height: 40,
    borderRadius:20,
  }
};
