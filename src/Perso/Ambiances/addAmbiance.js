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

export default class AmbianceAdd extends Component {
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
      ls.get('id').then((data) => {
        this.axios.post('/GetAll/AmbianceNew', {id: data})
          .then((res) => {
            this.setState({
              all: res.data,
              loading: false
            })
          })
      })
    })
  }

  _GetAmbiance = (e, item) => {
    e.preventDefault()
    ls.get('id').then((uid) => {
      this.axios.post('/Copy/Ambiance', {uid, id: item.id})
      .then((res) => {
        this.axios.post('/GetAll/AmbianceNew', {id: uid})
          .then((res) => {
            this.axios.post('/SendUpdate', {data: true})
            this.setState({
              all: res.data,
              loading: false
            })
          })
      })
    })
  }

  static navigationOptions = {
    title: 'Atmospheres'
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
            <Text style={{marginBottom: 10, fontSize: 18}}>
              {`${item.sound}:  ${item.soundName}`}
            </Text>
            <Button
              icon={<Icon name='code' color='#ffffff' />}
              backgroundColor={item.already === true ? 'lightgrey' : '#03A9F4'}
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title={item.already === true ? 'ADDED' : 'ADD'}
              disabled={item.already}
              onPress={e => this._GetAmbiance(e, item)}  
            />
          </Card>
        )) : 
        <ActivityIndicator size={50} />
        }
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
