import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native'
import { Rating, AirbnbRating } from 'react-native-ratings'
// import { Overlay, Button, Divider } from 'react-native-elements'
import Overlay from 'react-native-modal-overlay'
import MapView from 'react-native-maps'
var ls = require('react-native-local-storage')
import { Marker } from 'react-native-maps'
import GooglePlacesInput from './googleAC'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import axios from 'react-native-axios'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import AmbianceList from './PreAmb'
const hexRgb = require('hex-rgb')

export default class HomePAge extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      TrajectOk: false,
      coords: null,
      power: false,
      isVisible: false,
      loading: true,
      finishOverlay: false,
      onTheRoad: false,
      ambianceName: null,
      saved: null,
      saveInput: '',
      comment: '',
      rate: 3,
      all: [],
      marker: [{id: '1', icon: require('./Image/shuttle2.png'), latlng: {latitude: 48.8295062, longitude: 2.2880239}, title: 'Home', description: 'Starting point'}, {id: '2', icon: require('./Image/flag-end.png'), latlng: {latitude: 0, longitude: 0}, title: 'Destination', description: 'Arrival point'}]
    }
    this.mapRef = null
    this.decode = (t,e) => {for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})}
    this._PlaceMarker = this._PlaceMarker.bind(this)
    this._CloseModal = this._CloseModal.bind(this)
    this._LeGo = this._LeGo.bind(this)
  }
  static navigationOptions = {
    title: 'Home',
  }


  _PlaceMarker = (latitude, longitude) => {
    let marker = this.state.marker
    ls.save('latitude', latitude).then(() => {
      ls.save('longitude', longitude).then(() => {})
    })
    marker[1].latlng = {latitude, longitude}
    const mode = 'driving'; // 'walking';
    const origin = marker[0].latlng.latitude + ',' + marker[0].latlng.longitude;
    const destination = latitude + ',' + longitude;
    const APIKEY = 'AIzaSyC3bxqN8BKmXKsUWIvYmVRWn60hpVAEXJI';
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=${mode}`;
    fetch(url)
    .then(response => response.json())
    .then(responseJson => {
        if (responseJson.routes.length) {
            this.setState({
                coords: this.decode(responseJson.routes[0].overview_polyline.points),
                power: true // definition below
            });
        }
    }).catch(e => {console.warn(e)})
    this.setState({
      marker,
      TrajectOk: true
    })
  }

  _TraceRoute = () => {
    if (this.state.power){
    setTimeout(() => {
        this.mapRef.fitToSuppliedMarkers(this.state.marker.map(item => item.id), true)
    }, 400);
      setTimeout(() => {
        this.setState({TrajectOk: true, power: false})
      }, 2000);
    }
  }

  componentWillUnmount() {
    this.mapRef = null
    this.setState({power: false, isVisible: false})
  }
  
  componentWillMount = () => {
    ls.get('baseUrl').then((data) => {
      var instance = axios.create({
        baseURL: data,
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
      })
      this.axios = instance
    })
    ls.get('OnTheRoad').then((onTheRoad) => {
      this.setState({onTheRoad})
    })
    ls.get('latitude').then((lat) => {
      ls.get('longitude').then((long) => {
        if (lat && long)
          this._PlaceMarker(lat, long)
      })
    })
  }

  _CloseModal = (e) => {
    // e.preventDefault()
    this.setState({isVisible: false})
  }
  
  _LeGo = (e) => {
    e.preventDefault()
    this._TraceRoute()
    ls.save('OnTheRoad', !this.state.onTheRoad).then(() => {
      ls.get('CurrentRadioState').then((RadioState) => {
        ls.get('CurrentRadioId').then((RadioId) => {
          ls.get('CurrentOutput').then((output) => {
            ls.get('CurrentColorVal').then((color) => {
              ls.get('CurrentLightState').then((light) => {
                ls.get('CurrentLightLevel').then((level) => {
                  ls.get('CurrentVolume').then((volume) => {
                    if (!color) {
                      color = "#000000"
                    }
                    let rgb = color !== 'BOUM' && color ? hexRgb(color) : color
                    output = output === 'radio' ? 'Radio' : 'Sounds'
                    if (this.state.onTheRoad) {
                      this.axios.post('/ChangeAmbiance', {sound: output, id: RadioId, on: false})
                      this.axios.post('/DimColor', {rgb, bright: level, on: light})
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
                    } else {
                      volume = volume || volume === 0 ? volume : 50
                      this.axios.post('/ChangeVolume', {vol: volume})
                      .then((res) => {
                        if (light && color) {
                          this.axios.post('/ChangeColor', {rgb, bright: level})
                        }
                        if (!RadioState && RadioId && output) {
                          this.axios.post('/ChangeAmbiance', {sound: output, id: RadioId})
                          .then((result) => {
                          })
                        }
                      })
                    }
                    this.setState({isLoading: false, onTheRoad: !this.state.onTheRoad})
                  })
                })
              })
            })
          })
        })
      })
    })
  }

  _HandleFinish = (e) => {
    ls.get('CurrentAmbianceName').then((name) => {
      this.setState({finishOverlay: true, ambianceName: name})
    })
  }

  _GoodBye = (e) => {
    e.preventDefault()
    let { rate, comment } = this.state
    ls.get('id').then((uid) => {
      this.axios.post('/SendComment', {uid, comment, rate})
      .then((res) => {
        this.setState({
          isLoading: false,
          TrajectOk: false,
          coords: null,
          power: false,
          isVisible: false,
          loading: true,
          finishOverlay: false,
          onTheRoad: false,
          ambianceName: null,
          saved: null,
          saveInput: '',
          comment: '',
          rate: 3,
          all: [],
          marker: [{id: '1', icon: require('./Image/shuttle2.png'), latlng: {latitude: 48.8295062, longitude: 2.2880239}, title: 'Home', description: 'Starting point'}, {id: '2', icon: require('./Image/flag-end.png'), latlng: {latitude: 0, longitude: 0}, title: 'Destination', description: 'Arrival point'}]
        })
      })
    })
  }

  _SaveAmbiance = (e) => {
    ls.get('CurrentRadioName').then((RadioName) => {
      ls.get('CurrentRadioId').then((RadioId) => {
        ls.get('CurrentRadioState').then((RadioState) => {
          ls.get('CurrentOutput').then((output) => {
            ls.get('CurrentColorVal').then((color) => {
              ls.get('CurrentLightState').then((light) => {
                ls.get('CurrentVolume').then((volume) => {
                  ls.get('CurrentLightLevel').then((level) => {
                    ls.get('CurrentImage').then((image) => {
                      ls.get('id').then((uid) => {
                        let name = this.state.saveInput
                        this.axios.post('/SendUpdate', {data: true})
                        this.axios.post('/Create/Ambiance', {uid, name, image, RadioName, RadioState, RadioId, output, color, light, level, volume})
                        this.setState({saved: this.state.saveInput})
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
  render() {
    const {marker} = this.state
      // if (this.state.marker[1].latlng.latitude !== 0)
      //   this._TraceRoute()
      return (
        <View style={stylesMap.container}>
          <MapView
          ref={(ref) => { this.mapRef = ref }}
          style={stylesMap.map}
          initialRegion={{
            latitude: 48.8468477,
            longitude: 2.3291115,
            latitudeDelta: 0.222,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => {this._PlaceMarker(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}}
          >
          {marker.map((item) => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={item.latlng}
              title={item.title}
              description={item.description}
              style={{backgroundColor: 'blue', width: 10, height: 10}}
              image={item.icon}
            />
          ))}
            {this.state.coords ?
            <MapView.Polyline
              coordinates={[
                  {latitude: marker[0].latlng.latitude, longitude: marker[0].latlng.longitude}, // optional
                  ...this.state.coords,
                  {latitude: marker[1].latlng.latitude, longitude: marker[1].latlng.longitude}, // optional
              ]}
              strokeWidth={6}
              strokeColor='#0082c8'
            /> : null }
          </MapView>
            {this.state.TrajectOk ?
              this.state.onTheRoad ?
              <TouchableOpacity style={[styles.buttonContainer3, {backgroundColor: '#977ead'}]} onPress={e => {this._LeGo(e); this._HandleFinish(e)}}>
                {this.state.isLoading ?
                  <ActivityIndicator size={100} color='white' /> :
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                  <Text style={[styles.loginText, {fontSize: 25}]}>Stop the trip </Text>
                  <FAIcon name="check" size={30} color="white" />
                </View>
                }
              </TouchableOpacity>
              :
              <TouchableOpacity style={[styles.buttonContainer, styles.loginButton, {backgroundColor: '#0082c8'}]} onPress={e => {this._LeGo(e)}}>
                {this.state.isLoading ?
                  <ActivityIndicator size={100} color='white' /> :
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                  <Text style={styles.loginText}>GO</Text>
                  <FAIcon name="location-arrow" size={30} color="white" />
                </View>
                }
              </TouchableOpacity>
            : null}
            {!this.state.onTheRoad &&
              <TouchableOpacity style={[styles.buttonContainer2, {backgroundColor: 'lightgrey'}]} onPress={e => {e.preventDefault(); this.setState({isVisible: true})}}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
                  <Text style={[styles.loginText, {fontSize: 32}]}>Pre-select an atmosphere</Text>
                  {/* <FAIcon name="location-arrow" size={30} color="white" /> */}
                </View>
              </TouchableOpacity>
            }
          <GooglePlacesInput placeMarker={this._PlaceMarker} />
          <Overlay visible={this.state.isVisible}
            animationType="zoomIn"
            containerStyle={{backgroundColor: 'rgba(60, 60, 60, 0.78)'}}
            closeOnTouchOutside
            onClose={e => this._CloseModal(e)}
            childrenWrapperStyle={{backgroundColor: '#eee', height: '60%', width: '100%'}}
            animationDuration={500}>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>Choose an atmopshere to use :</Text>
            <AmbianceList />
          </Overlay>
          <Overlay visible={this.state.finishOverlay}
            animationType="zoomIn"
            containerStyle={{backgroundColor: 'rgba(60, 60, 60, 0.78)'}}
            // closeOnTouchOutside
            // onClose={e => this._CloseModal(e)}
            childrenWrapperStyle={{backgroundColor: 'white', height: 800, width: '100%'}}
            animationDuration={500}>
            <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: 20}}>Your trip is over !</Text>
            <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: 20}}>We hope you enjoyed it !</Text>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>You can rate this trip :</Text>
              <Rating
                showRating
                type='heart'
                onFinishRating={rating => console.log(rating)}
                ratingBackgroundColor='transparent'
                style={{ paddingVertical: 10, backgroundColor: 'transparent' }}
              />
            </View>
            <View style={{height: 200, width: '100%', flexDirection: 'column'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>And leave a comment :</Text>
              <TextInput style={styles.inputs2}
                value={this.state.comment}
                placeholder="Your feedback"
                multiline = {true}
                numberOfLines = {4}
                keyboardType="default"
                underlineColorAndroid='lightgrey'
                onChangeText={(comment) => this.setState({comment})}/>
            </View>
            {!this.state.ambianceName && !this.state.saved &&
            <View style={{width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: 10}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>If you liked the atmosphere</Text>
              {!this.state.OnSave ?
                <TouchableOpacity style={[styles.buttonContainer5, {backgroundColor: 'lightgrey', width: '30%'}]} onPress={e => this.setState({OnSave: true})}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontSize: 25, color: 'white', marginRight: 15,}}>SAVE IT</Text>
                      <FAIcon
                        name={'save'}
                        size={25}
                        color='white'
                      />
                    </View>
                </TouchableOpacity>
                :
                <View style={{width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: 10}}>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                      value={this.state.newName}
                      placeholder="Name"
                      keyboardType="default"
                      underlineColorAndroid='lightgrey'
                      onChangeText={(saveInput) => this.setState({saveInput})}/>
                  </View>
                  <TouchableOpacity style={[styles.buttonContainer5, {backgroundColor: 'lightgrey', width: 50, height: 50}]} onPress={e => this._SaveAmbiance(e)}>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <FAIcon
                          name={'save'}
                          size={35}
                          color='white'
                        />
                      </View>
                  </TouchableOpacity>
                </View>
              }
            </View>
            }
            {this.state.saved &&
             <View style={{width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: 10}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>Saved as {this.state.saved}!</Text>
             </View>
            }
            <TouchableOpacity style={[styles.buttonContainer4, {backgroundColor: '#337ed2'}]} onPress={e => this._GoodBye(e)}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 25, color: 'white', marginRight: 15,}}>GOODBYE</Text>
                  <FAIcon
                    name={'hand-stop-o'}
                    size={25}
                    color='white'
                  />
                </View>
            </TouchableOpacity>
            {/* <AmbianceList /> */}
          </Overlay>
        </View>
      )
  }
}

const stylesMap = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    elevation: 2
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

const styles = StyleSheet.create({
  buttonContainer: {
    height:45,
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:60,
    width: 150,
    height: 150,
    borderRadius:100,
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
  inputs2:{
    height:450,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  buttonContainer4: {
    height:45,
    position: 'absolute',
    bottom: 10,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:60,
    width: '35%',
    marginLeft: 20,
    height: 40,
    borderRadius:20,
  },
  buttonContainer5: {
    height:45,
    // position: 'absolute',
    // bottom: 10,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom:60,
    width: '35%',
    marginLeft: 20,
    height: 40,
    borderRadius:20,
  },
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
  buttonContainer3: {
    height:45,
    position: 'absolute',
    bottom: 10,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:60,
    width: 350,
    height: 40,
    borderRadius:20,
  },
  buttonContainer2: {
    height:45,
    position: 'absolute',
    bottom: 10,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom:60,
    width: 400,
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
