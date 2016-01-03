const React = require('react-native')
const NativeUI = require('react-native-ui')
const {Button, ColoredView} = NativeUI

const {
  ScrollView,
  Text,
  TouchableHighlight
} = React

const RouteView = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    onBack: React.PropTypes.func.isRequired
  },

  render () {
    const {name, onBack} = this.props

    const back = <TouchableHighlight onPress={onBack}>
      <Text style={styles.backButton}>{'<'}</Text>
    </TouchableHighlight>

    return (
      <ColoredView title={name} color='#007AFF' leftComponent={back}>
        <ScrollView style={styles.main}>
          <Text>single</Text>
        </ScrollView>
      </ColoredView>
    )
  }
})

const styles = {
  main: {
    padding: 15
  },
  backButton: {
    fontSize: 25,
    lineHeight: 23,
    padding: 10,
    top: -10,
    color: '#FFF'
  }
}

module.exports = RouteView
