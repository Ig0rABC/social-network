class SocialNetworkException(Exception):
    pass

class NotOnlyRequiredPayloadProps(SocialNetworkException):

    def __init__(self, props=[]):
        Exception.__init__(self)
        self.message = f'Specify only required props in payload: {props}'
        self.status_code = 400

    def to_dict(self):
        return {'message': self.message}

class NotOnlyRequiredQueryParams(SocialNetworkException):
    
    def __init__(self, params=[]):
        Exception.__init__(self)
        self.message = f'Specify only required query parameters in request: {params}'
        self.status_code = 400

    def to_dict(self):
        return {'message': self.message}
