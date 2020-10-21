# RESTSERVER - Menu Online

## Development route
### localhost:3000

## Production route
### https://polar-forest-62784.herokuapp.com/ 

## User endpoints

**FUNCTION: Create user**
**METHOD:** POST
**ENDPOINT:** /user
**HEADERS:** None
**BODY:** `{
    "nombre": "Patricio",
    "email": "patricio@mail.com",
    "password": "1234",
    "role": "ADMIN_ROLE"
}`
**RESPONSE:** `{ "ok": true,
    "user": {
        "role": "ADMIN_ROLE",
        "status": true,
        "google": false,
        "_id": "5f8f4f8e7994d23a58e71657",
        "nombre": "Patricio",
        "email": "patricio@mail.com",
        "__v": 0
    } }`
**ANNOTATIONS:** role is optional and only accept ADMIN_ROLE if you need to create a super user

**FUNCTION: Login user**
**METHOD:** POST
**ENDPOINT:** /login
**HEADERS:** None
**BODY:** `{
    "email": "tsarkon@mail.com",
    "password": "1234"
}`
**RESPONSE:** `{
    "ok": true,
    "user": {
        "role": "ADMIN_ROLE",
        "status": true,
        "google": false,
        "_id": "5f6f6a068ec88e1c1005183e",
        "nombre": "Tsarkon",
        "email": "tsarkon@mail.com",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJBRE1JTl9ST0xFIiwic3RhdHVzIjp0cnVlLCJnb29nbGUiOmZhbHNlLCJfaWQiOiI1ZjZmNmEwNjhlYzg4ZTFjMTAwNTE4M2UiLCJub21icmUiOiJUc2Fya29uIiwiZW1haWwiOiJ0c2Fya29uQG1haWwuY29tIiwiX192IjowfSwiaWF0IjoxNjAzMjE0MTQ2LCJleHAiOjE2MDU4MDYxNDZ9.-YsbdQxsAv0NmV834s6T7m45J-UV5Ddz_8UMpCxvLPY"
}`
**ANNOTATIONS:**

**FUNCTION: Login / Create Google user**
**METHOD:** POST
**ENDPOINT:** /google
**HEADERS:** None
**BODY:** None
**RESPONSE:** `Signed in as {"ok":true,"user":{"role":"USER_ROLE","status":true,"google":true,"_id":"5f73a8ecf840781d203c36ad","nombre":"Sergio Escobar","email":"virtualmodelges@gmail.com","img":"5f73a8ecf840781d203c36ad-921.jpg","__v":0},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJzdGF0dXMiOnRydWUsImdvb2dsZSI6dHJ1ZSwiX2lkIjoiNWY3M2E4ZWNmODQwNzgxZDIwM2MzNmFkIiwibm9tYnJlIjoiU2VyZ2lvIEVzY29iYXIiLCJlbWFpbCI6InZpcnR1YWxtb2RlbGdlc0BnbWFpbC5jb20iLCJpbWciOiI1ZjczYThlY2Y4NDA3ODFkMjAzYzM2YWQtOTIxLmpwZyIsIl9fdiI6MH0sImlhdCI6MTYwMzIyOTI0MCwiZXhwIjoxNjA1ODIxMjQwfQ.ZWmFtSKJUxYZ6fECbrh7StJYdLoGkVeBqgDTFlr4P6M"}`
**ANNOTATIONS:** This method search in the DDBB if the user exist previousle or not. If there is not register user, then create the user automatically with the Google data user.

**FUNCTION: Edit user**
**METHOD:** PUT
**ENDPOINT:** /usuario/:id
**HEADERS:** auth: `place the token here`
**BODY:** `You can change: 'nombre', 'email', 'img', 'role', 'status'`
**RESPONSE:** `{ "ok": true,
    "user": {
        "role": "ADMIN_ROLE",
        "status": true,
        "google": false,
        "_id": "5f70bb2299f1e60cc8c4ebf1",
        "nombre": "GES",
        "email": "tsarkon@mail.com",
        "__v": 0,
        "img": "5f70bb2299f1e60cc8c4ebf1-862.png"
    } }`
**ANNOTATIONS:** It is available only for ADMIN_ROLE

