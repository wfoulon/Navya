import React, {Component} from 'react';
import {TouchableOpacity, ImageBackground, Text, View, ScrollView, ActivityIndicator, Dimensions, StyleSheet, Switch, Animated} from 'react-native'
import { Container, Content, Footer, FooterTab, Button, Icon, Header } from 'native-base'
// import { ColorWheel } from 'react-native-color-wheel'
import { ColorPicker, fromHsv, toHsv } from 'react-native-color-picker'
const hexRgb = require('hex-rgb')
var ls = require('react-native-local-storage')
import axios from 'react-native-axios'
import Slider from 'react-native-slider'
import ColorPalette from './Plugins/Palette'
import PaletteDelete from './Plugins/PaletteDelete'
import FAIcon from 'react-native-vector-icons/FontAwesome'

export default class ColPicker extends Component {
  constructor(props) {
    super(props);
    this.axios = null,
    this.state = {
      slider: 0.5,
      switchOn: false,
      hexVal: '#ff0000',
      fadeAnim: new Animated.Value(0),
      color: toHsv('white'),
      colorPalete: [],
      delPalette: [],
      modifPalette: false
    }
  }

  componentWillMount = () => {
    ls.get('baseUrl').then((data) => {
      var instance = axios.create({
        baseURL: data,
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
      })
      this.axios = instance
      ls.get('CurrentLightState').then((btn) => {
        ls.get('id').then((data) => {
          ls.get('CurrentLightLevel').then((level) => {
            ls.get('CurrentColorVal').then((color) => {
              this.axios.post('/GetPalette', {id: data})
                .then((res) => {
                  let del = res.data.slice(4)
                  this.setState({
                    colorPalete: res.data,
                    delPalette: del,
                    switchOn: btn,
                    slider: level,
                    hexVal: color,
                    color: toHsv(color)
                  })
                })
            })
          })
        })
      })
    })

  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 100,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  _HandleChange = (val) => {
    val.s = 1
    val.v = 1
    this.setState({color: val})
    val = fromHsv(val)
    let rgb = hexRgb(val)
    this.setState({hexVal: val})
    ls.get('OnTheRoad').then((road) => {
      this.axios.post('/ChangeColor', {rgb, bright: this.state.slider, on: road})
      ls.save('CurrentColorVal', val).then(() => {
        ls.save('CurrentAmbianceName', null).then(() => {})
      })
    })
  }
  
  static navigationOptions = {
    title: 'Select light color'
  }

  _HandleChangeBright = (bright) => {
    this.setState({
      slider: bright
    })
    ls.get('OnTheRoad').then((road) => {
      this.axios.post('/ChangeBright', {bright, on: road})
      ls.save('CurrentLightLevel', bright).then(() => {})
    })
  }

  _HandleOn = (btn) => {
    this.setState({
      switchOn: btn
    })
    ls.get('OnTheRoad').then((road) => {
      this.axios.post('/onOff', {btn: btn && road ? true : false, rgb: this.state.hexVal})
      ls.save('CurrentLightState', btn).then(() => {})
    })
  }

  _addColor = (e) => {
    e.preventDefault()
    let colPal = this.state.colorPalete
    let cur = this.state.hexVal
    let found = colPal.find(function(element) {
      return element === cur
    })
    if (!found) {
      colPal.push(cur)
      let delPalette = colPal.slice(4)
      this.setState({colorPalete: colPal, delPalette})
      ls.get('id').then((data) => {
        this.axios.post('/AddColorPalette', {palette: colPal, id: data})
      })
    }
  }

  _HandlePaletteChange = (color) => {
    let delPalette = color.slice(4)
    this.setState({hexVal: color, color: toHsv(color), delPalette})
    let rgb = color !== 'BOUM' ? hexRgb(color) : color
    ls.get('OnTheRoad').then((road) => {
      this.axios.post('/ChangeColor', {rgb, bright: this.state.slider, on: road})
      ls.save('CurrentColorVal', color).then(() => {
        ls.save('CurrentAmbianceName', null).then(() => {})
      })
    })
  }

  _HandlePaletteDelete = (color) => {
    let colPal = this.state.colorPalete
    colPal.splice(4 + color, 1)
    let delPalette = colPal.slice(4)
    this.setState({colorPalete: colPal, delPalette})
    ls.get('id').then((data) => {
      this.axios.post('/AddColorPalette', {palette: colPal, id: data})
    })
  }

  _HandleDeleteMode = (e) => {
    e.preventDefault()
    this.setState({
      modifPalette: !this.state.modifPalette
    })
  }
  render () {
    let {fadeAnim} = this.state
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
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 15,
        elevation: 1,
        // color: 'transparent'
        shadowOffset: {width: 2, height: 2,},
        shadowColor: 'black',
        shadowOpacity: .25,
      }
    };
    this.state.color.s = 1
    this.state.color.v = 1
    return (
      <ImageBackground style={{flex: 1, resizeMode: 'center', backgroundColor: 'white'}} source={require('../../../Resources/background.png')}>
        <ScrollView style={{height: '100%'}}>
          <View style={styles.btnOn}>
            <Text style={{color: 'black', fontSize: 20,}}>On / OFF</Text>
            <Switch value={this.state.switchOn} onValueChange={this._HandleOn} />
          </View>
          <Animated.View style={this.state.switchOn === true ? {flex: fadeAnim, height: '100%'} : {height: 0}}>
            <View style={styles.pickerContent}>
              <ColorPicker
                onColorSelected={color => this._HandleChange(color)}
                onColorChange={color => this._HandleChange(color)}
                color={this.state.color}
                style={styles.picker}
                hideSliders
              />
            </View>
            <View style={styles.pickerContent2}>
            {this.state.colorPalete.length > 4 ?
            <View style={{position: 'absolute', top: 5, right: 5}} >
              <TouchableOpacity
                style={{...PaletteDeleteStyles.colorOption, backgroundColor: 'lightgrey'}}
                onPress={(e) => this._HandleDeleteMode(e)}
              >
                <FAIcon
                  name={'pencil-square-o'}
                  size={25}
                  color='grey'
                />
              </TouchableOpacity>
            </View> : null }
            {this.state.modifPalette === false || this.state.colorPalete.length === 4 ?
              <ColorPalette
                style={{alignSelf: 'flex-end'}}
                onChange={color => this._HandlePaletteChange(color)}
                value={this.state.hexVal}
                colors={this.state.colorPalete}
                title={"Color Palette:"}
                _addColor={this._addColor}
              />
              :
              <PaletteDelete
                style={{alignSelf: 'flex-end'}}
                onChange={color => this._HandlePaletteDelete(color)}
                // value={this.state.hexVal}
                colors={this.state.delPalette}
                title={"Delete:"}
              />
            }
            </View>
            <View style={[styles.slideContent, {alignItems: 'center'}]}>
              <Text style={{color: 'black', fontSize: 20}}>Color according to your needs</Text>
              <View style={{width: '70%', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 10}} >
                <TouchableOpacity onPress={e => {e.preventDefault(); this._HandleChange(toHsv("#00ff00"))}} style={{flex: 1, height: 40, borderWidth: 2, borderBottomColor: 'black', borderLeftColor: 'transparent', borderTopColor: 'transparent'}}>
                  <Text style={[this.state.hexVal === '#00ff00' ? {color: '#00ff00'} : {color: 'black'}, {fontSize: 25, alignSelf: 'center'}]}>Creativity</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={e => {e.preventDefault(); this._HandleChange(toHsv("#ff0000"))}} style={{flex: 1, height: 40, borderWidth: 2, borderBottomColor: 'black', borderLeftColor: 'transparent', borderTopColor: 'transparent'}}>
                  <Text style={[this.state.hexVal === '#ff0000' ? {color: '#ff0000'} : {color: 'black'}, {fontSize: 25, alignSelf: 'center'}]}>Sports</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={e => {e.preventDefault(); this._HandleChange(toHsv("#eeff00"))}} style={{flex: 1, height: 40, borderWidth: 2, borderBottomColor: 'black', borderLeftColor: 'transparent', borderTopColor: 'transparent', borderRightColor: 'transparent'}}>
                  <Text style={[this.state.hexVal === '#eeff00' ? {color: '#eeff00'} : {color: 'black'}, {fontSize: 25, alignSelf: 'center'}]}>Appetite</Text>
                </TouchableOpacity>
              </View>
              <View style={{width: '90%', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}} >
                <TouchableOpacity onPress={e => {e.preventDefault(); this._HandleChange(toHsv("#0000ff"))}} style={{flex: 1, height: 40, borderWidth: 2, borderBottomColor: 'black', borderLeftColor: 'black', borderTopColor: 'transparent'}}>
                  <Text style={[this.state.hexVal === '#0000ff' ? {color: '#0000ff'} : {color: 'black'}, {fontSize: 25, alignSelf: 'center'}]}>Rest</Text>
                </TouchableOpacity>
                {/* <View style={{flex: 1, height: 40, borderWidth: 2, borderBottomColor: 'black', borderLeftColor: 'transparent', borderTopColor: 'transparent'}}>
                  <Text>Sports</Text>
                </View>
                <View style={{flex: 1, height: 40, borderWidth: 2, borderBottomColor: 'black', borderLeftColor: 'transparent', borderTopColor: 'transparent', borderRightColor: 'transparent'}}>
                  <Text>Appetite</Text>
                </View> */}
              </View>
            </View>
            <View style={styles.slideContent}>
              <Text style={{color: 'black', fontSize: 20}}>Brightness</Text>
              <Slider
                value={this.state.slider}
                onValueChange={(value) => this._HandleChangeBright(value)}
                trackStyle={customStyles2.track}
                thumbStyle={customStyles2.thumb}
                minimumTrackTintColor={this.state.hexVal}
                // maximumTrackTintColor='#b7b7b7'
                thumbTouchSize={{width: 100, height: 40}}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    flex: 1
  },
  container: {
    marginTop: 65,
  },
  pickerContent: {
    flex: 3,
    minHeight: 500,
    maxHeight: 500,
    padding: 10,
    marginTop: 20,
    backgroundColor: '#edededf0'
  },
  pickerContent2: {
    flex: 3,
    // minHeight: 500,
    padding: 10,
    marginTop: 20,
    backgroundColor: '#edededf0'
  },
  slideContent: {
    padding: 10,
    marginTop: 20,
    backgroundColor: '#edededf0'
  },
  btnOn: {
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  }
})

var iosStyles = StyleSheet.create({
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  }
})

var customStyles2 = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderColor: '#30a935',
    borderWidth: 2,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  }
})
