import UserException = require('./user-exception');

class InvalidRequestException extends UserException {
    code:string = 'InvalidRequest';

    constructor(message:string) {
        super('InvalidRequest', message);
    }

    static missingRequiredField(field:string) {
        return new InvalidRequestException('Missing required field: \'' + field + '\'.');
    }
}

export = InvalidRequestException;