**FUNCTION: Delete user**
**METHOD:** DELETE
**ENDPOINT:** /usuario/:id
**HEADERS:** auth: `place the token here`
**BODY:** None
**RESPONSE:** `{ "ok": true,
    "user": {
        "role": "ADMIN_ROLE",
        "status": false,
        "google": false,
        "_id": "5f8f525ea8e6581798de38ce",
        "nombre": "Patricio1",
        "email": "patricio1@mail.com",
        "__v": 0
    } }`
**ANNOTATIONS:** It is available only for ADMIN_ROLE. This method change the `status: false` does not eliminate from the DDBB.

**FUNCTION: Show users**
**METHOD:** GET
**ENDPOINT:** /usuarios
**HEADERS:** auth: `place the token here`
**BODY:** None
**RESPONSE:** Array of all users
**ANNOTATIONS:** You can use url params for pagination `http://localhost:3000/users?limit=5&from=5`

## Category endpoints

**FUNCTION: Create category**
**METHOD:** POST
**ENDPOINT:** /category
**HEADERS:** auth: `place the token here`
**BODY:** `{
    "description": "Bebidas frías"
}`
**RESPONSE:** `{ "ok": true,
    "category": {
        "_id": "5f8fdf03a8e6581798de38cf",
        "description": "Bebidas frías",
        "user": "5f70bb2299f1e60cc8c4ebf1",
        "__v": 0
    } }`
**ANNOTATIONS:**

**FUNCTION: Edit category**
**METHOD:** PUT
**ENDPOINT:** /category/:id
**HEADERS:** auth: `place the token here`
**BODY:** `{
    "description": "Bebidas frescas"
}`
**RESPONSE:** `{
    "ok": true,
    "category": {
        "_id": "5f8fdf03a8e6581798de38cf",
        "description": "Bebidas frescas",
        "user": "5f70bb2299f1e60cc8c4ebf1",
        "__v": 0
    }
}`
**ANNOTATIONS:**

**FUNCTION: Delete category**
**METHOD:** DELETE
**ENDPOINT:** /category/:id
**HEADERS:** auth: `place the token here`
**BODY:** `{
    "description": "Bebidas frescas"
}`
**RESPONSE:** `{
    "ok": true,
    "message": "Categoría eliminada"
}`
**ANNOTATIONS:**

**FUNCTION: Show all categories**
**METHOD:** GET
**ENDPOINT:** /categories
**HEADERS:** auth: `place the token here`
**BODY:** None
**RESPONSE:** Array of all categories
**ANNOTATIONS:**

**FUNCTION: Show a specific category**
**METHOD:** GET
**ENDPOINT:** /category/:id
**HEADERS:** auth: `place the token here`
**BODY:** None
**RESPONSE:** `{
    "ok": true,
    "category": {
        "_id": "5f8c2c4c581709536cd49a31",
        "description": "Bebidas Calientes",
        "user": {
            "_id": "5f70bb2299f1e60cc8c4ebf1",
            "nombre": "GES"
        },
        "__v": 0
    }
}`
**ANNOTATIONS:**

## Product endpoint

**FUNCTION: Create product**
**METHOD:** POST
**ENDPOINT:** /product
**HEADERS:** auth: `place the token here`
**BODY:** `{
    "name": "Lomo con queso",
    "description": "Lomo ibérico y queso gouda",
    "prize": 7.80,
    "category": "5f8c2c68581709536cd49a33"
}`
**RESPONSE:** `{
    "ok": true,
    "product": {
        "available": true,
        "_id": "5f8ff72a87bb3a3d0c2d7fe2",
        "name": "Lomo con queso",
        "prize": 7.8,
        "description": "Lomo ibérico y queso gouda",
        "user": {
            "_id": "5f70bb2299f1e60cc8c4ebf1",
            "nombre": "GES"
        },
        "category": {
            "_id": "5f8c2c68581709536cd49a33",
            "description": "Bocadillos"
        },
        "__v": 0
    }
}`
**ANNOTATIONS:** name, prize and category are required. For category you need to use the id.

