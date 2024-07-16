from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hashlib import sha256
import json
import jwt

KEY = "f6a2ee503d165759be82d5d752703cc3"
ALGORITHM = "HS256"
SALT = "teamX"
users = {}
app = FastAPI(title="ToDo",version="0.0.1")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
	user_name : str
	password : str

class Task(BaseModel):
	task : str
	status : bool

def hashpass(pas):
	return sha256(pas.encode()).hexdigest()

def check_user(user,pas,db):
	if user in db:
		if db[user]["password"] == hashpass(pas+SALT):
			return True
		else:
			return False
	else:
		return False

@app.on_event("startup")
async def init():
	global users
	with open("data.json","r") as f:
		users = json.load(f)

@app.on_event("shutdown")
async def save():
	with open("data.json","w") as f:
		json.dump(users, f)

@app.get("/getdb",status_code=200)
def get_db(pas:str):
	if pas==KEY:
		return users
	else:
		raise HTTPException(401,detail="invalid admin access")

@app.post("/register",status_code=201)
def create_new_user(user:User):
	users[user.user_name] = {"user name":user.user_name,
							 "password":hashpass(user.password+SALT),
							 "tasks":{}}
	return {"success":"user "+user.user_name+" created successfully"}

@app.post("/login",status_code=200)
def login(user:User):
	if check_user(user.user_name,user.password, users):
		return {"user_name":user.user_name,"token":jwt.encode({"user_name":user.user_name}, KEY,algorithm=ALGORITHM)}
	else:
		raise HTTPException(401,detail="invalid credentials")

@app.delete("/delete",status_code=200)
def delete_user(token:str):
	try:
		data = jwt.decode(token,KEY,algorithms=[ALGORITHM])
		del users[data.get("user_name")]
		return {"success":"user "+data.get("user_name")+" deleted"}
	except:
		raise HTTPException(401,detail="invalid token")

@app.get("/getuser",status_code=200)
def get_user_data(token:str):
	try:
		data = jwt.decode(token,KEY,algorithms=[ALGORITHM])
		return users[data.get("user_name")]
	except:
		raise HTTPException(401,detail="invalid token")

@app.post("/addupdatetask",status_code=200)
def add_update_task(token:str,rtask:Task):
	try:
		data = jwt.decode(token,KEY,algorithms=[ALGORITHM])
		users[data.get("user_name")]["tasks"][rtask.task]=rtask.status
		return {"success":"new task added/updated to user "+data.get("user_name")}
	except:
		raise HTTPException(401,detail="invalid token")

@app.delete("/removetask",status_code=200)
def delete_task(token:str,rtask:str):
	try:
		data = jwt.decode(token,KEY,algorithms=[ALGORITHM])
		del users[data.get("user_name")]["tasks"][rtask]
		return {"success":"task deleted to user "+data.get("user_name")}
	except:
		raise HTTPException(401,detail="invalid token")