import UserException = require('./user-exception');

class InvalidRequestException extends UserException {
    code:string = 'InvalidRequest';

    constructor(message:string) {
        super('InvalidRequest', message);
    }

    static missingRequiredField(field:string) {
        return new InvalidRequestException('Missing required field: \'' + field + '\'.');
    }

    static invalidFieldValue(field: string) {
        return new InvalidRequestException('Invalid value for field: \'' + field + '\'.');
    }
}

export = InvalidRequestException;