import React, {Component} from 'react'
import {Image, ImageBackground, TouchableOpacity, StyleSheet, Text, ScrollView, View, ActivityIndicator, Switch} from 'react-native'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import ls from 'react-native-local-storage'
import axios from 'react-native-axios'
import StarRating from 'react-native-star-rating'

export default class AllComments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      all: [],
      loading: true,
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
    this.axios.post('/GetAll/Comments', {id: data})
      .then((res) => {
        this.setState({
          all: res.data,
          loading: false
        })
      })
    })
  }

  static navigationOptions = {
    title: 'Comments'
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
      <ScrollView style={{flex: 1}}>
        {!this.state.loading ?
        this.state.all.map((item) => (
          <Card
            key={item.id}
            title={`Comment by : ${item.user}`}
            containerStyle={{marginBottom: 30}}
          >
            <View style={{marginBottom: 20, flexDirection: 'row', alignItems: 'center',}}>
              <Text style={{marginRight: 10, fontSize: 18}}>
                Rate : 
              </Text>
                <StarRating
                  disabled
                  maxStars={5}
                  rating={item.note}
                  fullStarColor='#f4d442'
                />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginBottom: 10, fontSize: 18}}>
                Comment : {item.comment}
              </Text>
            </View>
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
