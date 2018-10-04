import { Text, View, Image } from 'react-native';
import React, { Component } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

export default class GooglePlacesInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDisp: false
    }
    this._onFocus = this._onFocus.bind(this)
  }
  

  _onFocus = (e) => {
    this.setState({listDisp: !this.state.listDisp})
  }
  render () {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed={this.state.listDisp}    // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description} // custom description render
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          this.props.placeMarker(details.geometry.location.lat, details.geometry.location.lng)
        }}
        textInputProps={{onFocus: this._onFocus, onBlur: this._onFocus}}
        
        getDefaultValue={() => ''}
        
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyC3bxqN8BKmXKsUWIvYmVRWn60hpVAEXJI',
          language: 'fr', // language of the results
          types: 'geocode' // default: 'geocode'
        }}
        
        styles={{
          container: {
            // flex:1,
            backgroundColor: 'transparent',
            // position: 'absolute',
            // top: 0,
            width: '100%',
            // elevation: 2
          },
          textInputContainer: {
            width: '100%',
            backgroundColor: 'rgba(114, 114, 114, 0.64)',
            height: 60,
            // elevation: 2
          },
          textInput: {
            height: 45,
          },
          description: {
            fontWeight: 'bold',
            // backgroundColor: 'red',
            // elevation: 2
          },
          predefinedPlacesDescription: {
            color: 'black',
            // backgroundColor: 'red',
            // elevation: 2
          },
          listView: {
            backgroundColor: 'rgba(114, 114, 114, 0.64)'
          }
        }}
        
        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'food'
        }}

        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        predefinedPlaces={[homePlace, workPlace]}

        debounce={0} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
        // renderRightButton={() => <Text>Custom text after the input</Text>}
      />
    );
  }
}
