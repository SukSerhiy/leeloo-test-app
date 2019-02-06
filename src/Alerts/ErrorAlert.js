import Alert from 'react-s-alert';

export default (message) => (
  Alert.error(message, {
    position: 'bottom-right',
    effect: 'slide',
    timeout: 'none'
  })
)