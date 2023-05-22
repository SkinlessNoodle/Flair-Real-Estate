import React, { useState } from 'react';
import Select from 'react-select';
import mbxClient from '@mapbox/mapbox-sdk';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { Container, Row, Button } from 'react-bootstrap';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxApiKey = process.env.REACT_APP_MAP_BOX_API_KEY;

let geocodingClient;

if (mapboxApiKey) {
  const mapboxClient = mbxClient({ accessToken: mapboxApiKey });
  geocodingClient = mbxGeocoding(mapboxClient);
}

const LocationAutocomplete = ({ selectedLocation, onChange, onCoordinatesChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const [viewport, setViewport] = useState({
    latitude: -33.8688,
    longitude: 151.2093
  });

  const [viewState, setViewState] = useState({
    latitude: -33.8688,
    longitude: 151.2093,
    zoom: 8,
  });

  const [marker, setMarker] = useState(null);

  const onViewportChange = (newViewport) => {
    setViewport((prevState) => ({
      ...prevState,
      latitude: newViewport.latitude,
      longitude: newViewport.longitude,
      zoom: newViewport.zoom,
    }));
  };

  const onMove = React.useCallback(({ viewState }) => {
    const newCenter = [viewState.longitude, viewState.latitude];
    setViewState(newCenter);
  }, []);

  const onClickMap = (event) => {
    const { lng: longitude, lat: latitude } = event.lngLat;
    setMarker({ latitude, longitude });

    geocodingClient
      .reverseGeocode({
        query: [longitude, latitude],
        countries: ['au'],
        types: ['address', 'poi'],
        limit: 1,
      })
      .send()
      .then((response) => {
        const features = response.body.features;
        if (features.length > 0) {
          const selectedOption = {
            value: features[0].place_name,
            label: features[0].place_name,
          };
          onChange(selectedOption.value);
          setInputValue(selectedOption.label);
          onCoordinatesChange({ latitude, longitude });
          setOptions([selectedOption]);
        }
      });
  };

  const goToMarker = () => {
    if (marker) {
      setViewState({
        latitude: marker.latitude,
        longitude: marker.longitude
      });
    }
  };

  const handleInputChange = (value) => {

    if ((value && !options.length) || (value !== inputValue)) {
      setInputValue(value)

      geocodingClient
        .forwardGeocode({
          query: value,
          countries: ['au'],
          types: ['address', 'poi'],
          limit: 5,
        })
        .send()
        .then((response) => {
          const features = response.body.features;
          const newOptions = features.map((feature) => ({
            value: feature.place_name,
            label: feature.place_name,
          }));

          setOptions(newOptions);
        });
    }
  };

  const handleSelectChange = (selectedOption) => {
    onChange(selectedOption.value);

    geocodingClient
      .forwardGeocode({
        query: selectedOption.value,
        countries: ['au'],
        limit: 1,
      })
      .send()
      .then((response) => {
        const features = response.body.features;
        if (features.length > 0) {
          const { center } = features[0];
          const newViewport = {
            latitude: center[1],
            longitude: center[0]
          };

          const distance = Math.sqrt(Math.pow((newViewport.latitude - viewport.latitude), 2) + Math.pow((newViewport.longitude - viewport.longitude), 2));
          console.log(distance);
          setViewState(newViewport);
          setMarker({ latitude: center[1], longitude: center[0] });
          onViewportChange(newViewport);
        }
      });
  };

  const handleRemoveMarker = () => {
    setMarker(null);
    setInputValue('');
    onChange(null);
    onCoordinatesChange(null);
  };

  if (!mapboxApiKey) {
    return (
      <Select
        value={selectedLocation}
        onChange={(e) => onChange(e.target.value)}
        placeholder="No Mapbox API key found"
      />
    );
  }

  return (
    <div className='map-container'>
      <Container className='w-100'>
        <Row>
          <Select
            key={selectedLocation}
            className='w-100'
            value={options.find((option) => option.value === selectedLocation)}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleSelectChange}
            options={options}
            placeholder="Search for a location"
          />
        </Row>
        <Row>
          <ReactMapGL className='w-100 h-100'
            {...viewState}
            onMove={onMove}
            width="100%"
            height="100%"
            onViewportChange={onViewportChange}
            mapboxAccessToken={mapboxApiKey}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onClick={onClickMap}
          >
            <Button className='btn btn-danger border-dark' style={{ position: 'absolute', top: 10, left: 10 }}
              onClick={handleRemoveMarker} disabled={!marker}>Remove Marker
            </Button>
            <Button className='btn btn-info border-dark' style={{ position: 'absolute', top: 60, left: 10 }}
              onClick={goToMarker} disabled={!marker}>Go to Marker
            </Button>
            {marker && (
              <Marker
                color='red'
                anchor='center'
                scale={0.7}
                longitude={marker.longitude}
                latitude={marker.latitude}
              >
              </Marker>
            )}
            <NavigationControl />
          </ReactMapGL>
        </Row>
      </Container>
    </div>
  );
};

export default LocationAutocomplete;
