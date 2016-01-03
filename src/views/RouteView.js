const React = require('react-native')
const {
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  DeviceEventEmitter,
  MapView,
  Image
} = React

const NativeUI = require('react-native-ui')
const {
  ColoredView
} = NativeUI

const _ = require('lodash')

const route = [{"coordinates":[{"latitude":36.247885,"longitude":-115.241129},{"latitude":36.243418,"longitude":-115.242348},{"latitude":36.239584,"longitude":-115.242358},{"latitude":36.23578,"longitude":-115.242393},{"latitude":36.231903,"longitude":-115.242427},{"latitude":36.229585,"longitude":-115.242415},{"latitude":36.224785,"longitude":-115.242414},{"latitude":36.221195,"longitude":-115.242405},{"latitude":36.217347,"longitude":-115.24243},{"latitude":36.215033,"longitude":-115.242406},{"latitude":36.210149,"longitude":-115.242391},{"latitude":36.20647,"longitude":-115.242386},{"latitude":36.202831,"longitude":-115.2424},{"latitude":36.19934,"longitude":-115.24239},{"latitude":36.194403,"longitude":-115.242406},{"latitude":36.191834,"longitude":-115.242414},{"latitude":36.187962,"longitude":-115.242414},{"latitude":36.185028,"longitude":-115.242402},{"latitude":36.180135,"longitude":-115.242479},{"latitude":36.173039,"longitude":-115.244581},{"latitude":36.169996,"longitude":-115.244534},{"latitude":36.165939,"longitude":-115.244469},{"latitude":36.161132,"longitude":-115.244019},{"latitude":36.158408,"longitude":-115.243867},{"latitude":36.154912,"longitude":-115.243678},{"latitude":36.150976,"longitude":-115.243466},{"latitude":36.147311,"longitude":-115.243281},{"latitude":36.14347,"longitude":-115.24309},{"latitude":36.08441,"longitude":-115.242962}],"strokeColor":"#820233","lineWidth":2}];

const stopMinors = [12345, 22345, 21001, 28944, 61306]

const Beacons = require('react-native-ibeacon')
const region = {
  identifier: '',
  uuid: '05E9919B-70F4-4592-94BB-9150DA7B9033',
  major: 21737
}

// Request for authorization while the app is open
Beacons.requestWhenInUseAuthorization()
Beacons.startMonitoringForRegion(region)
Beacons.startRangingBeaconsInRegion(region)
Beacons.startUpdatingLocation()

const Routes = require('../../data/routes.js')

const RouteView = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    onBack: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      position: null,
      immediate: [],
      busData: {}
    }
  },

  updateBusData () {
    fetch('http://dbug.mx/bus/123', {
      method: 'GET'
    }).then(res => {
      const body = JSON.parse(res._bodyInit)

      this.setState({
        busData: body.busRouteInfo
      })
    })

    if (this.isMounted()) {
      setTimeout(this.updateBusData, 500)
    }
  },

  componentDidMount () {
    DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        const immediate = _(data.beacons).filter({proximity: 'immediate'}).map('minor').value()

        this.setState({
          immediate: immediate,
          position: immediate[0] ? immediate[0] : this.state.position
        })
      }
    )

    this.updateBusData()
  },

  render () {
    const {name, onBack} = this.props
    const {position, busData} = this.state

    const back = <TouchableHighlight onPress={onBack}>
      <Text style={styles.backButton}>{'<'}</Text>
    </TouchableHighlight>

    if (_.isEmpty(busData)) return null

    const busMagnitude = parseFloat(_.findKey(busData.stops, {stopId: busData.currentStopId}))
    const userMagnitude = parseFloat(stopMinors.indexOf(position) + 1)

    const estimatedTime = position ? (userMagnitude - busMagnitude + 1) * 5 : '?'

    return (
      <ColoredView title={name} color='#007AFF' leftComponent={back}>
        <View style={styles.main}>
          {_.map(busData.stops.slice(0, 5), (stop, stopIndex) => {
            const isUserHere = position === stopMinors[stopIndex]
            const isBusHere = busData.currentStopId === stop.stopId

            return <View key={stop.stopId} style={position === stopMinors[stopIndex] ? {...styles.stop, ...styles.stopHighlight} : styles.stop}>
              <Text style={styles.stopText}>{stop.stopName}</Text>

              {(isUserHere && !isBusHere) && <Text>Estás aquí</Text>}
              {(isBusHere && !isUserHere) && (
                <View style={{alignItems: 'center'}}>
                  <Image style={styles.busImage} source={{uri: 'https://image.freepik.com/free-icon/bus-front_318-33490.png'}} />
                  <Text style={styles.textSmall}>{estimatedTime} mins</Text>
                </View>
              )}

              {(isUserHere && isBusHere) && (
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textSmall}>En camino!</Text>
                  <Text style={styles.textSmall}>Llegas en {(5 - userMagnitude + 1) * 5} mins</Text>
                </View>
              )}
            </View>
          })}
        </View>

        <MapView
          overlays={route}
          style={styles.map}
          region={{
            latitude: 36.14211,
            longitude: -115.1846213,
            latitudeDelta: 0.4,
            longitudeDelta: 0.4
          }}
          pitchEnabled={false}
          rotateEnabled={false}
          showsUserLocation={false} />
      </ColoredView>
    )
  }
})

const rowSize = 50

const styles = {
  main: {
  },
  stop: {
    paddingLeft: rowSize / 2,
    paddingRight: rowSize / 2,
    height: rowSize,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  stopText: {
    flex: 1
  },
  busImage: {
    height: 15,
    width: 18,
    marginBottom: 4
  },
  map: {
    flex: 1
  },
  textSmall: {
    fontSize: 11
  },
  stopHighlight: {
    backgroundColor: '#e0e1e3'
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
