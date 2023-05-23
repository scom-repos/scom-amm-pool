import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const customStyle = Styles.style({
  $nest: {
    'input': {
      paddingLeft: '10px'
    },
    '.pool-network-select': {
      $nest: {
        '.os-modal .modal': {
          background: Theme.combobox.background
        },
        '.modal > i-panel': {
          borderRadius: 8
        },
        'i-label': {
          fontSize: '1rem !important'
        },
        '.list-item': {
          padding: '0.5rem 1rem !important'
        }
      }
    }
  }
})

export const tableStyle = Styles.style({
  $nest: {
    '.i-table-header>tr>th': {
      fontSize: '0.875rem !important',
      opacity: 0.6
    }
  }
})
