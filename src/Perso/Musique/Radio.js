import React, {Component} from 'react';
import {TextInput, FlatList, Platform, StyleSheet, Text, ScrollView, View, ActivityIndicator, TouchableHighlight} from 'react-native'
var ls = require('react-native-local-storage')
import axios from 'react-native-axios'
import RNPickerSelect from 'react-native-picker-select'
import SocketIOClient from 'socket.io-client'
import { List, ListItem } from 'react-native-elements'
import FAIcon from 'react-native-vector-icons/FontAwesome'
let list = null

export default class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all: null,
      selected: null,
      list: null,
      search: '',
      curOutput: null
    }
    this._ChangeRadio = this._ChangeRadio.bind(this)
  }
  
  static navigationOptions = {
    title: 'Radio'
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
        this.axios.post('/GetAll/Radio', {data: true})
        .then((result) => {
          ls.get('CurrentRadioName').then((data) => {
            ls.get('CurrentOutput').then((output) => {
              // this.setState({selected: data})
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
        return {title: val.name, value: {radio: val.freq, id: val.id, name: val.name}}
      })
      list = test
    }
  }
  
  _ChangeRadio = (e, value) => {
    e.preventDefault()
    if (this.state.selected !== value.name) {
      ls.get('OnTheRoad').then((road) => {
        this.axios.post('/ChangeRadio', {data: true, url: road ? value.radio : null})
        .then((res) => {
          ls.save('CurrentRadioName', value.name).then(() => {
            ls.save('CurrentRadioId', value.id).then(() => {
              ls.save('CurrentRadioState', value.name ? false : true).then(() => {
                ls.save('CurrentOutput', value.name === null ? null : 'radio').then(() => {
                  ls.save('CurrentAmbianceName', null).then(() => {
                    this.socket.emit('ChangeRadio', {current: 'radio', name: value.name, id: value.id})
                    this.setState({selected: value.name, curOutput: 'radio'})
                  })
                })
              })
            })
          })
        })
      })
    }
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
                hideChevron={selected === null || curOutput !== 'radio' ? false : true}
                rightIcon={<FAIcon
                  name={'check'}
                  size={25}
                  color='blue'
                />}
                onPress={e => this._ChangeRadio(e, {name: null, id: null, radio: null})}
                />
            </List>
            <List>
              {list.map((item) => (
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
              )}
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
