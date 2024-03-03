import { Image } from '@chakra-ui/react';
import React from 'react';

function Logo ({ logo, w, h }) {
    return logo && <Image fit={'scale-down'} w={w} h={h} className="logo" src={logo} />;
}
export default Logo;
