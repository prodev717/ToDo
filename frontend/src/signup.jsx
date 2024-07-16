import { useState } from "react";
import validator from "validator";
import { Card,CardContent,TextField,Typography,Button,Link,Grid } from "@material-ui/core";

function Signup() {
  const [message,setmessage] = useState("");
  const [name,setname] = useState("");
  const [password,setpassword] = useState("");
  function val(e){
    if(validator.isStrongPassword(e,{minLength:8,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})){
      setmessage("strong password");
    }else if(e.length===0){setmessage("");
    }else{setmessage("not a strong password");}
  }
  async function submit(){
    let data = {
        method:"POST",
        headers:{
            "accept":"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "user_name":name,
            "password":password
        })
    }
    if(message==="strong password"){  
        try{
            let res = await fetch("http://localhost:8000/register",data);
            let resjson = await res.json();
            if(res.status==201){
                setname("");
                setpassword("");
                setmessage(resjson.success);
            }else{
                setmessage("something went wrong");    
            }
        }catch(e){setmessage("something went wrong");}
    }else{setmessage("strong password requried");}
  }
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom align="center">
            Sign up
            </Typography>
            <div>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                    <TextField
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        autoComplete="off"
                        fullWidth
                        required
                        onChange={e=>setname(e.target.value)}
                    />
                    </Grid>
                    <Grid item>
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        onChange={e=>{setpassword(e.target.value);val(e.target.value)}}
                    />
                    </Grid>
                    <Grid item>
                    <Button variant="contained" color="primary" fullWidth type="submit" onClick={submit}>
                        sign up
                    </Button>
                    </Grid>
                    <Grid item>
                    <Typography variant="body2" align="center">
                        Already have an account? <Link href="/login">Login</Link>
                    </Typography>
                    </Grid>
                    <Grid item>
                        <div>{message?<Typography variant="body2" align="center" gutterBottom>{message}</Typography>:null}</div>
                    </Grid>
                </Grid>
                <Typography variant="caption" gutterBottom>password should have minimum 8 characters<br/>1 symbol, 1 uppercase and 1 number.</Typography>
            </div>
        </CardContent>
        </Card>
    </Grid>
  );
}

export default Signup;
