from json import loads
from flask import jsonify
from any_case import converts_keys, to_camel_case
from exceptions import (
    NotOnlyRequiredPayloadProps,
    InvalidContactsError,
    IncorrectLoginError,
    IncorrectPasswordError
)
from settings import (
    CONTACTS_PATTERNS,
    LOGIN_PATTERN,
    PASSWORD_PATTERN
)


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


def validate_login(login):
    if not LOGIN_PATTERN.fullmatch(login):
        raise IncorrectLoginError


def validate_password(password):
    if not PASSWORD_PATTERN.fullmatch(password):
        raise IncorrectPasswordError


def validate_contacts(contacts):
    invalid = []
    for key, value in contacts.items():
        if key not in CONTACTS_PATTERNS:
            continue
        if not (key or CONTACTS_PATTERNS[key].fullmatch(value)):
            invalid.append(key)
    if invalid:
        raise InvalidContactsError(invalid)


def put_out_author(model):
    author = {
        'id': model.pop('author_id'),
        'login': model.pop('login'),
        'photo_url': model.pop('photo_url')
    }
    model['author'] = author


def put_out_contacts(profile):
    profile['contacts'] = {
        key: profile.pop(key)
        for key in [
            'github',
            'telegram',
            'email',
            'vk',
            'facebook',
            'twitter',
            'instagram',
            'phone_number'
        ]
    }


def get_params_and_payload(request):
    return [
        converts_keys(request.args.to_dict(), case='snake'),
        converts_keys(loads(request.data), case='snake')
    ]