**FUNCTION: Edit product**
**METHOD:** PUT
**ENDPOINT:** /product/:id
**HEADERS:** auth: `place the token here`
**BODY:** `{
    "name": "Patatas Bravas",
    "category": "5f8c2bba581709536cd49a2e",
    "available": true,
    "prize": 3.80,
    "description": "Muy picantes"
}`
**RESPONSE:** `{
    "ok": true,
    "product": {
        "available": true,
        "_id": "5f8c65e52bf6f21724e6774a",
        "name": "Patatas Bravas",
        "prize": 3.8,
        "description": "Muy picantes",
        "user": {
            "_id": "5f70bb2299f1e60cc8c4ebf1",
            "nombre": "GES"
        },
        "category": {
            "_id": "5f8c2bba581709536cd49a2e",
            "description": "Tapas"
        },
        "__v": 0
    }
}`
**ANNOTATIONS:** name, prize and category are required. For category you need to use the id. Available is boolean and change the availability of a product.

**FUNCTION: Delete product**
**METHOD:** DELETE
**ENDPOINT:** /product/:id
**HEADERS:** auth: `place the token here`
**BODY:** None
**RESPONSE:** `{
    "ok": true,
    "message": "El producto Lomo con queso ha sido eliminado"
}`
**ANNOTATIONS:** Available is boolean and change the availability of a product to false, then it is not show in GET method.

**FUNCTION: Show all products**
**METHOD:** GET
**ENDPOINT:** /products
**HEADERS:** auth: `place the token here`
**BODY:** None
**RESPONSE:** Array of all products
**ANNOTATIONS:** You can use url params for pagination `http://localhost:3000/products?limit=5&from=5`

**FUNCTION: Show a specific product**
**METHOD:** GET
**ENDPOINT:** /product/:id
**HEADERS:** auth: `place the token here`
**BODY:** None
**RESPONSE:** `{
    "ok": true,
    "product": {
        "available": true,
        "_id": "5f8c57610dc61f47706d0e05",
        "name": "Café con leche",
        "prize": 1.8,
        "description": "Con bebida de avena",
        "user": {
            "_id": "5f70bb2299f1e60cc8c4ebf1",
            "nombre": "GES"
        },
        "category": {
            "_id": "5f8c2c4c581709536cd49a31",
            "description": "Bebidas Calientes"
        },
        "__v": 0,
        "img": "5f8c57610dc61f47706d0e05-349.jpg"
    }
}`
**ANNOTATIONS:** img can create / edit in another endpoint `/upload/:type/:id`

**FUNCTION: Search a specific product**
**METHOD:** GET
**ENDPOINT:** /product/search/:title
**HEADERS:** auth: `place the token here`
**BODY:** None
**RESPONSE:** Array of all products related to the title used on the url params
**ANNOTATIONS:** **/:title** it is the concept that we used for searching a specific product

## Upload image endpoint

**FUNCTION: Upload an image**
**METHOD:** PUT
**ENDPOINT:** /upload/:type/:id
**HEADERS:** auth: `place the token here`
**BODY:** formData - type: file - key: newFile
**RESPONSE:** `{
    "ok": true,
    "product": {
        "available": true,
        "_id": "5f8c65e52bf6f21724e6774a",
        "name": "Patatas Bravas",
        "prize": 3.8,
        "description": "Muy picantes",
        "user": "5f70bb2299f1e60cc8c4ebf1",
        "category": "5f8c2bba581709536cd49a2e",
        "__v": 0,
        "img": "5f8c65e52bf6f21724e6774a-594.jpg"
    },
    "image": "5f8c65e52bf6f21724e6774a-594.jpg"
}`
**ANNOTATIONS:** **/:type** only accept next values: `products` related the image to a specific product. `users` related the image to a specific user. The images will be upload in the folder `uploads`. **/:id** will be related to the product or user that needs to upload the image.

## Show image endpoint

**FUNCTION: Show an image** 
**METHOD:** GET 
**ENDPOINT:** /image/:type/:img?token
**HEADERS:** It is sending in the url
**BODY:** None
**RESPONSE:** The image will be show
**ANNOTATIONS:** **/:type** only accept next values: `products` related the image to a specific product. `users` related the image to a specific user. You need to put the user token in the url param `token`.