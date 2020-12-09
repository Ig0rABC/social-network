class AppException(Exception):

    def __init__(self):
        Exception.__init__(self)
        self.message = 'Not specified error'
        self.status_code = 400

    def to_dict(self):
        return {'message': self.message}


class NotOnlyRequiredPayloadProps(AppException):

    def __init__(self, props=[]):
        Exception.__init__(self)
        self.message = f'Specify only required props in payload: {props}'
        self.status_code = 400


class NotOnlyRequiredQueryParams(AppException):

    def __init__(self, params=[]):
        Exception.__init__(self)
        self.message = f'Specify only required query-string parameters: {params}'
        self.status_code = 400


class InvalidContactsError(AppException):

    def __init__(self, contacts=[]):
        Exception.__init__(self)
        self.message = f'Invalid contacts: {contacts}'
        self.status_code = 400


class IncorrectLoginError(AppException):

    def __init__(self):
        Exception.__init__(self)
        self.message = f'Incorrect login'
        self.status_code = 401


class IncorrectPasswordError(AppException):

    def __init__(self):
        Exception.__init__(self)
        self.message = f'Incorrect password'
        self.status_code = 401


class NotUniqueLoginError(AppException):

    def __init__(self):
        Exception.__init__(self)
        self.message = 'User with this login already exists'
        self.status_code = 401


class AuthenticationError(AppException):

    def __init__(self):
        Exception.__init__(self)
        self.message = 'Wrong login or password'
        self.status_code = 401


class EmptyPayloadError(AppException):

    def __init__(self):
        Exception.__init__(self)
        self.message = 'Empty payload'
        self.status_code = 400


class CategoryDoesNotExist(AppException):

    def __init__(self, category="", categories=[]):
        Exception.__init__(self)
        self.message = f'Category \'{category}\' doesn\'t exist. Specify category from those: {categories}'
        self.status_code = 400
