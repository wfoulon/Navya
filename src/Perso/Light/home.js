import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ActivityIndicator} from 'react-native'
import { Container, Content, Footer, FooterTab, Icon, Header } from 'native-base'
import { Button, Divider } from 'react-native-elements'

export default class Home extends Component {
  constructor(props) {
    super(props);
    
  }

  _GoColor = (e) => {
    e.preventDefault()
    this.props.navigation.navigate(
      'ColorPicker')
  }
  
  static navigationOptions = {
    title: 'Personalisation'
  }
  render () {
    return (
      <View >
        <Button onPress={e => this._GoColor(e)} title='Select a color' />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  }
})
