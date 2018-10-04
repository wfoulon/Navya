import React, {Component} from 'react'
import {Image, ImageBackground, TouchableOpacity, StyleSheet, Text, ScrollView, View, ActivityIndicator, Switch} from 'react-native'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import ls from 'react-native-local-storage'
import axios from 'react-native-axios'
const hexRgb = require('hex-rgb')
import FAIcon from 'react-native-vector-icons/FontAwesome'
import Overlay from 'react-native-modal-overlay'
const AllImg = {
  tropical: require('../../../Resources/ImageAmbiance/tropical.png'),
  work: require('../../../Resources/ImageAmbiance/work.png'),
  party: require('../../../Resources/ImageAmbiance/party.png'),
  chill: require('../../../Resources/ImageAmbiance/chill.png'),
  theme1: require('../../../Resources/ImageAmbiance/theme1.jpeg'),
  theme2: require('../../../Resources/ImageAmbiance/theme2.jpeg'),
  theme3: require('../../../Resources/ImageAmbiance/theme3.jpeg'),
  theme4: require('../../../Resources/ImageAmbiance/theme4.jpeg'),
  theme5: require('../../../Resources/ImageAmbiance/theme5.jpeg'),
  theme6: require('../../../Resources/ImageAmbiance/theme6.jpeg'),
  theme7: require('../../../Resources/ImageAmbiance/theme7.jpeg'),
  theme8: require('../../../Resources/ImageAmbiance/theme8.jpeg'),
  theme9: require('../../../Resources/ImageAmbiance/theme9.jpeg'),
  theme10: require('../../../Resources/ImageAmbiance/theme10.jpeg'),
  theme11: require('../../../Resources/ImageAmbiance/theme11.jpeg'),
  theme12: require('../../../Resources/ImageAmbiance/theme12.jpeg'),
  theme13: require('../../../Resources/ImageAmbiance/theme13.jpeg'),
  boum: require('../../../Resources/multicircle.png')
}

export default class AmbianceList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      all: [],
      loading: true,
      selected: null,
      current: null,
      currentShare: null,
      currentName: null,
      isVisible: false,
      currentCopy: null
    }
    this.axios = null
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

  static navigationOptions = {
    title: 'Atmospheres'
  }
  _SelectAmbiance = (e, item) => {
    e.preventDefault()
    let {selected} = this.state
    let rgb = item.color !== 'BOUM' ? hexRgb(item.color) : item.color
    let soundLevel = item.soundLevel || item.soundLevel === 0 ? item.soundLevel : 50
    let bright = item.light || item.light === 0 ? item.light : 0.5 
    ls.get('OnTheRoad').then((road) => {
      this.axios.post('/ChangeColor', {rgb, bright, on: selected === item.name || !road ? false: true})
      this.axios.post('/ChangeVolume', {vol: soundLevel})
      .then((res) => {
        this.axios.post('/ChangeAmbiance', {sound: item.sound, id: item.soundId, on: selected === item.name || !road ? false: true})
        .then((res) => {
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
        })
      })
    })
  }

  _CloseModal = (e) => {
    this.setState({isVisible: false})
  }
  
  _HandleOn = (btn) => {
    this.setState({currentShare: btn})
    this.axios.post('/ChangeShare', {id: this.state.current, value: btn})
    .then((res) => {
      ls.get('id').then((data) => {
        this.axios.post('/GetAll/Ambiance', {id: data})
          .then((res) => {
            this.setState({
              all: res.data,
              loading: false
            })
          })
      })
    })
  }

  _handleDelete = (e) => {
    e.preventDefault()
    this.axios.post('/Delete/Ambiance', {id: this.state.current})
    .then(() => {
      if (this.state.selected === this.state.currentName) {
        this.setState({selected: null})
        ls.save('CurrentAmbianceName', null).then(() => {
          this.axios.post('/SendUpdate', {data: true})
        })
      }
      ls.get('id').then((data) => {
        this.axios.post('/GetAll/Ambiance', {id: data})
          .then((res) => {
            this.setState({
              all: res.data,
              loading: false,
              isVisible: false
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
    const {selected} = this.state
    console.log(this.state.all)
    return (
      <ScrollView style={{flex: 1}}>
        {!this.state.loading ?
        this.state.all.map((item) => (
          <Card
            key={item.id}
            title={item.name}
            imageStyle={{height: 400}}
            image={AllImg[item.image]}
            containerStyle={{marginBottom: 30}}
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
            <Button
              icon={<Icon name='code' color='#ffffff' />}
              backgroundColor={selected === item.name ? 'lightgrey' : '#03A9F4'}
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title={selected === item.name ? 'USED' : 'USE THIS AMBIANCE'}
              onPress={e => this._SelectAmbiance(e, item)}  
            />
            {item.uid !== -1 &&
            <TouchableOpacity
              style={{...styles.colorOption, backgroundColor: 'lightgrey'}}
              onPress={(e) => this.setState({isVisible: true, current: item.id, currentShare: item.all === "true" ? true : false, currentName: item.name, currentCopy: item.copy})}
            >
              <FAIcon
                name={'gears'}
                size={25}
                color='grey'
              />
            </TouchableOpacity>}
          </Card>
        )) : 
        <ActivityIndicator size={50} />
        }
        <Overlay visible={this.state.isVisible}
          animationType="bounceIn"
          containerStyle={{backgroundColor: 'rgba(60, 60, 60, 0.78)', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}
          closeOnTouchOutside
          onClose={e => this._CloseModal(e)}
          childrenWrapperStyle={{backgroundColor: '#eee', height: '20%', width: '50%'}}
          animationDuration={500}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>Change settings for : {this.state.currentName}</Text>
          {this.state.currentCopy === 'false' &&
          <View style={styles.btnOn}>
            <Text style={{color: 'black', fontSize: 20,}}>Share :</Text>
            <Switch value={this.state.currentShare} onValueChange={this._HandleOn} />
          </View> }
          <View style={{flex:1, position: 'absolute', flexDirection: 'row', bottom: 40, justifyContent: 'space-around', width: '100%'}}>
              <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: '#d33434'}]} onPress={e => this._handleDelete(e)}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  {/* <FAIcon name="delete" size={30} color="white" /> */}
                  <Text style={{fontSize: 25, color: 'white'}}>DELETE</Text>
                </View>
              </TouchableOpacity>
            </View>
        </Overlay>
      </ScrollView>
    )
  }
}

const styles = {
  colorOption: {
    borderWidth: 1,
    position: 'absolute',
    top: 15,
    right: 15,
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
  btnOn: {
    height: 60,
    width: '95%',
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
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
  }
};
