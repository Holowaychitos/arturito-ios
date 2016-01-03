const React = require('react-native')
const _ = require('lodash')
const randomColor = require('randomcolor')
const NativeUI = require('react-native-ui')
const {Button, ColoredView} = NativeUI

const Routes = require('../../data/routes.js')

const {
  StyleSheet,
  View,
  MapView,
  TextInput
} = React

const RouteList = React.createClass({
  propTypes: {
    onChangeRoute: React.PropTypes.func.isRequired
  },

  render () {
    const {onChangeRoute} = this.props

    const parsedRoutes = _.map(Routes, route => {
      return {
        routeId: route.routeId,
        stops: _.map(route.stops, stop => {
          return {
            lat: parseFloat(stop.long),
            long: parseFloat(stop.lat),
            stopName: stop.stopName,
            stopId: stop.stopId
          }
        })
      }
    }).filter((el, index) => {
      return index % 9 === 0
    })

    const stopCoordList = _.map(parsedRoutes, route => {
      return _.map(route.stops, stop => {
        return {
          latitude: stop.lat,
          longitude: stop.long
        }
      })
    })

    return (
      <ColoredView title='Arturito' color='#007AFF'>
        <View style={styles.container}>
          <MapView
            region={{
              latitude: 36.14211,
              longitude: -115.1846213,
              latitudeDelta: 0.4,
              longitudeDelta: 0.4
            }}
            pitchEnabled={false}
            style={styles.map}
            rotateEnabled={false}
            showsUserLocation={false}
            showsPointsOfInterest
            annotations={
              _.map(stopCoordList, (stopCoord, stopCoordIndex) => {
                const stopName = parsedRoutes[stopCoordIndex].stops[0].stopName

                return {
                  latitude: stopCoord[0].latitude,
                  longitude: stopCoord[0].longitude,
                  title: stopName,
                  hasRightCallout: true,
                  rightCalloutView: stopCoord[0].stopName,
                  onRightCalloutPress: onChangeRoute.bind(null, 'ROUTE', {
                    name: stopName.split('@')[0]
                  })
                }
              })
            }
            overlays={_.map(stopCoordList, stopCoord => {
              return {
                coordinates: stopCoord,
                strokeColor: randomColor({
                  luminosity: 'dark'
                }),
                lineWidth: 2
              }
            })} />

          <View style={styles.topContent}>
            <TextInput
              style={styles.textInput}
              placeholder={'¿A dónde quieres ir?'}
              placeholderTextColor={'#888'} />
          </View>
          <View style={styles.innerContent}>
            <Button styles={styles.buttonStyles}
              onPress={onChangeRoute.bind(null, 'ROUTE', {
                name: 'New Yorker',
                routeId: 1618
              })}>
              ¡Buscar ruta!
            </Button>
          </View>
        </View>
      </ColoredView>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1
  },
  topContent: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15
  },
  textInput: {
    flex: 1,
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 2,
    padding: 10,
    fontSize: 14,

    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1
  },
  innerContent: {
    padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
  buttonStyles: {
    flex: 1
  },
  map: {
    flex: 1
  }
})

module.exports = RouteList
