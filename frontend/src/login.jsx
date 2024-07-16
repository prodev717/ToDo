import { useState } from "react";
import Cookies from "js-cookie";
import { Card,CardContent,TextField,Button,Typography,Link,Grid } from "@material-ui/core";

function Login(){
    const [name,setname] = useState("");
    const [password,setpassword] = useState("");
    const [message,setmessage] = useState("");
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
        };
        try{
            let res = await fetch("http://localhost:8000/login",data);
            let resjson = await res.json();
            if(res.status==200){
                Cookies.set("name",resjson.user_name);
                Cookies.set("token",resjson.token);
                setname("");
                setpassword("");
                setmessage("successfully logged in");
                window.location.href = "/tasks";
            }else{setmessage("something went wrong");}
        }catch(e){setmessage("something went wrong");}
    }
    return(
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom align="center">
                Login
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
                            onChange={e=>setpassword(e.target.value)}
                        />
                        </Grid>
                        <Grid item>
                        <Button variant="contained" color="primary" fullWidth type="submit" onClick={submit}>
                            Login
                        </Button>
                        </Grid>
                        <Grid item>
                        <Typography variant="body2" align="center">
                            Don't have an account? <Link href="/signup">Sign up</Link>
                        </Typography>
                        </Grid>
                        <Grid item>
                            <div>{message?<Typography variant="body2" align="center">{message}</Typography>:null}</div>
                        </Grid>
                    </Grid>
                </div>
            </CardContent>
            </Card>
        </Grid>
    );
}

export default Login;