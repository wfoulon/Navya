import React, {Component} from 'react';
import {Image, TextInput, FlatList, Platform, StyleSheet, Text, ScrollView, View, ActivityIndicator, TouchableHighlight} from 'react-native'
var ls = require('react-native-local-storage')
import axios from 'react-native-axios'
import RNPickerSelect from 'react-native-picker-select'
import SocketIOClient from 'socket.io-client'
import { List, ListItem } from 'react-native-elements'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import SquareGrid from "react-native-square-grid"
let list = null
let listimg = {
  air: require('../../../Resources/ImageSound/air.png'),
  wind: require('../../../Resources/ImageSound/wind.png'),
  dolphin: require('../../../Resources/ImageSound/dolphin.png'),
  nature: require('../../../Resources/ImageSound/nature.png'),
  soul: require('../../../Resources/ImageSound/soul.png'),
  fluide: require('../../../Resources/ImageSound/fluide.png'),
  dream: require('../../../Resources/ImageSound/dream.png'),
  firecamp: require('../../../Resources/ImageSound/firecamp.png'),
  bird: require('../../../Resources/ImageSound/bird.png'),
  ocean: require('../../../Resources/ImageSound/ocean.png')
}

export default class Sounds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all: null,
      selected: null,
      list: null,
      search: '',
      curOutput: null
    }
    this._ChangeSound = this._ChangeSound.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }
  
  static navigationOptions = {
    title: 'Sounds'
  }

  componentWillMount = () => {
    ls.get('baseUrl').then((data) => {
      if (!this.socket)
        this.socket = this.props.navigation.state.params.socket
      if (!this.axios) {
        var instance = axios.create({
        baseURL: data,
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
        })
        this.axios = instance
        this.axios.post('/GetAll/Sounds', {data: true})
        .then((result) => {
          ls.get('CurrentRadioName').then((data) => {
            ls.get('CurrentOutput').then((output) => {
              this.setState({
                all: result.data,
                selected: data,
                curOutput: output
              })
            })
          })
        })
      }
    })
  }

  _CreateList = () => {
    let {all} = this.state
    if (all) {
      let test = this.state.all.map((val) => {
        return {title: val.name, value: {link: val.link, id: val.id, name: val.name}, image: val.image}
      })
      list = test
    }
  }
  
  _ChangeSound = (e, value) => {
    e.preventDefault()
    if (this.state.selected !== value.name) {
      ls.get('OnTheRoad').then((road) => {
        this.axios.post('/ChangeSound', {data: true, url: road ? value.link : null})
        .then((res) => {
          ls.save('CurrentRadioName', value.name).then(() => {
            ls.save('CurrentRadioId', value.id).then(() => {
              ls.save('CurrentRadioState', value.name ? false : true).then(() => {
                ls.save('CurrentOutput', value.name === null ? null : 'sound').then(() => {
                  this.socket.emit('ChangeRadio', {current: 'sound', name: value.name, id: value.id})
                  ls.save('CurrentAmbianceName', null).then(() => {})
                  this.setState({selected: value.name, curOutput: 'sound'})
                })
              })
            })
          })
        })
      })
    }
  }

  renderItem = (item) => {
      return (
        <TouchableHighlight style={styles2.item}  onPress={e => this._ChangeSound(e, item.value)}>
          <View style={this.state.selected === item.title ? styles2.contentSel : styles2.content}>
            <Image source={listimg[item.image]} />
            <Text style={styles2.text}>{item.title}</Text>
          </View>
        </TouchableHighlight>
      );
    }

  renderRow ({ item }) {
    return (
      <ListItem
        // key={item.value.id}
        title={item.title}
        hideChevron={this.state.selected === item.title ? false : true}
        // leftIcon={{name: item.icon}}
        // rightTitle={item.rightTitle ? item.rightTitle : 'Select a radio'}
        rightIcon={<FAIcon
          name={'check'}
          size={25}
          color='blue'
        />}
        onPress={e => this._ChangeRadio(e, item.value)}
      />
    )
  }

  render () {
    let {all, selected, search, curOutput} = this.state
    if (all && !list) {
      this._CreateList()
    }
    if (all && list) {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.inputContainer}>
            <FAIcon style={styles.inputIcon} name='search' size={30} />
            <TextInput style={styles.inputs}
                value={this.state.password}
                placeholder="Search"
                underlineColorAndroid='transparent'
                onChangeText={(search) => this.setState({search})}
              />
          </View>
        {list ?
          <ScrollView style={styles.container}>
            <List>
              <ListItem
                title='none'
                hideChevron={selected === null || curOutput !== 'sound' ? false : true}
                rightIcon={<FAIcon
                  name={'check'}
                  size={25}
                  color='blue'
                />}
                onPress={e => this._ChangeSound(e, {name: null, id: null, radio: null})}
                />
            </List>
            <List>
              <SquareGrid rows={0} columns={2} items={list} renderItem={this.renderItem} />
              {/* {list.map((item) => (
                <View key={item.value.id}>
                  {search === '' || item.title.search(new RegExp(search, 'i')) >= 0 ?
                  <ListItem
                    // key={item.value.id}
                    title={item.title}
                    style={{display: 'none'}}
                    hideChevron={selected === item.title ? false : true}
                    // leftIcon={{name: item.icon}}
                    // rightTitle={item.rightTitle ? item.rightTitle : 'Select a radio'}
                    rightIcon={<FAIcon
                      name={'check'}
                      size={25}
                      color='blue'
                    />}
                    onPress={e => this._ChangeRadio(e, item.value)}
                  /> : null}
                </View>
              )
              )} */}
            </List>
          </ScrollView>
          : null }
        </ScrollView>
      )
    } else {
      return (
        <View >
          <ActivityIndicator size='large'/>
        </View>
      )
    }
  }
}
const styles2 = StyleSheet.create({
  item: {
      flex: 1,
      alignSelf: "stretch",
      padding: 3
  },
  content: {
      flex: 1,
      borderStyle: 'solid',
      borderColor: '#DCDCDC',
      borderWidth: 2,
      backgroundColor: "transparent",
      alignItems: "center",
      flexDirection: 'column',
      justifyContent: "center"
  },
  contentSel: {
    flex: 1,
    borderStyle: 'solid',
    borderColor: '#00b5ec',
    borderWidth: 4,
    backgroundColor: "transparent",
    alignItems: "center",
    flexDirection: 'column',
    justifyContent: "center"
},
  text: {
      color: "#DCDCDC",
      fontSize: 32
  }
})
const styles = StyleSheet.create({
  container: {
      flex: 1,
      // backgroundColor: '#fff',
      // justifyContent: 'center',
      paddingHorizontal: 10,
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
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:'100%',
    height:45,
    marginVertical:20,
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
  }
})
