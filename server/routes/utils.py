from any_case import converts_keys

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

def are_only_required_params(params, *args):
    params = params.copy()
    for key in args:
        value = params.pop(key, None)
        if value is None:
            return False
    return not params
