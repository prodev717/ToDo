import { useEffect,useState } from "react";
import Cookies from "js-cookie";
import { Container, Typography, TextField, Button, Checkbox, IconButton, Grid } from '@material-ui/core';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon } from '@material-ui/icons';

function Tasks(){
    const [lis,setLis] = useState([]);
    const [obj,setObj] = useState({});
    const [task,setTask] = useState("");
    function getdata(){
        let data = {
            method:"GET",
            headers:{
                "accept":"application/json",
                "Content-Type":"application/json"
            }
        };
        fetch("http://localhost:8000/getuser?token="+Cookies.get("token"),data).then(res=>res.json())
        .then(res=>{setLis(Object.keys(res.tasks));setObj(res)})
        .catch(e=>console.log(e));
    }
    function addtask(tas,state){
        let data = {
            method:"POST",
            headers:{
                "accept":"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "task":tas,
                "status":state
            })
        };
        fetch("http://localhost:8000/addupdatetask?token="+Cookies.get("token"),data).then(res=>getdata());
    }
    function del(task){
        let data = {
            method:"DELETE",
            headers:{
                "accept":"application/json",
                "Content-Type":"application/json"
            }
        };
        fetch("http://localhost:8000/removetask?token="+Cookies.get("token")+"&rtask="+task,data).then(res=>getdata());
    }
    function logout(){
        Cookies.remove("name");
        Cookies.remove("token");
        window.location.href="/login";
    }
    function delacc(){
        let data = {
            method:"DELETE",
            headers:{
                "accept":"application/json",
                "Content-Type":"application/json"
            }
        };
        fetch("http://localhost:8000/delete?token="+Cookies.get("token"),data).then(res=>res.json())
        .then(res=>{alert(res.success);window.location.href="/login"});
    }
    useEffect(()=>{getdata()},[]);
    return(
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        ToDo App : {Cookies.get("name")}
      </Typography>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <TextField
            id="field"
            label="Add Task"
            variant="outlined"
            autoComplete="off"
            onChange={e=>setTask(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={()=>{addtask(task,false);document.getElementById("field").value="";}}
          >
            Add Task
          </Button>
        </Grid>
        
        
        {lis.map(i=><>
        <Grid item container alignItems="center" spacing={2}>
          <Grid item>
            <Checkbox checked={obj.tasks[i]} onChange={e=>addtask(i,e.target.checked)}/>
          </Grid>
          <Grid item xs>
            <Typography variant="body1">
              {i}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton aria-label="delete" onClick={()=>{del(i)}}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
          </>)}
        
        
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={delacc}
          >
            Delete Account
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={logout}
          >
            Logout
          </Button>
        </Grid>
      </Grid>
    </Container>
    );
}

export default Tasks;