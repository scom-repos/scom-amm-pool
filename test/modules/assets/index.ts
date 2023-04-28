import {application} from '@ijstech/components';
import { Styles } from '@ijstech/components';
const moduleDir = application.currentModuleDir;

function fullPath(path: string): string{
    return `${moduleDir}/${path}`
};
export default {
    logo: {
        header: {
            desktop: fullPath('img/logo.svg'),
            tablet: {
                light: fullPath('img/logo-mobile.svg'),
                dark: fullPath('img/logo-mobile-dark.svg'),
            },
            mobile: {
                light: fullPath('img/logo-mobile.svg'),
                dark: fullPath('img/logo-mobile-dark.svg'),
            }
        },
        footer: {
            light: fullPath('img/logo-mobile.svg'),
            dark: fullPath('img/logo-mobile-dark.svg'),
        }
    },
    fullPath
};

Styles.fontFace({
    fontFamily: "Raleway",
    src: `url("${fullPath('fonts/raleway/Raleway-Black.ttf')}") format("truetype")`,
    fontWeight: '900',
    fontStyle: 'normal'
})

Styles.fontFace({
    fontFamily: "Raleway",
    src: `url("${fullPath('fonts/raleway/Raleway-Bold.ttf')}") format("truetype")`,
    fontWeight: 'bold',
    fontStyle: 'normal'
})

Styles.fontFace({
    fontFamily: "Raleway",
    src: `url("${fullPath('fonts/raleway/Raleway-Regular.ttf')}") format("truetype")`,
    fontWeight: '400',
    fontStyle: 'normal'
})

Styles.fontFace({
    fontFamily: "Raleway",
    src: `url("${fullPath('fonts/raleway/Raleway-Italic.ttf')}") format("truetype")`,
    fontWeight: 'normal',
    fontStyle: 'italic'
})