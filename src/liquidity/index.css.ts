import { Styles } from '@ijstech/components';

export const poolAddStyle = Styles.style({
  $nest: {
    'i-scom-token-input': {
      $nest: {
        '#gridTokenInput': {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4
        },
        '#inputAmount': {
          width: 'calc(100% - 180px) !important',
          minWidth: 100,
          height: '36px !important'
        },
        '#pnlSelection': {
          width: 'auto !important',
          marginLeft: 'auto'
        }
      }
    }
  }
})


export const poolRemoveStyle = Styles.style({
  $nest: {
    'i-scom-token-input': {
      $nest: {
        '#gridTokenInput': {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4
        },
        '#inputAmount': {
          width: 'calc(100% - 150px) !important',
          minWidth: 100,
          height: '36px !important'
        },
        '#pnlSelection': {
          width: 'auto !important',
          marginLeft: 'auto'
        }
      }
    }
  }
})
