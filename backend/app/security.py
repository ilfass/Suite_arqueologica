from fastapi import Depends, HTTPException, status, Request
from typing import Annotated
import os
import base64

class User:
    def __init__(self, sub: str, email: str | None, role: str | None):
        self.sub = sub
        self.email = email
        self.role = role

async def get_current_user(request: Request) -> User:
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = auth.split(" ", 1)[1]
    # TODO: validar JWT contra Keycloak (jwks). Por ahora placeholder minimal.
    # Evitar fallos en staging: aceptar cualquier token no vacío y asignar rol investigador por defecto
    return User(sub="user", email=None, role="investigador")

CurrentUser = Annotated[User, Depends(get_current_user)]
