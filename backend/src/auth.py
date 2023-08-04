import json
import ssl
from flask import request, _request_ctx_stack
from functools import wraps
from jose import jwt
from urllib.request import urlopen

AUTH0_DOMAIN = 'dev-q2wxneobv523a517.eu.auth0.com'
ALGORITHMS = ['RS256']
API_AUDIENCE = 'http://0.0.0.0:5000/exams'


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    """
    Obtains the Access Token from the Authorization Header
    """
    auth = request.headers.get('Authorization', None)

    if not auth:
        raise AuthError({
            'code': 'authorization_header_missing',
            'description': 'Authorization header is expected.'
        }, 401)

    parts = auth.split()

    if parts[0].lower() != 'bearer':
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must start with "Bearer".'
        }, 401)
    elif len(parts) == 1:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Token not found.'
        }, 401)

    elif len(parts) > 2:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must be bearer token.'
        }, 401)

    token = parts[1]
    return token


def requires_auth(f):
    """
    Determines if the Access Token is valid
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        token = get_token_auth_header()
        print(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json", context=ctx)
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e'],
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer='https://' + AUTH0_DOMAIN + '/'
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({
                    'code': 'token_expired',
                    'description': 'Token expired.'
                }, 401)
            except jwt.JWTClaimsError:
                raise AuthError({
                    'code': 'invalid_cliams',
                    'description': 'Incorrect claims. Please, check the audience and issuer.'    
                }, 401)
            except Exception:
                raise AuthError({
                    'code': 'invalid_header',
                    'description': 'Unable to parse authentication token.'
                }, 400)

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Unable to find the appropriate key.'
        }, 400)
    return decorated
