import React, { useEffect, useState, createContext } from 'react';

const bigDipOruby = '#E53E3E';

const purple = '#2c3895';
const lightBlue = '#5cc8ff';
const lightOrange = '#ffd400';
const lightRed = '#e83151';

const lightGreen = '#9fd356';


const seaGreen = '#3E885B';
const yellowMunsell = '#E7C51C';
const lightGray = '#CFD2D5';
const middleGray = '#898381';
const indigoBlue = '#2D4868';
const lapisLazuli = '#3b608aff';

const oxfordblue = ' #000000';
const royalbluedark = '#191d25';
const indigodye = '#9F7AEA';
const cgblue = '#1282a2ff';
const white = '#fefcfbff';

const lavenderweb = '#f8f9fa';
const periwinklecrayola2 = '#dee2e6';
const periwinklecrayola3 = '#ced4da';
const lightsteelblue = '#adb5bd';
const babyblueeyes = '#6c757d';

const cardColor = '#1b254b';

const tablecellGray = '#2D3748';
const tablecelllight = '#C4C4C4';


const backgroundColorDark = '#171821'
const backgroundColorDarkSecondary = '#21222D'
const backgroundColorDarkTertiary = '#5F6C7A'

const backgroundColorLight = '#F4F7FE'
const backgroundColorLightSecondary = '#FFFFFF'
const backgroundColorLightTertiary = '#A3AED0'
const textLightPrimary = '#2B3674'
const mintGreen = '#7551FF'
const darkMintGreen = '#11047A'

const darkModeColors = {
    primary: {
        100: backgroundColorDark,
        80: backgroundColorDarkSecondary,
        60: backgroundColorDarkTertiary,
        40: cgblue,
        30:backgroundColorDarkSecondary
    },
    secondary: {
        100: lavenderweb,
        80: lightsteelblue,
        60: periwinklecrayola2,
        40: periwinklecrayola3,
        20: lightsteelblue,
        10: babyblueeyes
    },
    success: {
        100: seaGreen
    },
    warning: {
        100: yellowMunsell
    },
    action: {
        100: mintGreen
    },
    tag: {
        100: backgroundColorDarkTertiary
    },
    danger: {
        100: bigDipOruby
    },
    text: {
        secondary: '#87888C',
        gray: {
            100: lightGray,
            50: middleGray,
        },
        primary: white,
        tertiary: '#000000',
        success: '#228B22',
        warning: '#FCB859',

    },
    blue: {
        100: indigoBlue,
        50: lapisLazuli
    },
    datetimepicker: {
        700: oxfordblue,
        500: indigodye,
        200: cgblue
    },
    chart: {
        100: purple,
        80: lightBlue,
        60: lightOrange,
        40: lightRed,
        20: lightGreen
    },
    card: {
        100: cardColor,
        50: periwinklecrayola2
    },
    company: {
        logo: periwinklecrayola2
    },
    table: {
        cell: tablecellGray
    }
};

const lightModeColors = {
    primary: {
        100: backgroundColorLight,
        80: backgroundColorLightSecondary,
        60: backgroundColorLightTertiary,
        40: periwinklecrayola3,
        30: backgroundColorLightSecondary,
        20: lightsteelblue,
        10: babyblueeyes
    },
    secondary: {
        100: oxfordblue,
        80: royalbluedark,
        60: indigodye,
        40: cgblue
    },
    success: {
        100: seaGreen
    },
    warning: {
        100: yellowMunsell
    },
    action: {
        100: darkMintGreen
    },
    tag: {
        100: backgroundColorLightTertiary
    },
    danger: {
        100: bigDipOruby
    },
    text: {
        primary: textLightPrimary,
        gray: {
            50: lightGray,
            100: middleGray
        },
        secondary: '#87888C',
        tertiary: '#FFFFFF',
        success: '#228B22',
        warning: '#FCB859',
    },
    blue: {
        50: indigoBlue,
        100: lapisLazuli
    },
    datetimepicker: {
        700: babyblueeyes,
        500: lightsteelblue,
        200: lavenderweb
    },
    chart: {
        100: purple,
        80: lightBlue,
        60: lightOrange,
        40: lightRed,
        20: lightGreen
    },
    card: {
        100: periwinklecrayola2,
        50: cardColor
    },
    company: {
        logo: periwinklecrayola2
    },
    table: {
        cell: tablecelllight
    }
};

const ThemeContext = createContext();

function ThemeProvider (props) {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkmode') === 'true');
    const [theme, setTheme] = useState({});

    useEffect(() => {
        const colors = darkMode ? darkModeColors : lightModeColors;
        const theme = {
            colors,
            styles: {
                global: {
                    body: {
                        bg: 'primary.100',
                        fontFamily: 'DM Sans, sans-serif'
                    },
                    html: {
                        fontFamily: 'DM Sans, sans-serif'
                    },
                    a: {
                        color: 'secondary.100',
                        _hover: {
                            textDecoration: 'underline'
                        }
                    }
                }
            },
            components: {
                baseStyle: {
                    Text: {
                        primaryFontColor: 'primary.100',
                        secondaryFontColor: 'secondary.100'
                    }
                }
            }
        };
        setTheme(theme);
    }, [darkMode]);

    const toggleDarkMode = () => {
        const currentValue = localStorage.getItem('darkmode') === 'true';
        localStorage.setItem('darkmode', !currentValue);
        setDarkMode(!currentValue);
    };

    return (
        <div>
            <ThemeContext.Provider value={{ theme, toggleDarkMode, darkMode }}>
                {props.children}
            </ThemeContext.Provider>
        </div>
    );
}

export { ThemeContext, ThemeProvider };
