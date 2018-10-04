import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View, Text} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome'

export default class PaletteDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.defaultColor || this.props.value || this.props.colors[0]
    };
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({color: nextProps.value})
    }
  }

  getContrastColor(hex) {
    return (parseInt(hex.substring(1), 16) > 0xffffff / 2) ? 'black' : 'white';
  }

  onChange(color, key) {
    this.setState({color: color}, () => this.props.onChange(key))
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
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 15,
        elevation: 5,
        shadowOffset: {width: 2, height: 2,},
        shadowColor: 'black',
        shadowOpacity: .25,
      }
    };
    return (
      <View style={{flex: 1}}>
        <Text>{this.props.title}</Text>
        <View style={{...PaletteDeleteStyles.colorContainer, ...this.props.paletteStyles}}>
          {this.props.colors.map((color, key) => {
            return (
              <TouchableOpacity
                style={{...PaletteDeleteStyles.colorOption, backgroundColor: color}}
                onPress={() => this.onChange(color, key)}
                key={color}
              >
              </TouchableOpacity>
            );
          })}
        </View>
        {/* <View style={{...PaletteDeleteStyles.colorContainer, ...this.props.paletteStyles}}>
          <TouchableOpacity
            style={{...PaletteDeleteStyles.colorOption, backgroundColor: '#FFFFFF', marginTop: 30}}
            onPress={(e) => this.props._addColor(e)}
            key={'#FFFFFF'}
          >
            <FAIcon
              name={'plus-circle'}
              size={25}
              color={this.getContrastColor('#FFFFFF')}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}
PaletteDelete.defaultProps = {
  colors: [
    '#C0392B', '#E74C3C', '#9B59B6', '#8E44AD', '#2980B9', '#3498DB',
    '#1ABC9C', '#16A085', '#27AE60', '#2ECC71', '#F1C40F', '#F39C12',
    '#E67E22', '#D35400', '#ffffff', '#BDC3C7', '#95A5A6', '#7F8C8D',
    '#34495E', '#2C3E50', '#000000'
  ],
  defaultColor: null,
  value: null,
  title: "Color Palette:",
  onChange: () => {},
  paletteStyles: {}
};

PaletteDelete.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  onChange: PropTypes.func,
  defaultColor: PropTypes.string,
  value: PropTypes.string,
  paletteStyles: PropTypes.shape({})
};
