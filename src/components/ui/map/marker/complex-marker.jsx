import React, { useState } from 'react';
import { MarkerF, InfoWindowF } from '@react-google-maps/api';

import { Box, Text } from '@chakra-ui/react';

function ComplexMarker ({ key, marker, icon }) {
    const [showBox, toggleShowBox] = useState(false);
    return (
        <>
            <MarkerF
                key={key}
                name={marker && marker.name}
                position={marker && { lat: parseFloat(marker.position.lat), lng: parseFloat(marker.position.lng) }}
                label={icon ? '' : marker && marker.name}
                icon={icon}
                onClick={() => toggleShowBox(!showBox)}
            />
            { showBox && <InfoWindowF position={marker && { lat: parseFloat( marker.position.lat), lng: parseFloat(  marker.position.lng) }}>
                <Box>
                    <Text color={'blue.50'}>{marker && marker.msg ? marker.msg : marker.name}</Text>
                </Box>
            </InfoWindowF>
            }
        </>
    );
}

export default ComplexMarker;
