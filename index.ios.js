import React from 'react-native'

import RouteList from './src/views/RouteList.js'
import RouteView from './src/views/RouteView.js'

const {Navigator} = React

var {
  AppRegistry
} = React

const atthack = React.createClass({
  render () {
    return <Navigator
      style={{
        backgroundColor: '333'
      }}
      initialRoute={{
        name: 'Arturito',
        route: 'HOME',
        extra: {}
      }}
      renderScene={(currentRoute, navigator) => {
        const RouteComponent = Routes[currentRoute.route]

        return <RouteComponent
          currentRoute={currentRoute}
          onBack={navigator.pop}
          name={currentRoute.name}
          extra={currentRoute.extra}
          onChangeRoute={(route, {name, extra}) => {
            navigator.push({
              name: name,
              extra: extra,
              route: route
            })
          }} />
      }}/>
  }
})

const Routes = {
  HOME: RouteList,
  ROUTE: RouteView
}

AppRegistry.registerComponent('atthack', () => atthack)
