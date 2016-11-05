import PubSub from 'pubsub-js';

export default class ErrorHelper {
  publishError(error) {
    for (var i = 0; i < error.errors.length; i++) {
      var erro = error.errors[i];
      PubSub.publish('errorValidation',erro);
    }
  }
}
