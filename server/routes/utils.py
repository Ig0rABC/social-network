from json import loads
from flask import jsonify
from any_case import converts_keys, to_camel_case
from exceptions import NotOnlyRequiredPayloadProps

def are_params_safe(params):
    if 'user_id' in converts_keys(params, case='snake'):
        return False
    return True

def set_filter_params(default_limit, max_limit, params):
    params.setdefault('limit', default_limit)
    params['limit'] = int(params['limit'])
    if params['limit'] > max_limit:
        params['limit'] = max_limit
    params.setdefault('offset', 0)

def check_only_required_payload_props(payload, *args):
    payload = payload.copy()
    for key in args:
        if payload.pop(key, None) is None:
            raise NotOnlyRequiredPayloadProps(args)
    if payload:
        raise NotOnlyRequiredPayloadProps(args)

def check_only_required_query_params(params, *args):
    params = params.copy()
    for key in args:
        if params.pop(key, None) is None:
            raise NotOnlyRequiredPayloadProps(args)
    if params:
        raise NotOnlyRequiredPayloadProps(args)

def put_out_author(object):
    author = {
        'id': object.pop('author_id'),
        'login': object.pop('login'),
        'photo_url': object.pop('photo_url')
    }
    object['author'] = author

def put_out_contacts(object):
    contacts = {
        'email': object.pop('email'),
        'github': object.pop('github'),
        'telegram': object.pop('telegram'),
        'instagram': object.pop('instagram'),
        'vk': object.pop('vk')
    }
    object['contacts'] = contacts

def get_params_and_payload(request):
    return [
        converts_keys(request.args.to_dict(), case='snake'),
        converts_keys(loads(request.data), case='snake')
    ]
