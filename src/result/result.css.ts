import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export default Styles.style({
  textAlign: 'center',
  $nest: {
    'i-label > *': {
      // color: Theme.text.primary,
      fontSize: '.875rem',
      wordBreak: 'normal'
    },
    '.modal': {
      minWidth: '25%',
      maxWidth: '100%',
      width: 455,
      background: '#252a48',
      borderRadius: 12
    },
    '.i-modal-close svg': {
      fill: '#F05E61'
    },
    '.i-modal_content': {
      padding: '0 2.563rem 1.5rem'
    },
    '.i-modal_header': {
      borderBottom: 'none !important'
    },
    '.waiting-txt > *': {
      color: '#F6C958',
      fontSize: '1.125rem'
    },
    '.confirm-txt > *': {
      color: '#C2C3CB'
    },
    '.red-link *': {
      color: '#FD4A4C',
      textDecoration: 'none'
    },
    '.mb': {
      marginBottom: '1rem'
    },
    'i-button': {
      padding: '1rem 2rem',
      textAlign: 'center'
    },
    '.address-txt > *': {
      lineHeight: '1.5rem'
    },
    '.btn-submit': {
      padding: '.35rem 2.438rem',
      borderRadius: 5
    },
    '.btn-cancel': {
      padding: '.35rem 2.438rem',
      borderRadius: 5,
      background: '#2B304A 0% 0% no-repeat padding-box'
    },
    '.btn-os': {
      background: 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box',
      fontFamily: 'Raleway Bold',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: Theme.colors.secondary.main
    }
  }
})