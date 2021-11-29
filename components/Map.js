import React from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"

const Map = ({ location }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    GMAPS_API_KEY: process.env.GMAPS_API_KEY,
  })

  console.log("location.lat", location.lat)
  const containerStyle = {
    width: "100%",  
    height: "400px",
  }

  console.log(location.lat)
  const center = {
    lat: location.lat,
    lng: location.lng,
  }

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds()
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker
        position={{ lat: location.lat, lng: location.lng }}
        icon={{
          url: image,
          anchor: new google.maps.Point(-1.2, 115),
        }}
      />
      <></>
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(Map)
